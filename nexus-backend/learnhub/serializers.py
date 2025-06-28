# # learnhub/serializers.py
# from rest_framework import serializers
# from .models import (
#     Expertise, Instructor, Tag, LearningObjective, Prerequisite,
#     Course, Module, Lesson, KeyPoint, BulletPoint, CodeExample, Question
# )
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class ExpertiseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Expertise
#         fields = ['id', 'name']

# class InstructorSerializer(serializers.ModelSerializer):
#     user = serializers.StringRelatedField(read_only=True)
#     expertise = ExpertiseSerializer(many=True, required=False)

#     class Meta:
#         model = Instructor
#         fields = ['id', 'user', 'bio', 'experience', 'profile_image', 'expertise', 'social_links']

#     def create(self, validated_data):
#         expertise_data = validated_data.pop('expertise', [])
#         instructor = Instructor.objects.create(**validated_data)
#         for exp_data in expertise_data:
#             expertise, _ = Expertise.objects.get_or_create(name=exp_data['name'])
#             instructor.expertise.add(expertise)
#         return instructor

# class TagSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Tag
#         fields = ['id', 'name']

# class LearningObjectiveSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LearningObjective
#         fields = ['id', 'text']

# class PrerequisiteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Prerequisite
#         fields = ['id', 'text']

# class CourseSerializer(serializers.ModelSerializer):
#     instructor = InstructorSerializer()
#     tags = TagSerializer(many=True, required=False)
#     learning_objectives = LearningObjectiveSerializer(many=True, required=False)
#     prerequisites = PrerequisiteSerializer(many=True, required=False)

#     class Meta:
#         model = Course
#         fields = [
#             'id', 'title', 'slug', 'description', 'category', 'difficulty',
#             'estimated_duration', 'tags', 'status', 'created_at', 'updated_at',
#             'total_lessons', 'total_duration', 'instructor', 'learning_objectives',
#             'prerequisites'
#         ]

#     def validate(self, data):
#         if not data.get('title'):
#             raise serializers.ValidationError({"title": "This field is required."})
#         if not data.get('description'):
#             raise serializers.ValidationError({"description": "This field is required."})
#         return data

#     def create(self, validated_data):
#         instructor_data = validated_data.pop('instructor')
#         tags_data = validated_data.pop('tags', [])
#         objectives_data = validated_data.pop('learning_objectives', [])
#         prerequisites_data = validated_data.pop('prerequisites', [])
        
#         user = self.context['request'].user
#         instructor, created = Instructor.objects.get_or_create(user=user)
#         if not created:
#             for attr, value in instructor_data.items():
#                 setattr(instructor, attr, value)
#             instructor.save()
                
#         course = Course.objects.create(instructor=instructor, **validated_data)
        
#         for tag_data in tags_data:
#             tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
#             course.tags.add(tag)
#         for obj_data in objectives_data:
#             objective = LearningObjective.objects.create(course=course, **obj_data)
#             course.learning_objectives.add(objective)
#         for pre_data in prerequisites_data:
#             prerequisite = Prerequisite.objects.create(course=course, **pre_data)
#             course.prerequisites.add(prerequisite)
        
#         return course

#     def update(self, instance, validated_data):
#         instructor_data = validated_data.pop('instructor', None)
#         tags_data = validated_data.pop('tags', [])
#         objectives_data = validated_data.pop('learning_objectives', [])
#         prerequisites_data = validated_data.pop('prerequisites', [])

#         if instructor_data:
#             instructor_serializer = InstructorSerializer(instance.instructor, data=instructor_data, partial=True)
#             instructor_serializer.is_valid(raise_exception=True)
#             instructor_serializer.save()

#         instance = super().update(instance, validated_data)

#         if tags_data:
#             instance.tags.clear()
#             for tag_data in tags_data:
#                 tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
#                 instance.tags.add(tag)
#         if objectives_data:
#             instance.learning_objectives.clear()
#             for obj_data in objectives_data:
#                 objective = LearningObjective.objects.create(course=instance, **obj_data)
#                 instance.learning_objectives.add(objective)
#         if prerequisites_data:
#             instance.prerequisites.clear()
#             for pre_data in prerequisites_data:
#                 prerequisite = Prerequisite.objects.create(course=instance, **pre_data)
#                 instance.prerequisites.add(prerequisite)

#         return instance

# class ModuleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Module
#         fields = ['id', 'course', 'title', 'description', 'order']

#     def validate(self, data):
#         if not data.get('title'):
#             raise serializers.ValidationError({"title": "This field is required."})
#         return data

# class BulletPointSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = BulletPoint
#         fields = ['id', 'text']

# class KeyPointSerializer(serializers.ModelSerializer):
#     bullets = BulletPointSerializer(many=True, required=False)

#     class Meta:
#         model = KeyPoint
#         fields = ['id', 'title', 'content', 'bullets']

#     def create(self, validated_data):
#         bullets_data = validated_data.pop('bullets', [])
#         keypoint = KeyPoint.objects.create(**validated_data)
#         for bullet_data in bullets_data:
#             BulletPoint.objects.create(key_point=keypoint, **bullet_data)
#         return keypoint

# class CodeExampleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CodeExample
#         fields = ['id', 'title', 'code']

# class QuestionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Question
#         fields = ['id', 'question', 'options', 'correct_option', 'explanation']

#     def validate(self, data):
#         if not data.get('question'):
#             raise serializers.ValidationError({"question": "This field is required."})
#         if len(data.get('options', [])) != 4:
#             raise serializers.ValidationError({"options": "Exactly 4 options are required."})
#         if not 0 <= data.get('correct_option', -1) <= 3:
#             raise serializers.ValidationError({"correct_option": "Must be between 0 and 3."})
#         return data

# class LessonSerializer(serializers.ModelSerializer):
#     learning_objectives = LearningObjectiveSerializer(many=True, required=False)
#     keypoints = KeyPointSerializer(many=True, required=False)
#     code_examples = CodeExampleSerializer(many=True, required=False)
#     questions = QuestionSerializer(many=True, required=False)

#     class Meta:
#         model = Lesson
#         fields = [
#             'id', 'module', 'title', 'type', 'duration', 'description',
#             'video_url', 'is_completed', 'order', 'overview', 'summary',
#             'learning_objectives', 'keypoints', 'code_examples', 'questions'
#         ]

#     def validate(self, data):
#         if not data.get('title'):
#             raise serializers.ValidationError({"title": "This field is required."})
#         if data.get('type') == 'video' and not data.get('video_url'):
#             raise serializers.ValidationError({"video_url": "This field is required for video lessons."})
#         return data

#     def create(self, validated_data):
#         objectives_data = validated_data.pop('learning_objectives', [])
#         keypoints_data = validated_data.pop('keypoints', [])
#         code_examples_data = validated_data.pop('code_examples', [])
#         questions_data = validated_data.pop('questions', [])

#         lesson = Lesson.objects.create(**validated_data)
        
#         for obj_data in objectives_data:
#             objective = LearningObjective.objects.create(lesson=lesson, **obj_data)
#             lesson.learning_objectives.add(objective)
#         for kp_data in keypoints_data:
#             bullets_data = kp_data.pop('bullets', [])
#             keypoint = KeyPoint.objects.create(lesson=lesson, **kp_data)
#             for bullet_data in bullets_data:
#                 BulletPoint.objects.create(key_point=keypoint, **bullet_data)
#         for ce_data in code_examples_data:
#             CodeExample.objects.create(lesson=lesson, **ce_data)
#         for q_data in questions_data:
#             Question.objects.create(lesson=lesson, **q_data)
        
#         return lesson

#     def update(self, instance, validated_data):
#         objectives_data = validated_data.pop('learning_objectives', [])
#         keypoints_data = validated_data.pop('keypoints', [])
#         code_examples_data = validated_data.pop('code_examples', [])
#         questions_data = validated_data.pop('questions', [])

#         instance = super().update(instance, validated_data)

#         if objectives_data:
#             instance.learning_objectives.clear()
#             for obj_data in objectives_data:
#                 objective = LearningObjective.objects.create(lesson=instance, **obj_data)
#                 instance.learning_objectives.add(objective)
#         if keypoints_data:
#             instance.keypoints.all().delete()
#             for kp_data in keypoints_data:
#                 bullets_data = kp_data.pop('bullets', [])
#                 keypoint = KeyPoint.objects.create(lesson=instance, **kp_data)
#                 for bullet_data in bullets_data:
#                     BulletPoint.objects.create(key_point=keypoint, **bullet_data)
#         if code_examples_data:
#             instance.code_examples.all().delete()
#             for ce_data in code_examples_data:
#                 CodeExample.objects.create(lesson=instance, **ce_data)
#         if questions_data:
#             instance.questions.all().delete()
#             for q_data in questions_data:
#                 Question.objects.create(lesson=instance, **q_data)

#         return instance