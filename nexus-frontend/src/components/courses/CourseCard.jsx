import { Link } from "react-router-dom"
import "./CourseCard.css"

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-image">
        <img src={course.image || "/placeholder.svg"} alt={course.title} />
        <div className="course-progress-badge">{course.progress}% Enrolled</div>
      </div>
      <div className="course-info">
        <span className="course-label">Course</span>
        <h4 className="course-title">{course.title}</h4>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
        </div>
        <div className="progress-text">
          <span>{course.progress}% completed</span>
        </div>
        <Link to={`/course/${course.id}`} className="course-btn">
          Go to course
        </Link>
      </div>
    </div>
  )
}

export default CourseCard
