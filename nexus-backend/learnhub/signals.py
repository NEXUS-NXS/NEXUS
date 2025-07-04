from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Lesson, Course, CourseEnrollment

@receiver([post_save, post_delete], sender=Lesson)
def update_course_totals(sender, instance, **kwargs):
    course = instance.module.course
    course.total_lessons = Lesson.objects.filter(module__course=course).count()
    total_duration = 0
    for lesson in Lesson.objects.filter(module__course=course):
        if lesson.duration:
            try:
                minutes, seconds = map(int, lesson.duration.split(':'))
                total_duration += minutes * 60 + seconds
            except (ValueError, AttributeError):
                continue
    course.total_duration = total_duration // 60
    course.save()

@receiver([post_save, post_delete], sender=CourseEnrollment)
def update_enrolled_students(sender, instance, **kwargs):
    course = instance.course
    course.enrolled_students = CourseEnrollment.objects.filter(course=course).count()
    course.save()