"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import "./ModelValidation.css"

const ModelValidation = ({ validation, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckSubmission = () => {
    // Simulate validation check
    alert("Checking submission criteria...")
  }

  const handleSubmitAlpha = () => {
    setIsSubmitting(true)
    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmit && onSubmit()
      alert("Alpha submitted successfully!")
    }, 2000)
  }

  if (!validation) {
    return (
      <div className="validation-placeholder">
        <p>Run simulation to see validation results</p>
      </div>
    )
  }

  const totalCriteria = validation.passed.length + validation.failed.length + (validation.pending?.length || 0)
  const passedCount = validation.passed.length
  const failedCount = validation.failed.length
  const pendingCount = validation.pending?.length || 0

  return (
    <div className="model-validation">
      <div className="validation-summary">
        <div className="criteria-counts">
          <div className="count-item passed">
            <CheckCircle size={20} />
            <span>{passedCount} PASS</span>
          </div>
          <div className="count-item failed">
            <XCircle size={20} />
            <span>{failedCount} FAIL</span>
          </div>
          {pendingCount > 0 && (
            <div className="count-item pending">
              <Clock size={20} />
              <span>{pendingCount} PENDING</span>
            </div>
          )}
        </div>

        <div className="overall-status">
          {failedCount === 0 && pendingCount === 0 ? (
            <div className="status-badge success">
              <CheckCircle size={16} />
              All Criteria Passed
            </div>
          ) : failedCount > 0 ? (
            <div className="status-badge error">
              <XCircle size={16} />
              Needs Improvement
            </div>
          ) : (
            <div className="status-badge warning">
              <Clock size={16} />
              Validation in Progress
            </div>
          )}
        </div>
      </div>

      <div className="validation-details">
        {/* Passed Criteria */}
        {validation.passed.length > 0 && (
          <div className="criteria-section">
            <h3 className="section-title passed">
              <CheckCircle size={18} />
              Passed Criteria ({validation.passed.length})
            </h3>
            <div className="criteria-list">
              {validation.passed.map((criterion, index) => (
                <div key={index} className="criterion-item passed">
                  <div className="criterion-icon">
                    <CheckCircle size={16} />
                  </div>
                  <div className="criterion-text">{criterion}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failed Criteria */}
        {validation.failed.length > 0 && (
          <div className="criteria-section">
            <h3 className="section-title failed">
              <XCircle size={18} />
              Failed Criteria ({validation.failed.length})
            </h3>
            <div className="criteria-list">
              {validation.failed.map((criterion, index) => (
                <div key={index} className="criterion-item failed">
                  <div className="criterion-icon">
                    <XCircle size={16} />
                  </div>
                  <div className="criterion-text">{criterion}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Criteria */}
        {validation.pending && validation.pending.length > 0 && (
          <div className="criteria-section">
            <h3 className="section-title pending">
              <Clock size={18} />
              Pending Validation ({validation.pending.length})
            </h3>
            <div className="criteria-list">
              {validation.pending.map((criterion, index) => (
                <div key={index} className="criterion-item pending">
                  <div className="criterion-icon">
                    <Clock size={16} />
                  </div>
                  <div className="criterion-text">{criterion}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="validation-actions">
        <button className="check-submission-btn" onClick={handleCheckSubmission}>
          Check Submission
        </button>
        <button
          className={`submit-alpha-btn ${failedCount > 0 ? "disabled" : ""}`}
          onClick={handleSubmitAlpha}
          disabled={failedCount > 0 || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Alpha"}
        </button>
      </div>

      {failedCount > 0 && (
        <div className="submission-warning">
          <AlertTriangle size={16} />
          <span>
            Cannot submit alpha until all validation criteria are met. Please address the failed criteria and run the
            simulation again.
          </span>
        </div>
      )}
    </div>
  )
}

export default ModelValidation
