# learnhub/serializers.py
from rest_framework import serializers
from .models import (
    Expertise, Instructor, Tag, LearningObjective, Prerequisite,
    Course, Module, Lesson, KeyPoint, BulletPoint, CodeExample, Question, CourseEnrollment,
    CourseRating, QuizSubmission, UserLessonProgress,
)
from django.contrib.auth import get_user_model

User = get_user_model()

class ExpertiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expertise
        fields = ['id', 'name']

class InstructorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    expertise = ExpertiseSerializer(many=True, required=False)

    class Meta:
        model = Instructor
        fields = ['id', 'user', 'bio', 'experience', 'profile_image', 'expertise', 'social_links']

    def create(self, validated_data):
        expertise_data = validated_data.pop('expertise', [])
        instructor = Instructor.objects.create(**validated_data)
        for exp_data in expertise_data:
            expertise, _ = Expertise.objects.get_or_create(name=exp_data['name'])
            instructor.expertise.add(expertise)
        return instructor

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class LearningObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningObjective
        fields = ['id', 'text']

class PrerequisiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prerequisite
        fields = ['id', 'text']

class CourseSerializer(serializers.ModelSerializer):
    instructor = InstructorSerializer()
    tags = TagSerializer(many=True, required=False)
    learning_objectives = LearningObjectiveSerializer(many=True, required=False)
    prerequisites = PrerequisiteSerializer(many=True, required=False)

    price = serializers.SerializerMethodField()

    def get_price(self, obj):
        return f"${obj.price:,.2f}"
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'category', 'difficulty',
            'estimated_duration', 'tags', 'status', 'created_at', 'updated_at',
            'total_lessons', 'total_duration', 'instructor', 'learning_objectives',
            'prerequisites','rating', 'enrolled_students', 'price', 'is_popular',
            'thumbnail'
        ]

    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError({"title": "This field is required."})
        if not data.get('description'):
            raise serializers.ValidationError({"description": "This field is required."})
        return data

    def create(self, validated_data):
        instructor_data = validated_data.pop('instructor')
        tags_data = validated_data.pop('tags', [])
        objectives_data = validated_data.pop('learning_objectives', [])
        prerequisites_data = validated_data.pop('prerequisites', [])

        user = self.context['request'].user
        instructor, created = Instructor.objects.get_or_create(user=user)

        if not created:
            expertise_data = instructor_data.pop('expertise', None)

            for attr, value in instructor_data.items():
                setattr(instructor, attr, value)
            instructor.save()

            if expertise_data:
                expertise_objs = []
                for item in expertise_data:
                    obj, _ = Expertise.objects.get_or_create(name=item['name'])
                    expertise_objs.append(obj)
                instructor.expertise.set(expertise_objs)

        course = Course.objects.create(instructor=instructor, **validated_data)

        # Handle tags - modified to skip existing tags without error
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
            course.tags.add(tag)
        
        for obj_data in objectives_data:
            objective = LearningObjective.objects.create(course=course, **obj_data)
            course.learning_objectives.add(objective)

        for pre_data in prerequisites_data:
            prerequisite = Prerequisite.objects.create(course=course, **pre_data)
            course.prerequisites.add(prerequisite)

        return course

    def update(self, instance, validated_data):
        instructor_data = validated_data.pop('instructor', None)
        tags_data = validated_data.pop('tags', [])
        objectives_data = validated_data.pop('learning_objectives', [])
        prerequisites_data = validated_data.pop('prerequisites', [])

        if instructor_data:
            instructor_serializer = InstructorSerializer(instance.instructor, data=instructor_data, partial=True)
            instructor_serializer.is_valid(raise_exception=True)
            instructor_serializer.save()

        instance = super().update(instance, validated_data)

        if tags_data:
            instance.tags.clear()
            for tag_data in tags_data:
                tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
                instance.tags.add(tag)
        if objectives_data:
            instance.learning_objectives.clear()
            for obj_data in objectives_data:
                objective = LearningObjective.objects.create(course=instance, **obj_data)
                instance.learning_objectives.add(objective)
        if prerequisites_data:
            instance.prerequisites.clear()
            for pre_data in prerequisites_data:
                prerequisite = Prerequisite.objects.create(course=instance, **pre_data)
                instance.prerequisites.add(prerequisite)

        return instance

# learnhub/serializers.py
class ModuleSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()

    def get_progress(self, obj):
        lessons = obj.lessons.all()
        if not lessons:
            return 0.0
        completed = UserLessonProgress.objects.filter(
            user=self.context['request'].user, lesson__in=lessons, is_completed=True
        ).count()
        return (completed / lessons.count()) * 100

    def get_is_completed(self, obj):
        lessons = obj.lessons.all()
        if not lessons:
            return False
        completed = UserLessonProgress.objects.filter(
            user=self.context['request'].user, lesson__in=lessons, is_completed=True
        ).count()
        return completed == lessons.count()

    class Meta:
        model = Module
        fields = ['id', 'course', 'title', 'description', 'order', 'progress', 'is_completed']

class BulletPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = BulletPoint
        fields = ['id', 'text']

class KeyPointSerializer(serializers.ModelSerializer):
    bullets = BulletPointSerializer(many=True, required=False)

    class Meta:
        model = KeyPoint
        fields = ['id', 'title', 'content', 'bullets']

    def create(self, validated_data):
        bullets_data = validated_data.pop('bullets', [])
        keypoint = KeyPoint.objects.create(**validated_data)
        for bullet_data in bullets_data:
            BulletPoint.objects.create(key_point=keypoint, **bullet_data)
        return keypoint

class CodeExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeExample
        fields = ['id', 'title', 'code']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question', 'options', 'correct_option', 'explanation']

    def validate(self, data):
        if not data.get('question'):
            raise serializers.ValidationError({"question": "This field is required."})
        if len(data.get('options', [])) != 4:
            raise serializers.ValidationError({"options": "Exactly 4 options are required."})
        if not 0 <= data.get('correct_option', -1) <= 3:
            raise serializers.ValidationError({"correct_option": "Must be between 0 and 3."})
        return data

import re
class LessonSerializer(serializers.ModelSerializer):
    learning_objectives = LearningObjectiveSerializer(many=True, required=False)
    keypoints = KeyPointSerializer(many=True, required=False)
    code_examples = CodeExampleSerializer(many=True, required=False)
    questions = QuestionSerializer(many=True, required=False)

    class Meta:
        model = Lesson
        fields = [
            'id', 'module', 'title', 'type', 'duration', 'description',
            'video_url', 'is_completed', 'order', 'overview', 'summary',
            'learning_objectives', 'keypoints', 'code_examples', 'questions'
        ]

    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError({"title": "This field is required."})
        if data.get('type') == 'video' and not data.get('video_url'):
            raise serializers.ValidationError({"video_url": "This field is required for video lessons."})
        return data
    
    def validate_duration(self, value):
        if value and not re.match(r'^\d+:\d{2}$', value):
            raise serializers.ValidationError({"duration": "Format must be MM:SS"})
        return value

    def create(self, validated_data):
        objectives_data = validated_data.pop('learning_objectives', [])
        keypoints_data = validated_data.pop('keypoints', [])
        code_examples_data = validated_data.pop('code_examples', [])
        questions_data = validated_data.pop('questions', [])

        lesson = Lesson.objects.create(**validated_data)
        
        for obj_data in objectives_data:
            objective = LearningObjective.objects.create(lesson=lesson, **obj_data)
            lesson.learning_objectives.add(objective)
        for kp_data in keypoints_data:
            bullets_data = kp_data.pop('bullets', [])
            keypoint = KeyPoint.objects.create(lesson=lesson, **kp_data)
            for bullet_data in bullets_data:
                BulletPoint.objects.create(key_point=keypoint, **bullet_data)
        for ce_data in code_examples_data:
            CodeExample.objects.create(lesson=lesson, **ce_data)
        for q_data in questions_data:
            Question.objects.create(lesson=lesson, **q_data)
        
        return lesson

    def update(self, instance, validated_data):
        objectives_data = validated_data.pop('learning_objectives', [])
        keypoints_data = validated_data.pop('keypoints', [])
        code_examples_data = validated_data.pop('code_examples', [])
        questions_data = validated_data.pop('questions', [])

        instance = super().update(instance, validated_data)

        if objectives_data:
            instance.learning_objectives.clear()
            for obj_data in objectives_data:
                objective = LearningObjective.objects.create(lesson=instance, **obj_data)
                instance.learning_objectives.add(objective)
        if keypoints_data:
            instance.keypoints.all().delete()
            for kp_data in keypoints_data:
                bullets_data = kp_data.pop('bullets', [])
                keypoint = KeyPoint.objects.create(lesson=instance, **kp_data)
                for bullet_data in bullets_data:
                    BulletPoint.objects.create(key_point=keypoint, **bullet_data)
        if code_examples_data:
            instance.code_examples.all().delete()
            for ce_data in code_examples_data:
                CodeExample.objects.create(lesson=instance, **ce_data)
        if questions_data:
            instance.questions.all().delete()
            for q_data in questions_data:
                Question.objects.create(lesson=instance, **q_data)

        return instance


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = ['id', 'course', 'enrolled_at']

    def validate(self, data):
        if CourseEnrollment.objects.filter(user=self.context['request'].user, course=data['course']).exists():
            raise serializers.ValidationError({"course": "Already enrolled in this course."})
        return data
    


class EnrolledCourseSerializer(CourseSerializer):
    progress = serializers.SerializerMethodField()
    completed_lessons = serializers.SerializerMethodField()
    next_lesson_id = serializers.SerializerMethodField()
    next_lesson = serializers.SerializerMethodField()

    def get_progress(self, obj):
        lessons = Lesson.objects.filter(module__course=obj)
        if not lessons:
            return 0.0
        completed = UserLessonProgress.objects.filter(
            user=self.context['request'].user, lesson__in=lessons, is_completed=True
        ).count()
        return (completed / lessons.count()) * 100

    def get_completed_lessons(self, obj):
        return UserLessonProgress.objects.filter(
            user=self.context['request'].user, lesson__module__course=obj, is_completed=True
        ).count()

    def get_next_lesson_id(self, obj):
        lessons = Lesson.objects.filter(module__course=obj).order_by('order')
        for lesson in lessons:
            if not UserLessonProgress.objects.filter(
                user=self.context['request'].user, lesson=lesson, is_completed=True
            ).exists():
                return str(lesson.id)
        return str(lessons.first().id) if lessons.exists() else None

    def get_next_lesson(self, obj):
        next_lesson_id = self.get_next_lesson_id(obj)
        if next_lesson_id:
            lesson = Lesson.objects.get(id=next_lesson_id)
            return lesson.title
        return None

    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['progress', 'completed_lessons', 'next_lesson_id', 'next_lesson']




class CourseRatingSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if not CourseEnrollment.objects.filter(user=self.context['request'].user, course=data['course']).exists():
            raise serializers.ValidationError({"course": "You must be enrolled to rate this course."})
        if CourseRating.objects.filter(user=self.context['request'].user, course=data['course']).exists():
            raise serializers.ValidationError({"course": "You have already rated this course."})
        return data



class QuizSubmissionSerializer(serializers.ModelSerializer):
    def validate(self, data):
        lesson = data['lesson']
        course = lesson.module.course
        if not CourseEnrollment.objects.filter(user=self.context['request'].user, course=course).exists():
            raise serializers.ValidationError({"lesson": "You must be enrolled in the course to submit this quiz."})
        if lesson.type != 'quiz':
            raise serializers.ValidationError({"lesson": "This lesson is not a quiz."})
        if QuizSubmission.objects.filter(user=self.context['request'].user, lesson=lesson).exists():
            raise serializers.ValidationError({"lesson": "Quiz already submitted."})
        questions = Question.objects.filter(lesson=lesson)
        answers = data['answers']
        if not all(str(q.id) in answers for q in questions):
            raise serializers.ValidationError({"answers": "Answers for all questions required."})
        return data



class UserLessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLessonProgress
        fields = ['id', 'lesson', 'is_completed', 'completed_at', 'video_progress', 'video_current_time']
















# courses/serializers.py
from rest_framework import serializers
from .models import Course
from django.core.validators import FileExtensionValidator

class CourseCoverImageSerializer(serializers.ModelSerializer):
    cover_picture = serializers.ImageField(
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])
        ]
    )

    class Meta:
        model = Course
        fields = ['cover_picture']

    def validate_cover_picture(self, value):
        # Optional: Add additional validation for file size or other constraints
        if value.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError("Image file size must be less than 5MB.")
        return value