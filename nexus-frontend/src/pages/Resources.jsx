"use client"

import { useState, useEffect } from "react"
import { Search, Filter, BookOpen, FileText, Download } from "lucide-react"
import "./Resources.css"

const resourceCategories = [
  { id: "all", name: "All Resources" },
  { id: "soa", name: "Society of Actuaries (SOA)" },
  { id: "ifoa", name: "Institute and Faculty of Actuaries (IFOA)" },
  { id: "cas", name: "Casualty Actuarial Society (CAS)" },
  { id: "books", name: "Actuarial Books" },
  { id: "papers", name: "Research Papers" },
]

const resourceTypes = [
  { id: "all", name: "All Types" },
  { id: "free", name: "Free Resources" },
  { id: "premium", name: "Premium Resources" },
  { id: "books", name: "Books" },
  { id: "papers", name: "Papers" },
  { id: "exams", name: "Past Exams" },
]

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])

  useEffect(() => {
    // Simulating API call to fetch resources
    const fetchResources = async () => {
      // This would be an API call in a real application
      const mockResources = [
        {
          id: 1,
          title: "Actuarial Mathematics for Life Contingent Risks",
          author: "David C. M. Dickson, Mary R. Hardy, Howard R. Waters",
          category: "books",
          type: "premium",
          organization: "soa",
          description:
            "A comprehensive textbook covering the mathematical models for pricing and reserving in life insurance.",
          downloadUrl: "/resources/qualification-handbook-2022-23.pdf",
          coverImage: "/assets/soa.jpeg",
          isPremium: true,
        },
        {
          id: 2,
          title: "Loss Models: From Data to Decisions",
          author: "Stuart A. Klugman, Harry H. Panjer, Gordon E. Willmot",
          category: "books",
          type: "premium",
          organization: "cas",
          description: "A comprehensive guide to building and evaluating loss models.",
          downloadUrl: "/resources/loss-models.pdf",
          coverImage: "/assets/images.jpeg",
          isPremium: true,
        },
        {
          id: 3,
          title: "SOA Exam P Sample Questions",
          author: "Society of Actuaries",
          category: "exams",
          type: "free",
          organization: "soa",
          description: "Sample questions for the SOA Exam P (Probability).",
          downloadUrl: "/resources/soa-exam-p-sample.pdf",
          coverImage: "/assets/soa.jpeg",
          isPremium: false,
        },
        {
          id: 4,
          title: "IFOA CT1 Core Reading",
          author: "Institute and Faculty of Actuaries",
          category: "papers",
          type: "premium",
          organization: "ifoa",
          description: "Core reading material for the CT1 Financial Mathematics exam.",
          downloadUrl: "/resources/ifoa-ct1.pdf",
          coverImage: "/assets/ifoa.jpg",
          isPremium: true,
        },
        {
          id: 5,
          title: "CAS Exam 5 Past Papers",
          author: "Casualty Actuarial Society",
          category: "exams",
          type: "free",
          organization: "cas",
          description:
            "Past papers for CAS Exam 5 on Basic Techniques for Ratemaking and Estimating Claim Liabilities.",
          downloadUrl: "/resources/cas-exam-5.pdf",
          coverImage: "/assets/images.jpeg",
          isPremium: false,
        },
      ]

      setResources(mockResources)
      setFilteredResources(mockResources)
    }

    fetchResources()
  }, [])

  useEffect(() => {
    // Filter resources based on selected category, type, and search query
    let filtered = resources

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (resource) => resource.organization === selectedCategory || resource.category === selectedCategory,
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((resource) => resource.type === selectedType)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.author.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query),
      )
    }

    setFilteredResources(filtered)
  }, [selectedCategory, selectedType, searchQuery, resources])

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Resource Library</h1>
        <p>Access actuarial books, papers, and exam materials from leading organizations</p>

        <div className="resources-search">
          <div className="search-input-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-container">
            <Filter size={18} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {resourceCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-container-resource">
            <BookOpen size={18} />
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              {resourceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="resources-grid">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="resource-cover">
                <img src={resource.coverImage || "/placeholder.svg"} alt={resource.title} />
                {resource.isPremium && <span className="premium-badge">Premium</span>}
              </div>
              <div className="resource-details">
                <h3>{resource.title}</h3>
                <p className="resource-author">By {resource.author}</p>
                <p className="resource-description">{resource.description}</p>
                <div className="resource-actions">
                  <button className="view-btn">
                    <FileText size={16} />
                    View
                  </button>
                  <button className={`download-btn ${resource.isPremium ? "premium-btn" : ""}`}>
                    <Download size={16} />
                    {resource.isPremium ? "Premium" : "Download"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-resources">
            <p>No resources found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Resources
