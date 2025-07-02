from django.db import models
from auth_service.models import *
from learning_hub.models import *

class Mentor_profile(models.Model):
    mentor_name = models.CharField(max_length=200)
    mentor_specializations = models.TextField() # Store areas of expertise, e.g., comma-separated skills
    years_of_experience = models.IntegerField()
    availability = models.BooleanField(default=True)  # Only consider mentors who are available

    def __str__(self):
        return str(self.mentor_name)

class Selectedlearningpathsbystudent(models.Model): # the profile we have of a student
    stud_name =  models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='selectedcareerpaths') 
    selectedpaths = models.TextField() # a students ambitions and desired careers. this gets updated with a students' learning progress, catching their interests as they go
 
        
    has_answered_survey = models.BooleanField(default=False) 

    def __str__(self):
        return f"{self.stud_name} - {self.selectedpaths}"


class CareerPath(models.Model):

    """
    Prfessional papers way, data science way, programming, insurance, finance, pension, emerging trends - user selects max 2 and gets course and resource recommendations
    """

    name = models.CharField(max_length=100, unique=True)  # Name of the career path
    coursesandcertification = models.TextField()  # Details about the courses and steps and certifications needed for this path
    resourcesrequired = models.TextField()


    def __str__(self):
        return self.name
    

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='career_mentorship')  # Links the Student to a Django user
    # enrollment_year = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    enrollment_year = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username
    

class StudentInfo(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    gpa = models.FloatField(null=True, blank=True)
    completed_courses = models.TextField()  # Store completed courses as a comma-separated list
    major = models.CharField(max_length=100, null=True, blank=True)  # New field for major
    skills = models.TextField(null=True, blank=True) 

    def __str__(self):
        return f"Info for {self.student.user.username}"
