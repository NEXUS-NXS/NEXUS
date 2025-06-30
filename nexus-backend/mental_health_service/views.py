from django.shortcuts import render
# from django.contrib.auth.decorators import login_required
import random
from auth_service.models import *
from .models import *
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity



# These view will help with suggesting students meditation materials intelligently, based on where they are
# @login_required
def Get_meditations_for_students(request):

    student = request.user 
    print("while trying to get meditations for 'student user: ", student) 
    # print(dir(request.user))

    # Analyze their current emotional state or progress (e.g., stress levels, recent activity)
    student_status = get_student_status(student)
    
    # Recommend meditations based on their status
    meditation_suggestions = recommend_meditations(student_status) 

    context = {
        'meditations': meditation_suggestions,
        'counsellors': 'counsellors',
        'scheduling_services': 'scheduling_services'
    }
    
    return render(request, 'well_being_center.html', context)


# This view will help connect students with counsellors for mental assesments
def Connect_users_with_counsellors(request):
    ...


# Will help schedule events on one's calendar
def scheduling_service_with_support_group(request):
    ...
   
   
# This view will help asses whether a student needs mental health, and send them the survey 
def suggest_mental_check(student):
    # Get the mental health status of the student
    student_status = get_student_status(student)
    
    # Check if the student meets the criteria for a mental health survey
    if needs_mental_health_check(student_status):
        recommend_mental_health_survey(student)
    
    return


def get_student_status(student):
    try:
        # Get the latest mental health status for the student
        mental_status = StudentMentalHealthStatus.objects.filter(student=student).latest('last_updated')
        return {
            'stress_level': mental_status.stress_level,
            'anxiety_level': mental_status.anxiety_level,
            'mood': mental_status.mood,
            'sleep_hours': mental_status.sleep_hours
        }
    except StudentMentalHealthStatus.DoesNotExist:
        return None  # If no mental health status is found, return None



def recommend_meditations(student_status):
    # Fetch all available meditations
    meditations = MeditationContentForStudentWellness.objects.all()

    if not meditations.exists() or not student_status:

        return "General Meditation - we reccomend you ensure your mental health is checked"  # Fallback if no data is available

    
    # Analyze student's status (e.g., mood, stress level)
    mood = student_status.get('mood', 'Neutral')
    stress_level = student_status.get('stress_level', 5)  # Default mid-level if not provided
    anxiety_level = student_status.get('anxiety_level', 5)  # Default mid-level if not provided
    sleep_hours = student_status.get('sleep_hours', 7.0)  # Default to 7 hours of sleep if not provided


    # Prepare a description based on the student's mental state
    student_description = (
        f"Mood: {mood}, "
        f"Stress Level: {stress_level}, "
        f"Anxiety Level: {anxiety_level}, "
        f"Hours of Sleep: {sleep_hours}"
    )

    meditation_texts = [
    f"{meditation.description} {meditation.meditation_type}" 
    for meditation in meditations
    ] 

    # Append the student description for similarity comparison
    texts = [student_description] + meditation_texts

    # Use CountVectorizer for text vectorization
    vectorizer = CountVectorizer().fit_transform(texts)
    vectors = vectorizer.toarray()

    # Calculate cosine similarity between student's status and meditation descriptions
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    # Get the best matching meditation based on highest similarity score
    best_match_index = cosine_sim.argmax()
    best_meditation = meditations[best_match_index] 

    return best_meditation


def needs_mental_health_check(student_status):
    # Criteria for sending a mental health survey
    stress_level = student_status.get('stress_level', 5)  # Assume default value if not present
    mood = student_status.get('mood', 'neutral')

    # Example criteria: high stress level or negative mood
    if stress_level > 7 or mood in ['anxious', 'depressed', 'irritable']:
        return True
    
    return False


def recommend_mental_health_survey(student):
    # Set the student's flag to True for needing a mental health survey
    student.needs_mental_health_survey = True
    student.save()  # Save the updated status in the database
    
    # Create a notification message for the student recommending the survey
    # Notification.objects.create(
    #     student=student,
    #     message="We recommend you complete a mental health survey to check in on your well-being."
    # )
