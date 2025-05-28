import { Link } from "react-router-dom"
import "./TopicSuggestion.css"

const topics = [
  { id: 1, name: "Data Science", path: "/topics/data-science" },
  { id: 2, name: "Machine Learning", path: "/topics/machine-learning" },
  { id: 3, name: "Web Development", path: "/topics/web-development" },
  { id: 4, name: "Digital Marketing", path: "/topics/digital-marketing" },
  { id: 5, name: "Blockchain", path: "/topics/blockchain" },
  { id: 6, name: "DevOps", path: "/topics/devops" },
]

const TopicSuggestion = () => {
  return (
    <div className="topic-suggestion-dashbd">
      <h3>Topics You Might Be Interested In</h3>
      <div className="topic-cards-dashbd">
        {topics.map((topic) => (
          <Link to={topic.path} key={topic.id} className="topic-card-dashbd">
            {topic.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TopicSuggestion
