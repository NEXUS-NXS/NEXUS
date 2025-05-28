"use client"

import { useState } from "react"
import { Save, RotateCcw } from "lucide-react"
import "./SimulationSettings.css"

const SimulationSettings = ({ simulation, onUpdate }) => {
  const [settings, setSettings] = useState({
    language: "Fast Expression",
    instrumentType: "Equity",
    region: "USA",
    universe: "TOP3000",
    delay: 1,
    neutralization: "Subindustry",
    decay: 4,
    truncation: 0.08,
    pasteurization: "On",
    unitHandling: "Verify",
    nanHandling: "Off",
    testPeriodYears: 1,
    testPeriodMonths: 0,
  })

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveAsDefault = () => {
    // Save settings as default
    localStorage.setItem("defaultSimulationSettings", JSON.stringify(settings))
    alert("Settings saved as default")
  }

  const handleApply = () => {
    // Apply settings to current simulation
    onUpdate({
      ...simulation,
      settings: settings,
    })
    alert("Settings applied successfully")
  }

  const handleReset = () => {
    setSettings({
      language: "Fast Expression",
      instrumentType: "Equity",
      region: "USA",
      universe: "TOP3000",
      delay: 1,
      neutralization: "Subindustry",
      decay: 4,
      truncation: 0.08,
      pasteurization: "On",
      unitHandling: "Verify",
      nanHandling: "Off",
      testPeriodYears: 1,
      testPeriodMonths: 0,
    })
  }

  return (
    <div className="simulation-settings">
      <div className="settings-container">
        <div className="settings-grid">
          {/* Language */}
          <div className="setting-group">
            <label>LANGUAGE</label>
            <select value={settings.language} onChange={(e) => handleSettingChange("language", e.target.value)}>
              <option value="Fast Expression">Fast Expression</option>
              <option value="Python">Python</option>
              <option value="R">R</option>
            </select>
          </div>

          {/* Instrument Type */}
          <div className="setting-group">
            <label>INSTRUMENT TYPE</label>
            <select
              value={settings.instrumentType}
              onChange={(e) => handleSettingChange("instrumentType", e.target.value)}
            >
              <option value="Equity">Equity</option>
              <option value="Fixed Income">Fixed Income</option>
              <option value="Commodities">Commodities</option>
              <option value="FX">FX</option>
            </select>
          </div>

          {/* Region */}
          <div className="setting-group">
            <label>REGION</label>
            <select value={settings.region} onChange={(e) => handleSettingChange("region", e.target.value)}>
              <option value="USA">USA</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Global">Global</option>
            </select>
          </div>

          {/* Universe */}
          <div className="setting-group">
            <label>UNIVERSE</label>
            <select value={settings.universe} onChange={(e) => handleSettingChange("universe", e.target.value)}>
              <option value="TOP3000">TOP3000</option>
              <option value="TOP1000">TOP1000</option>
              <option value="TOP500">TOP500</option>
              <option value="CUSTOM">CUSTOM</option>
            </select>
          </div>

          {/* Delay */}
          <div className="setting-group">
            <label>DELAY</label>
            <select
              value={settings.delay}
              onChange={(e) => handleSettingChange("delay", Number.parseInt(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>

          {/* Neutralization */}
          <div className="setting-group">
            <label>NEUTRALIZATION</label>
            <select
              value={settings.neutralization}
              onChange={(e) => handleSettingChange("neutralization", e.target.value)}
            >
              <option value="Subindustry">Subindustry</option>
              <option value="Industry">Industry</option>
              <option value="Sector">Sector</option>
              <option value="Market">Market</option>
              <option value="None">None</option>
            </select>
          </div>

          {/* Decay */}
          <div className="setting-group">
            <label>DECAY</label>
            <div className="slider-container">
              <input
                type="range"
                min="1"
                max="20"
                value={settings.decay}
                onChange={(e) => handleSettingChange("decay", Number.parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">{settings.decay}</span>
            </div>
          </div>

          {/* Truncation */}
          <div className="setting-group">
            <label>TRUNCATION</label>
            <div className="slider-container">
              <input
                type="range"
                min="0.01"
                max="0.20"
                step="0.01"
                value={settings.truncation}
                onChange={(e) => handleSettingChange("truncation", Number.parseFloat(e.target.value))}
                className="slider"
              />
              <span className="slider-value">{settings.truncation}</span>
            </div>
          </div>

          {/* Pasteurization */}
          <div className="setting-group">
            <label>PASTEURIZATION</label>
            <select
              value={settings.pasteurization}
              onChange={(e) => handleSettingChange("pasteurization", e.target.value)}
            >
              <option value="On">On</option>
              <option value="Off">Off</option>
            </select>
          </div>

          {/* Unit Handling */}
          <div className="setting-group">
            <label>UNIT HANDLING</label>
            <select value={settings.unitHandling} onChange={(e) => handleSettingChange("unitHandling", e.target.value)}>
              <option value="Verify">Verify</option>
              <option value="Ignore">Ignore</option>
              <option value="Strict">Strict</option>
            </select>
          </div>

          {/* NaN Handling */}
          <div className="setting-group">
            <label>NAN HANDLING</label>
            <select value={settings.nanHandling} onChange={(e) => handleSettingChange("nanHandling", e.target.value)}>
              <option value="Off">Off</option>
              <option value="On">On</option>
            </select>
          </div>

          {/* Test Period */}
          <div className="setting-group full-width">
            <label>TEST PERIOD</label>
            <div className="test-period-container">
              <div className="period-input">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.testPeriodYears}
                  onChange={(e) => handleSettingChange("testPeriodYears", Number.parseInt(e.target.value))}
                />
                <span>YEARS</span>
              </div>
              <div className="period-input">
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={settings.testPeriodMonths}
                  onChange={(e) => handleSettingChange("testPeriodMonths", Number.parseInt(e.target.value))}
                />
                <span>MONTHS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button className="reset-btn" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset
          </button>
          <button className="save-default-btn" onClick={handleSaveAsDefault}>
            <Save size={16} />
            Save as Default
          </button>
          <button className="apply-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimulationSettings
