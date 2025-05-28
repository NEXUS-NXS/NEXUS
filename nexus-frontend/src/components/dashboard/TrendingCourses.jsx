import { Link } from "react-router-dom"
import "./TrendingCourses.css"

const TrendingCourses = () => {
  const trendingCourses = [
    {
      id: 1,
      title: "Stuff to do with Actuarial Science",
      description: "Learn how to do math like a zombie and code like never before.",
      type: "course",
      path: "/course/actuarial-science-basics",
      theme: "dark",
    },
    {
      id: 2,
      title: "Certified Actuarial Whatever (CAW)",
      description: "Advance your career with the world's most sought-after Actuarial Whatever certification program.",
      modules: 43,
      lessons: 2,
      type: "certification",
      path: "/course/certified-actuarial-whatever",
      theme: "primary",
    },
    {
      id: 3,
      title: "Stuff to do with Actuarial Science",
      description: "Learn how to do math like a zombie and code like never before.",
      type: "course",
      path: "/course/actuarial-science-advanced",
      theme: "dark",
    },
  ]

  return (
    <div className="trending-courses">
      <h3>Trending</h3>
      <div className="trending-cards">
        {trendingCourses.map((course) => (
          <div key={course.id} className={`trending-card ${course.theme === "primary" ? "primary-card" : "dark-card"}`}>
            {course.type === "certification" ? (
              <>
                <h3>{course.title}</h3>
                <div className="certification-stats">
                  <span>{course.modules} Modules</span>
                  <span>{course.lessons} practice lessons</span>
                </div>
                <p>{course.description}</p>
                <Link to={course.path} className="get-started-btn">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <Link to={course.path} className="learn-more-btn">
                  Learn more
                </Link>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendingCourses
