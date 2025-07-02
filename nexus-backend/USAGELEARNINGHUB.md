# Learning Hub Usage Guide

This guide provides instructions for instructors and administrators to manage and create courses in the Learning Hub.

## Accessing the Course Library

- **URL**: [https://127.0.0.1:5173/admin/course-library](https://127.0.0.1:5173/admin/course-library)
- **Purpose**: View all courses you have created or are authorized to manage.
- **Steps**:
  1. Log in to the Learning Hub with your instructor credentials.
  2. Navigate to [https://127.0.0.1:5173/admin/course-library](https://127.0.0.1:5173/admin/course-library).
  3. Browse the list of your courses, including their titles, statuses, and other details.

## Creating a New Course

- **URL**: [https://127.0.0.1:5173/create-course](https://127.0.0.1:5173/create-course)
- **Purpose**: Create a new course to be offered in the Learning Hub.
- **Steps**:
  1. Navigate to [https://127.0.0.1:5173/create-course](https://127.0.0.1:5173/create-course).
  2. Fill in the required fields, such as course title, description, category, difficulty, and estimated duration.
  3. Upload a cover image using the provided form (ensure the image meets the required format and size specifications).
  4. Save the course as a draft or submit it for review.
  5. Once saved, you will be redirected to the course content manager to add lessons and other materials.

## Publishing a Course

- **Purpose**: Make a course publicly available to students.
- **Steps**:
  1. From the course content manager or course library, locate the course you wish to publish.
  2. Click the **Publish** button to change the course status to `published`.
  3. Once published, the course will be visible to students in the Learning Hub.

## Previewing a Course

- **Purpose**: See how the course will appear to students before or after publishing.
- **Steps**:
  1. From the course content manager or course library, locate the course you wish to preview.
  2. Click the **Preview** button.
  3. This will open a preview of the course at a URL like [https://127.0.0.1:5173/course/<course_id>/preview](https://127.0.0.1:5173/course/<course_id>/preview).
  4. Review the course layout, including the cover image, description, and lesson structure, as students will see it.

## Managing Course Content

- **URL**: [https://127.0.0.1:5173/course/<course_id>/content-manager](https://127.0.0.1:5173/course/<course_id>/content-manager)
- **Purpose**: Add, edit, or organize lessons and other course materials.
- **Steps**:
  1. After creating or previewing a course, click the browser's **Back** button to return to the course content manager at [https://127.0.0.1:5173/course/<course_id>/content-manager](https://127.0.0.1:5173/course/<course_id>/content-manager).
  2. Add or edit lessons, upload additional resources, or reorder course content as needed.
  3. Save changes and, if ready, publish the course using the **Publish** button.

## Additional Resources

- **Instructional Video**: For a visual guide on creating and managing courses, watch this non-restricted YouTube video: [https://www.youtube.com/watch?v=dQw4w9WgXcQ](https://www.youtube.com/watch?v=dQw4w9WgXcQ) (placeholder; replace with an actual non-restricted video URL if available).
- **Support**: Contact the Learning Hub support team via the platform's help section for assistance with course creation or management.

## Notes

- Ensure you are logged in with instructor permissions to access course creation, management, and publishing features.
- All URLs use `https://127.0.0.1:5173` for local development. Replace with the production URL when deploying.
- Always verify that cover images and other resources are properly uploaded to avoid display issues for students.
- A course must be published (status set to `published`) to be visible to students. Draft or unpublished courses are only visible to instructors and administrators.