from django.shortcuts import render, get_object_or_404, redirect
# from django.contrib.auth.decorators import login_required
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from auth_service.models import *
from .models import *
from sklearn.feature_extraction.text import TfidfVectorizer

# to get mentor profile for student to view
def mentor_profile(request, mentor_id):
    mentor = get_object_or_404(Mentor_profile, id=mentor_id) 
    return render(request, 'mentor_profile.html', {'mentor': mentor})

# These view will help with mapping students with mentors
# @login_required
def Map_stud_with_mentor(request):

    if request.user.is_authenticated:
        print("*******_________success___________**************")
        print("*******___________________________**************")
        print("*******___________________________**************")
        print("*******___________________________**************")
        print("*******___________________________**************")
        print("*******___________________________**************")
        print(request.user)
        student_profile = get_student_profile(request.user)
    else:
        print("*******_______auth_failed_________**************")
        print("*******___________________________**************")
        print("*******___________________________**************")
        print("*******___________________________**************")
        print("*******___________________________**************")
        print("*******___________________________**************")
        print(request.user)
        # Redirect to login or handle unauthenticated case
        return redirect('login')
    
    # Get list of mentors and their profiles
    mentors = get_all_mentors()
    
    # Implement a matching algorithm (e.g., cosine similarity or machine learning-based)
    best_mentor = get_best_mentor_match(student_profile, mentors)
    print(f"Best mentor just before passing as context {best_mentor}")
    
    return render(request, 'mentor_match.html', {'mentor': best_mentor})

# This view will help offer career guidance based on student peculiarities in an intelligent way
# @login_required
def career_guidance_helper(request):
    student = request.user  # assuming the user is a student

    career_suggestions = None

    # Directly query the student's learning paths and career goals
    try:      
        # Get career recommendations based on goals and learning paths
        career_suggestions = recommend_career_paths(student.id) 
    except Exception as e:
        print(f"career suggestions raising an error: {e}")
        career_suggestions = None  # If no goals/learning paths are found

    print(f"Recommended courses for you (for the dashboard section): {career_suggestions}")

    # should return to homepage in the suggested for you section
    return render(request, 'career_guidance.html', {'suggestions': career_suggestions}) 

def get_student_profile(student):
    print("Here is the student details now:===---> ", student)

    # Retrieve or create the Student object based on the provided CustomUser instance
    student_obj, created = Student.objects.get_or_create(user=student)

    # Retrieve or create the StudentInfo object associated with the Student object
    student_info, info_created = StudentInfo.objects.get_or_create(
        student=student_obj,
        defaults={
            'gpa': 0.0,  # Default value for GPA if created
            'major': 'Undeclared',  # Default major if created
            'skills': ''  # Default skills if created
        }
    )

    # Prepare the profile dictionary
    profile = {
        'enrollment_year': student_obj.enrollment_year,
        'gpa': student_info.gpa,
        'major': student_info.major,
        'skills': student_info.skills.split(','),  # Assuming skills are stored as comma-separated values
    }

    return profile

def get_all_mentors():
    mentors = Mentor_profile.objects.filter(availability=True)
    
    mentor_profiles = []

    for mentor in mentors:
        mentor_profiles.append({
            'name': mentor.mentor_name,
            'expertise': mentor.mentor_specializations.split(','),  # Split by comma to create a list of skills
            'years_of_experience': mentor.years_of_experience,
            'availability': mentor.availability,  # Include availability status
        })
    
    return mentor_profiles

def get_best_mentor_match(student_profile, mentors):
    student_skills = ' '.join(student_profile['skills'])  # Convert student skills to a space-separated string
    
    mentor_similarity_scores = []
    for mentor in mentors:
        mentor_expertise = ' '.join(mentor['expertise'])  # Convert mentor expertise to space-separated string
        
        # Vectorize the skills and expertise
        vectorizer = CountVectorizer().fit_transform([student_skills, mentor_expertise])
        vectors = vectorizer.toarray()

        # Calculate cosine similarity
        similarity = cosine_similarity(vectors)[0][1]  # Compare student skills to mentor expertise
        mentor_similarity_scores.append((mentor, similarity))
    
    # Sort mentors by similarity score in descending order
    mentor_similarity_scores.sort(key=lambda x: x[1], reverse=True)
    
    # Return the mentor with the highest similarity score
    best_mentor = mentor_similarity_scores[0][0]
    print("Best mentors found by the system: ", best_mentor)
    
    return best_mentor

def recommend_career_paths(student_id):
    try:
        # Fetch the student's selected learning paths
        student_goals = Selectedlearningpathsbystudent.objects.get(stud_name=student_id)

        # Split the selected paths by the student into a list
        selected_paths = student_goals.selectedpaths.split(',')

        # Fetch career paths and details for the selected paths only
        careers_paths_and_details = CareerPath.objects.filter(name__in=selected_paths)

        # Prepare recommendations directly based on selected paths
        recommendations = []

        for career in careers_paths_and_details:
            recommendation_detail = {
                'career_name': career.name,
                'courses_and_certifications': career.coursesandcertification,
                'resources_required': career.resourcesrequired
            }
            recommendations.append(recommendation_detail)

        print(f"Recommended courses for you (for the dashboard section): {recommendation_detail}")
        return recommendations
    except Selectedlearningpathsbystudent.DoesNotExist:
        return []  # Return an empty list if the student doesn't exist
