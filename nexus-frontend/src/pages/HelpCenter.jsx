"use client"

import { useState } from "react"
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  BookOpen,
  Settings,
  CreditCard,
  Award,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  Users,
  FileText,
  Lightbulb,
  Monitor,
  Smartphone,
} from "lucide-react"
import "./HelpCenter.css"

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedFaq, setExpandedFaq] = useState(null)

  const categories = [
    { id: "all", name: "All Topics", icon: BookOpen },
    { id: "account", name: "Account", icon: Settings },
    { id: "courses", name: "Courses", icon: BookOpen },
    { id: "technical", name: "Technical", icon: Monitor },
    { id: "billing", name: "Billing", icon: CreditCard },
    { id: "exams", name: "Exams", icon: Award },
  ]

  const faqs = [
    {
      id: 1,
      category: "account",
      question: "How do I reset my password?",
      answer:
        'You can reset your password by clicking the "Forgot Password" link on the login page. Enter your email address and we\'ll send you a reset link within a few minutes.',
    },
    {
      id: 2,
      category: "account",
      question: "How do I update my profile information?",
      answer:
        'Go to your Profile page by clicking on your avatar in the top right corner, then select "My Profile". You can edit your personal information, contact details, and preferences from there.',
    },
    {
      id: 3,
      category: "courses",
      question: "How do I enroll in a course?",
      answer:
        'Browse our course catalog, click on the course you\'re interested in, and click the "Enroll Now" button. Some courses may require prerequisites or payment before enrollment.',
    },
    {
      id: 4,
      category: "courses",
      question: "Can I access courses offline?",
      answer:
        "Yes! Our mobile app allows you to download course materials for offline viewing. Video lectures and reading materials can be accessed without an internet connection.",
    },
    {
      id: 5,
      category: "technical",
      question: "What browsers are supported?",
      answer:
        "We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using Chrome or Firefox with JavaScript enabled.",
    },
    {
      id: 6,
      category: "technical",
      question: "Why is my video not playing?",
      answer:
        "Try refreshing the page, clearing your browser cache, or switching to a different browser. If the issue persists, check your internet connection or contact our technical support.",
    },
    {
      id: 7,
      category: "billing",
      question: "How do I cancel my subscription?",
      answer:
        'You can cancel your subscription anytime from your Account Settings. Go to the Billing section and click "Cancel Subscription". You\'ll retain access until the end of your current billing period.',
    },
    {
      id: 8,
      category: "billing",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.",
    },
    {
      id: 9,
      category: "exams",
      question: "How do I schedule an exam?",
      answer:
        "Once you've completed the required coursework, go to the Exams section in your dashboard. Select the exam you want to take and choose from available time slots.",
    },
    {
      id: 10,
      category: "exams",
      question: "What happens if I fail an exam?",
      answer:
        "Don't worry! You can retake most exams after a 7-day waiting period. We'll provide detailed feedback on areas to improve, and you'll have access to additional study materials.",
    },
  ]

  const supportChannels = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "9 AM - 6 PM EST",
      icon: MessageCircle,
      action: "Start Chat",
      color: "blue",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "24-hour response time",
      icon: Mail,
      action: "Send Email",
      color: "green",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      availability: "1-800-NEXUS-HELP",
      icon: Phone,
      action: "Call Now",
      color: "purple",
    },
    {
      title: "Community Forum",
      description: "Get help from other students",
      availability: "Available 24/7",
      icon: Users,
      action: "Visit Forum",
      color: "orange",
    },
  ]

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough of the platform",
      icon: Lightbulb,
      type: "Guide",
    },
    {
      title: "Study Tips for Actuarial Exams",
      description: "Expert advice on exam preparation",
      icon: Award,
      type: "Article",
    },
    {
      title: "Technical Requirements",
      description: "System requirements and setup",
      icon: Monitor,
      type: "Documentation",
    },
    {
      title: "Mobile App Tutorial",
      description: "How to use our mobile application",
      icon: Smartphone,
      type: "Video",
    },
    {
      title: "Course Navigation",
      description: "Learn how to navigate through courses",
      icon: BookOpen,
      type: "Video",
    },
    {
      title: "Certification Process",
      description: "Understanding our certification system",
      icon: FileText,
      type: "Guide",
    },
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  return (
    <div className="help-center">
      {/* Hero Section */}
      <div className="help-hero">
        <div className="help-hero-content">
          <h1>How can we help you?</h1>
          <p>Find answers to common questions or get in touch with our support team</p>

          <div className="help-search-container">
            <Search className="help-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="help-search-input"
            />
          </div>
        </div>
      </div>

      <div className="help-content">
        {/* Quick Support */}
        <section className="help-section">
          <h2>Get Support</h2>
          <div className="support-channels">
            {supportChannels.map((channel, index) => (
              <div key={index} className={`support-card support-${channel.color}`}>
                <div className="support-icon">
                  <channel.icon size={24} />
                </div>
                <div className="support-info">
                  <h3>{channel.title}</h3>
                  <p>{channel.description}</p>
                  <div className="support-availability">
                    <Clock size={14} />
                    <span>{channel.availability}</span>
                  </div>
                </div>
                <button className="support-action">
                  {channel.action}
                  <ExternalLink size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="help-section">
          <h2>Frequently Asked Questions</h2>

          {/* Category Filter */}
          <div className="faq-categories">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon size={16} />
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="faq-list">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="faq-item">
                <button className="faq-question" onClick={() => toggleFaq(faq.id)}>
                  <span>{faq.question}</span>
                  {expandedFaq === faq.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                {expandedFaq === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="no-results">
              <BookOpen size={48} />
              <h3>No results found</h3>
              <p>Try adjusting your search terms or browse different categories</p>
            </div>
          )}
        </section>

        {/* Resources Section */}
        <section className="help-section">
          <h2>Helpful Resources</h2>
          <div className="resources-grid">
            {resources.map((resource, index) => (
              <div key={index} className="resource-card">
                <div className="resource-icon">
                  <resource.icon size={24} />
                </div>
                <div className="resource-content">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <span className="resource-type">{resource.type}</span>
                </div>
                <ChevronRight size={20} className="resource-arrow" />
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="help-section contact-section">
          <div className="contact-card">
            <h2>Still need help?</h2>
            <p>Can't find what you're looking for? Our support team is here to help you succeed.</p>
            <div className="contact-actions">
              <button className="contact-btn primary">
                <MessageCircle size={20} />
                Start Live Chat
              </button>
              <button className="contact-btn secondary">
                <Mail size={20} />
                Send Email
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HelpCenter
