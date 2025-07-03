import { Link } from "react-router-dom"
import "./TrendingCourses.css"


const TrendingCourses = () => {
  const trendingCourses = [
    {
      id: 1,
      title: "AI in Actuarial Science",
      description: "June 2025) – overview of AI applications in risk prediction.",
      type: "course",
      path: "https://numberanalytics.com",
      theme: "dark",
    },
    {
      id: 2,
      title: "Environmental risk modeling",
      description: "Actuaries increasingly lead in environmental risk modeling, ESG-adjusted pricing, and climate scenario analysisAdvance your career with the world's most sought-after Actuarial Whatever certification program.",
      modules: 7,
      lessons: 7,
      type: "ESG-adjusted pricing",
      path: "https://axios.com",
      theme: "primary",
    },
    {
      id: 3,
      title: "Enterprise Risk Management (ERM)",
      description: "A distinct credential focusing on Enterprise Risk Management (ERM), globally recognized and backed by the SOA and IFoA ",
      type: "certification",
      path: "https://www.soa.org/globalassets/assets/files/newsroom/news-erm-cera-fact-sheet.pdf",
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
