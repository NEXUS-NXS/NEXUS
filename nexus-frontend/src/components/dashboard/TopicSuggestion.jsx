import "./TopicSuggestion.css"

const topics = [
  { id: 1, name: "Data Science", url: "https://en.wikipedia.org/wiki/Data_science" },
  { id: 2, name: "Machine Learning", url: "https://en.wikipedia.org/wiki/Machine_learning" },
  { id: 3, name: "Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn" },
  { id: 4, name: "Digital Marketing", url: "https://www.investopedia.com/terms/d/digital-marketing.asp" },
  { id: 5, name: "Blockchain", url: "https://www.ibm.com/topics/what-is-blockchain" },
  { id: 6, name: "DevOps", url: "https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-devops" },
]

const TopicSuggestion = () => {
  return (
    <div className="topic-suggestion-dashbd">
      <h3>Topics You Might Be Interested In</h3>
      <div className="topic-cards-dashbd">
        {topics.map((topic) => (
          <a
            key={topic.id}
            href={topic.url}
            className="topic-card-dashbd"
            target="_blank"
            rel="noopener noreferrer"
          >
            {topic.name}
          </a>
        ))}
      </div>
    </div>
  )
}

export default TopicSuggestion
