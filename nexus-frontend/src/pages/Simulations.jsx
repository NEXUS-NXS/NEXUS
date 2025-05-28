// "use client"

// import { useState, useEffect } from "react"
// import { Search, Filter, BarChart2, Clock, BookOpen, Save, Share2, Download } from "lucide-react"
// import { useUser } from "../context/UserContext"
// import SimulationCard from "../components/simulations/SimulationCard"
// import SimulationInterface from "../components/simulations/SimulationInterface"
// import ResultsVisualization from "../components/simulations/ResultsVisualization"
// import "./Simulations.css"

// const simulationCategories = [
//   { id: "all", name: "All Simulations" },
//   { id: "risk", name: "Risk Modeling" },
//   { id: "life", name: "Life Insurance" },
//   { id: "property", name: "Property & Casualty" },
//   { id: "health", name: "Health Insurance" },
//   { id: "pension", name: "Pension & Retirement" },
//   { id: "financial", name: "Financial Modeling" },
// ]

// const simulationLevels = [
//   { id: "all", name: "All Levels" },
//   { id: "beginner", name: "Beginner" },
//   { id: "intermediate", name: "Intermediate" },
//   { id: "advanced", name: "Advanced" },
// ]

// const Simulations = () => {
//   const { user } = useUser()
//   const [selectedCategory, setSelectedCategory] = useState("all")
//   const [selectedLevel, setSelectedLevel] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [simulations, setSimulations] = useState([])
//   const [filteredSimulations, setFilteredSimulations] = useState([])
//   const [activeSimulation, setActiveSimulation] = useState(null)
//   const [simulationResults, setSimulationResults] = useState(null)
//   const [recentSimulations, setRecentSimulations] = useState([])
//   const [isRunning, setIsRunning] = useState(false)

//   useEffect(() => {
//     fetchSimulations()
//     fetchRecentSimulations()
//   }, [])

//   useEffect(() => {
//     filterSimulations()
//   }, [selectedCategory, selectedLevel, searchQuery, simulations])

//   const fetchSimulations = async () => {
//     // Simulate API call
//     const mockSimulations = [
//       {
//         id: 1,
//         title: "Monte Carlo Risk Analysis",
//         category: "risk",
//         level: "intermediate",
//         description:
//           "Run Monte Carlo simulations to analyze the distribution of potential outcomes and assess risk factors in various scenarios.",
//         image: "/assets/monte-carlo.jpg",
//         duration: "5-10 minutes",
//         popularity: 89,
//         parameters: [
//           {
//             id: "iterations",
//             name: "Number of Iterations",
//             type: "number",
//             min: 100,
//             max: 10000,
//             default: 1000,
//             step: 100,
//           },
//           {
//             id: "mean",
//             name: "Mean Return",
//             type: "number",
//             min: -0.5,
//             max: 0.5,
//             default: 0.08,
//             step: 0.01,
//           },
//           {
//             id: "stdDev",
//             name: "Standard Deviation",
//             type: "number",
//             min: 0.01,
//             max: 0.5,
//             default: 0.15,
//             step: 0.01,
//           },
//           {
//             id: "years",
//             name: "Time Horizon (Years)",
//             type: "number",
//             min: 1,
//             max: 50,
//             default: 10,
//             step: 1,
//           },
//           {
//             id: "initialInvestment",
//             name: "Initial Investment",
//             type: "number",
//             min: 1000,
//             max: 1000000,
//             default: 100000,
//             step: 1000,
//           },
//         ],
//         resultTypes: ["histogram", "line", "statistics"],
//       },
//       {
//         id: 2,
//         title: "Life Insurance Premium Calculator",
//         category: "life",
//         level: "beginner",
//         description:
//           "Calculate life insurance premiums based on mortality tables, interest rates, and policy characteristics.",
//         image: "/assets/LIC-Premium-Calculator.webp",
//         duration: "2-5 minutes",
//         popularity: 95,
//         parameters: [
//           {
//             id: "age",
//             name: "Age",
//             type: "number",
//             min: 18,
//             max: 80,
//             default: 35,
//             step: 1,
//           },
//           {
//             id: "gender",
//             name: "Gender",
//             type: "select",
//             options: [
//               { value: "male", label: "Male" },
//               { value: "female", label: "Female" },
//             ],
//             default: "male",
//           },
//           {
//             id: "smoker",
//             name: "Smoker",
//             type: "boolean",
//             default: false,
//           },
//           {
//             id: "coverageAmount",
//             name: "Coverage Amount",
//             type: "number",
//             min: 10000,
//             max: 10000000,
//             default: 500000,
//             step: 10000,
//           },
//           {
//             id: "policyTerm",
//             name: "Policy Term (Years)",
//             type: "number",
//             min: 5,
//             max: 30,
//             default: 20,
//             step: 5,
//           },
//           {
//             id: "interestRate",
//             name: "Interest Rate",
//             type: "number",
//             min: 0.01,
//             max: 0.1,
//             default: 0.03,
//             step: 0.005,
//           },
//         ],
//         resultTypes: ["table", "bar", "statistics"],
//       },
//       {
//         id: 3,
//         title: "Property Insurance Loss Simulation",
//         category: "property",
//         level: "advanced",
//         description:
//           "Simulate property insurance losses using probability distributions for frequency and severity to analyze risk exposure.",
//         image: "/placeholder.svg?height=150&width=250",
//         duration: "10-15 minutes",
//         popularity: 82,
//         parameters: [
//           {
//             id: "policies",
//             name: "Number of Policies",
//             type: "number",
//             min: 100,
//             max: 100000,
//             default: 10000,
//             step: 1000,
//           },
//           {
//             id: "years",
//             name: "Simulation Years",
//             type: "number",
//             min: 1,
//             max: 30,
//             default: 5,
//             step: 1,
//           },
//           {
//             id: "frequencyDist",
//             name: "Frequency Distribution",
//             type: "select",
//             options: [
//               { value: "poisson", label: "Poisson" },
//               { value: "negbinomial", label: "Negative Binomial" },
//             ],
//             default: "poisson",
//           },
//           {
//             id: "freqParam",
//             name: "Frequency Parameter (λ)",
//             type: "number",
//             min: 0.01,
//             max: 1,
//             default: 0.05,
//             step: 0.01,
//           },
//           {
//             id: "severityDist",
//             name: "Severity Distribution",
//             type: "select",
//             options: [
//               { value: "lognormal", label: "Lognormal" },
//               { value: "gamma", label: "Gamma" },
//               { value: "pareto", label: "Pareto" },
//             ],
//             default: "lognormal",
//           },
//           {
//             id: "sevMean",
//             name: "Severity Mean",
//             type: "number",
//             min: 1000,
//             max: 100000,
//             default: 10000,
//             step: 1000,
//           },
//           {
//             id: "sevStdDev",
//             name: "Severity Std Dev",
//             type: "number",
//             min: 1000,
//             max: 100000,
//             default: 5000,
//             step: 1000,
//           },
//         ],
//         resultTypes: ["histogram", "table", "scatter", "statistics"],
//       },
//       {
//         id: 4,
//         title: "Pension Fund Valuation",
//         category: "pension",
//         level: "intermediate",
//         description:
//           "Value pension funds and project future liabilities based on demographic and economic assumptions.",
//         image: "/placeholder.svg?height=150&width=250",
//         duration: "5-10 minutes",
//         popularity: 78,
//         parameters: [
//           {
//             id: "employees",
//             name: "Number of Employees",
//             type: "number",
//             min: 10,
//             max: 10000,
//             default: 1000,
//             step: 10,
//           },
//           {
//             id: "avgAge",
//             name: "Average Employee Age",
//             type: "number",
//             min: 25,
//             max: 55,
//             default: 40,
//             step: 1,
//           },
//           {
//             id: "retirementAge",
//             name: "Retirement Age",
//             type: "number",
//             min: 55,
//             max: 70,
//             default: 65,
//             step: 1,
//           },
//           {
//             id: "discountRate",
//             name: "Discount Rate",
//             type: "number",
//             min: 0.01,
//             max: 0.1,
//             default: 0.04,
//             step: 0.005,
//           },
//           {
//             id: "salaryGrowth",
//             name: "Annual Salary Growth",
//             type: "number",
//             min: 0.01,
//             max: 0.1,
//             default: 0.03,
//             step: 0.005,
//           },
//           {
//             id: "fundingRatio",
//             name: "Current Funding Ratio",
//             type: "number",
//             min: 0.5,
//             max: 1.5,
//             default: 0.9,
//             step: 0.05,
//           },
//         ],
//         resultTypes: ["line", "area", "table", "statistics"],
//       },
//       {
//         id: 5,
//         title: "Health Insurance Claims Modeling",
//         category: "health",
//         level: "advanced",
//         description:
//           "Model health insurance claims using demographic data, utilization patterns, and cost trends to predict future claims expenses.",
//         image: "/placeholder.svg?height=150&width=250",
//         duration: "10-15 minutes",
//         popularity: 75,
//         parameters: [
//           {
//             id: "policyholders",
//             name: "Number of Policyholders",
//             type: "number",
//             min: 100,
//             max: 100000,
//             default: 5000,
//             step: 100,
//           },
//           {
//             id: "ageDistribution",
//             name: "Age Distribution",
//             type: "select",
//             options: [
//               { value: "young", label: "Young (18-35)" },
//               { value: "mixed", label: "Mixed (18-65)" },
//               { value: "senior", label: "Senior (50-80)" },
//             ],
//             default: "mixed",
//           },
//           {
//             id: "claimFrequency",
//             name: "Annual Claim Frequency",
//             type: "number",
//             min: 0.5,
//             max: 10,
//             default: 3,
//             step: 0.5,
//           },
//           {
//             id: "avgClaimAmount",
//             name: "Average Claim Amount",
//             type: "number",
//             min: 100,
//             max: 10000,
//             default: 1500,
//             step: 100,
//           },
//           {
//             id: "inflationRate",
//             name: "Medical Inflation Rate",
//             type: "number",
//             min: 0.01,
//             max: 0.15,
//             default: 0.06,
//             step: 0.01,
//           },
//           {
//             id: "simulationYears",
//             name: "Projection Years",
//             type: "number",
//             min: 1,
//             max: 10,
//             default: 5,
//             step: 1,
//           },
//         ],
//         resultTypes: ["line", "bar", "heatmap", "statistics"],
//       },
//       {
//         id: 6,
//         title: "Financial Asset Pricing",
//         category: "financial",
//         level: "beginner",
//         description:
//           "Apply financial models to price assets including stocks, bonds, and derivatives using modern pricing theories.",
//         image: "/placeholder.svg?height=150&width=250",
//         duration: "5-10 minutes",
//         popularity: 85,
//         parameters: [
//           {
//             id: "assetType",
//             name: "Asset Type",
//             type: "select",
//             options: [
//               { value: "stock", label: "Stock" },
//               { value: "bond", label: "Bond" },
//               { value: "option", label: "Option" },
//             ],
//             default: "stock",
//           },
//           {
//             id: "currentPrice",
//             name: "Current Price",
//             type: "number",
//             min: 1,
//             max: 1000,
//             default: 100,
//             step: 1,
//           },
//           {
//             id: "volatility",
//             name: "Volatility",
//             type: "number",
//             min: 0.05,
//             max: 0.5,
//             default: 0.2,
//             step: 0.01,
//           },
//           {
//             id: "riskFreeRate",
//             name: "Risk-Free Rate",
//             type: "number",
//             min: 0.01,
//             max: 0.1,
//             default: 0.03,
//             step: 0.005,
//           },
//           {
//             id: "timeHorizon",
//             name: "Time Horizon (Years)",
//             type: "number",
//             min: 0.1,
//             max: 10,
//             default: 1,
//             step: 0.1,
//           },
//         ],
//         resultTypes: ["line", "statistics", "table"],
//       },
//     ]

//     setSimulations(mockSimulations)
//     setFilteredSimulations(mockSimulations)
//   }

//   const fetchRecentSimulations = async () => {
//     // Simulate API call
//     const mockRecentSimulations = [
//       {
//         id: 1,
//         simulationId: 1,
//         title: "Monte Carlo Risk Analysis",
//         date: "2024-01-12T10:30:00Z",
//         parameters: {
//           iterations: 5000,
//           mean: 0.07,
//           stdDev: 0.18,
//           years: 15,
//           initialInvestment: 150000,
//         },
//       },
//       {
//         id: 2,
//         simulationId: 4,
//         title: "Pension Fund Valuation",
//         date: "2024-01-10T14:45:00Z",
//         parameters: {
//           employees: 2500,
//           avgAge: 42,
//           retirementAge: 67,
//           discountRate: 0.035,
//           salaryGrowth: 0.025,
//           fundingRatio: 0.85,
//         },
//       },
//       {
//         id: 3,
//         simulationId: 2,
//         title: "Life Insurance Premium Calculator",
//         date: "2024-01-08T09:15:00Z",
//         parameters: {
//           age: 40,
//           gender: "female",
//           smoker: false,
//           coverageAmount: 750000,
//           policyTerm: 25,
//           interestRate: 0.035,
//         },
//       },
//     ]

//     setRecentSimulations(mockRecentSimulations)
//   }

//   const filterSimulations = () => {
//     let filtered = simulations

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter((simulation) => simulation.category === selectedCategory)
//     }

//     if (selectedLevel !== "all") {
//       filtered = filtered.filter((simulation) => simulation.level === selectedLevel)
//     }

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (simulation) =>
//           simulation.title.toLowerCase().includes(query) || simulation.description.toLowerCase().includes(query),
//       )
//     }

//     setFilteredSimulations(filtered)
//   }

//   const handleSimulationSelect = (simulation) => {
//     setActiveSimulation(simulation)
//     setSimulationResults(null)
//   }

//   const handleBackToList = () => {
//     setActiveSimulation(null)
//     setSimulationResults(null)
//   }

//   const handleRunSimulation = (parameters) => {
//     setIsRunning(true)

//     // Simulate running the simulation with a delay
//     setTimeout(() => {
//       // This would be replaced with actual simulation logic
//       const mockResults = generateMockResults(activeSimulation, parameters)
//       setSimulationResults(mockResults)
//       setIsRunning(false)

//       // Update recent simulations
//       const newRecentSimulation = {
//         id: Date.now(),
//         simulationId: activeSimulation.id,
//         title: activeSimulation.title,
//         date: new Date().toISOString(),
//         parameters: parameters,
//       }

//       setRecentSimulations([newRecentSimulation, ...recentSimulations.slice(0, 4)])
//     }, 3000)
//   }

//   const generateMockResults = (simulation, parameters) => {
//     // This function would generate mock results based on the simulation type and parameters
//     // In a real application, this would be replaced with actual simulation logic

//     const results = {
//       simulationId: simulation.id,
//       title: simulation.title,
//       runDate: new Date().toISOString(),
//       parameters: parameters,
//       data: {},
//     }

//     if (simulation.id === 1) {
//       // Monte Carlo Risk Analysis
//       const iterations = parameters.iterations
//       const mean = parameters.mean
//       const stdDev = parameters.stdDev
//       const years = parameters.years
//       const initialInvestment = parameters.initialInvestment

//       // Generate random returns
//       const portfolioValues = []
//       const finalValues = []

//       for (let i = 0; i < iterations; i++) {
//         let value = initialInvestment
//         const yearlyValues = [value]

//         for (let y = 1; y <= years; y++) {
//           // Generate random return using normal distribution approximation
//           const randomReturn = mean + (stdDev * (Math.random() + Math.random() + Math.random() + Math.random() - 2)) / 2
//           value = value * (1 + randomReturn)
//           yearlyValues.push(value)
//         }

//         portfolioValues.push(yearlyValues)
//         finalValues.push(value)
//       }

//       // Calculate statistics
//       finalValues.sort((a, b) => a - b)
//       const min = finalValues[0]
//       const max = finalValues[finalValues.length - 1]
//       const median = finalValues[Math.floor(finalValues.length / 2)]
//       const percentile5 = finalValues[Math.floor(finalValues.length * 0.05)]
//       const percentile95 = finalValues[Math.floor(finalValues.length * 0.95)]

//       // Calculate average annual return
//       const averageValue = finalValues.reduce((sum, value) => sum + value, 0) / finalValues.length
//       const averageAnnualReturn = Math.pow(averageValue / initialInvestment, 1 / years) - 1

//       results.data = {
//         histogram: {
//           values: finalValues,
//           bins: 20,
//         },
//         timeSeries: {
//           years: Array.from({ length: years + 1 }, (_, i) => i),
//           percentile5: Array.from({ length: years + 1 }, (_, i) => {
//             const values = portfolioValues.map((sim) => sim[i])
//             values.sort((a, b) => a - b)
//             return values[Math.floor(values.length * 0.05)]
//           }),
//           percentile50: Array.from({ length: years + 1 }, (_, i) => {
//             const values = portfolioValues.map((sim) => sim[i])
//             values.sort((a, b) => a - b)
//             return values[Math.floor(values.length * 0.5)]
//           }),
//           percentile95: Array.from({ length: years + 1 }, (_, i) => {
//             const values = portfolioValues.map((sim) => sim[i])
//             values.sort((a, b) => a - b)
//             return values[Math.floor(values.length * 0.95)]
//           }),
//         },
//         statistics: {
//           initialInvestment,
//           min: min.toFixed(2),
//           max: max.toFixed(2),
//           median: median.toFixed(2),
//           percentile5: percentile5.toFixed(2),
//           percentile95: percentile95.toFixed(2),
//           averageAnnualReturn: (averageAnnualReturn * 100).toFixed(2) + "%",
//         },
//       }
//     } else if (simulation.id === 2) {
//       // Life Insurance Premium Calculator
//       const age = parameters.age
//       const gender = parameters.gender
//       const smoker = parameters.smoker
//       const coverageAmount = parameters.coverageAmount
//       const policyTerm = parameters.policyTerm
//       const interestRate = parameters.interestRate

//       // Simplified premium calculation
//       let mortalityFactor = 0.001 * Math.exp(0.05 * (age - 30))
//       if (gender === "female") mortalityFactor *= 0.85
//       if (smoker) mortalityFactor *= 2.5

//       // Calculate present value of future benefits
//       const presentValueFactor = (1 - Math.pow(1 + interestRate, -policyTerm)) / interestRate
//       const riskPremium = mortalityFactor * coverageAmount
//       const annualPremium = riskPremium / (1 - 1 / presentValueFactor)

//       // Generate premium breakdown by year
//       const yearlyBreakdown = Array.from({ length: policyTerm }, (_, i) => {
//         const year = i + 1
//         const ageAtYear = age + year
//         let yearlyMortalityFactor = 0.001 * Math.exp(0.05 * (ageAtYear - 30))
//         if (gender === "female") yearlyMortalityFactor *= 0.85
//         if (smoker) yearlyMortalityFactor *= 2.5

//         const yearlyRiskPremium = yearlyMortalityFactor * coverageAmount
//         const reserveBuildup = annualPremium - yearlyRiskPremium
//         const interestCredit = interestRate * (year > 1 ? (year - 1) * reserveBuildup : 0)

//         return {
//           year,
//           age: ageAtYear,
//           premium: annualPremium.toFixed(2),
//           riskCharge: yearlyRiskPremium.toFixed(2),
//           reserveContribution: reserveBuildup.toFixed(2),
//           interestCredit: interestCredit.toFixed(2),
//         }
//       })

//       results.data = {
//         premium: annualPremium.toFixed(2),
//         yearlyBreakdown,
//         premiumFactors: [
//           { name: "Base Rate", value: (0.005 * coverageAmount).toFixed(2) },
//           { name: "Age Factor", value: Math.exp(0.05 * (age - 30)).toFixed(2) },
//           { name: "Gender Factor", value: gender === "female" ? "0.85" : "1.00" },
//           { name: "Smoker Factor", value: smoker ? "2.50" : "1.00" },
//           { name: "Term Factor", value: (1 / presentValueFactor).toFixed(4) },
//         ],
//         barData: {
//           categories: ["Premium", "Death Benefit"],
//           values: [annualPremium * policyTerm, coverageAmount],
//         },
//         statistics: {
//           coverageAmount: coverageAmount.toLocaleString(),
//           annualPremium: annualPremium.toFixed(2),
//           totalPremiumPaid: (annualPremium * policyTerm).toFixed(2),
//           premiumRatio: (((annualPremium * policyTerm) / coverageAmount) * 100).toFixed(2) + "%",
//           effectiveRate: ((annualPremium / coverageAmount) * 100).toFixed(4) + "%",
//         },
//       }
//     } else {
//       // Generic mock results for other simulation types
//       results.data = {
//         message: "Simulation completed successfully",
//         summary: "This is a mock result for demonstration purposes",
//       }
//     }

//     return results
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const handleSaveResults = () => {
//     alert("Results saved successfully!")
//   }

//   const handleShareResults = () => {
//     alert("Share functionality would be implemented here")
//   }

//   const handleDownloadResults = () => {
//     alert("Download functionality would be implemented here")
//   }

//   return (
//     <div className="simulations-page">
//       <div className="simulations-header">
//         <h1>Actuarial Simulations</h1>
//         <p>Run interactive simulations to analyze risks, project outcomes, and make data-driven decisions</p>
//       </div>

//       {!activeSimulation ? (
//         <>
//           <div className="simulations-filters">
//             <div className="search-container">
//               <Search size={18} />
//               <input
//                 type="text"
//                 placeholder="Search simulations..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <div className="filter-container">
//               <Filter size={18} />
//               <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
//                 {simulationCategories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="filter-container">
//               <BarChart2 size={18} />
//               <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
//                 {simulationLevels.map((level) => (
//                   <option key={level.id} value={level.id}>
//                     {level.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="simulations-content">
//             <div className="simulations-main">
//               <h2>Available Simulations</h2>
//               <div className="simulations-grid">
//                 {filteredSimulations.length > 0 ? (
//                   filteredSimulations.map((simulation) => (
//                     <SimulationCard
//                       key={simulation.id}
//                       simulation={simulation}
//                       onSelect={() => handleSimulationSelect(simulation)}
//                     />
//                   ))
//                 ) : (
//                   <div className="no-simulations">
//                     <p>No simulations found matching your criteria.</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="simulations-sidebar">
//               <div className="recent-simulations">
//                 <h3>Recently Run Simulations</h3>
//                 {recentSimulations.length > 0 ? (
//                   <div className="recent-list">
//                     {recentSimulations.map((recent) => (
//                       <div key={recent.id} className="recent-item">
//                         <div className="recent-item-info">
//                           <h4>{recent.title}</h4>
//                           <p>
//                             <Clock size={14} />
//                             <span>{formatDate(recent.date)}</span>
//                           </p>
//                         </div>
//                         <button
//                           className="view-results-btn"
//                           onClick={() => {
//                             const sim = simulations.find((s) => s.id === recent.simulationId)
//                             if (sim) {
//                               setActiveSimulation(sim)
//                               handleRunSimulation(recent.parameters)
//                             }
//                           }}
//                         >
//                           View
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="no-recent">No recent simulations found.</p>
//                 )}
//               </div>

//               <div className="simulation-resources">
//                 <h3>Learning Resources</h3>
//                 <div className="resources-list">
//                   <a href="#" className="resource-link">
//                     <BookOpen size={16} />
//                     <span>Introduction to Monte Carlo Methods</span>
//                   </a>
//                   <a href="#" className="resource-link">
//                     <BookOpen size={16} />
//                     <span>Understanding Mortality Tables</span>
//                   </a>
//                   <a href="#" className="resource-link">
//                     <BookOpen size={16} />
//                     <span>Financial Modeling Techniques</span>
//                   </a>
//                   <a href="#" className="resource-link">
//                     <BookOpen size={16} />
//                     <span>Insurance Risk Assessment</span>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="simulation-detail">
//           <button className="back-to-simulations" onClick={handleBackToList}>
//             ← Back to Simulations
//           </button>

//           <div className="simulation-detail-header">
//             <h2>{activeSimulation.title}</h2>
//             <p className="simulation-description">{activeSimulation.description}</p>
//           </div>

//           <div className="simulation-interface-container">
//             <SimulationInterface simulation={activeSimulation} onRun={handleRunSimulation} isRunning={isRunning} />

//             {simulationResults && (
//               <div className="simulation-results">
//                 <div className="results-header">
//                   <h3>Simulation Results</h3>
//                   <div className="results-actions">
//                     <button className="save-btn" onClick={handleSaveResults}>
//                       <Save size={16} />
//                       Save
//                     </button>
//                     <button className="share-btn" onClick={handleShareResults}>
//                       <Share2 size={16} />
//                       Share
//                     </button>
//                     <button className="download-btn" onClick={handleDownloadResults}>
//                       <Download size={16} />
//                       Download
//                     </button>
//                   </div>
//                 </div>
//                 <ResultsVisualization simulation={activeSimulation} results={simulationResults} />
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Simulations





"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  BarChart2,
  Clock,
  BookOpen,
  Save,
  Share2,
  Download,
  Settings,
  Code,
  TrendingUp,
  X,
  ChevronDown,
  Plus,
  Minimize2,
} from "lucide-react"
import { useUser } from "../context/UserContext"
import CodeEditor from "../components/simulations/CodeEditor"
import SimulationSettings from "../components/simulations/SimulationSettings"
import SimulationResults from "../components/simulations/SimulationResults"
import ModelValidation from "../components/simulations/ModelValidation"
import SimulationCard from "../components/simulations/SimulationCard"
import SimulationInterface from "../components/simulations/SimulationInterface"
import ResultsVisualization from "../components/simulations/ResultsVisualization"
import "./Simulations.css"

const simulationCategories = [
  { id: "all", name: "All Simulations" },
  { id: "risk", name: "Risk Modeling" },
  { id: "life", name: "Life Insurance" },
  { id: "property", name: "Property & Casualty" },
  { id: "health", name: "Health Insurance" },
  { id: "pension", name: "Pension & Retirement" },
  { id: "financial", name: "Financial Modeling" },
]

const simulationLevels = [
  { id: "all", name: "All Levels" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
]

const Simulations = () => {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("CODE")
  const [activeSimulation, setActiveSimulation] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [simulationResults, setSimulationResults] = useState(null)
  const [validationResults, setValidationResults] = useState(null)
  const [showNewSimulation, setShowNewSimulation] = useState(false)
  const [simulations, setSimulations] = useState([])
  const [filteredSimulations, setFilteredSimulations] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [recentSimulations, setRecentSimulations] = useState([])

  useEffect(() => {
    fetchSimulations()
    fetchRecentSimulations()
  }, [])

  useEffect(() => {
    filterSimulations()
  }, [selectedCategory, selectedLevel, searchQuery, simulations])

  const fetchSimulations = async () => {
    // Simulate API call
    const mockSimulations = [
      {
        id: 1,
        title: "Monte Carlo Risk Analysis",
        category: "risk",
        level: "intermediate",
        description:
          "Run Monte Carlo simulations to analyze the distribution of potential outcomes and assess risk factors in various scenarios.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "5-10 minutes",
        popularity: 89,
        parameters: [
          {
            id: "iterations",
            name: "Number of Iterations",
            type: "number",
            min: 100,
            max: 10000,
            default: 1000,
            step: 100,
          },
          {
            id: "mean",
            name: "Mean Return",
            type: "number",
            min: -0.5,
            max: 0.5,
            default: 0.08,
            step: 0.01,
          },
          {
            id: "stdDev",
            name: "Standard Deviation",
            type: "number",
            min: 0.01,
            max: 0.5,
            default: 0.15,
            step: 0.01,
          },
          {
            id: "years",
            name: "Time Horizon (Years)",
            type: "number",
            min: 1,
            max: 50,
            default: 10,
            step: 1,
          },
          {
            id: "initialInvestment",
            name: "Initial Investment",
            type: "number",
            min: 1000,
            max: 1000000,
            default: 100000,
            step: 1000,
          },
        ],
        resultTypes: ["histogram", "line", "statistics"],
        language: "python",
        status: "active",
      },
      {
        id: 2,
        title: "Life Insurance Premium Calculator",
        category: "life",
        level: "beginner",
        description:
          "Calculate life insurance premiums based on mortality tables, interest rates, and policy characteristics.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "2-5 minutes",
        popularity: 95,
        parameters: [
          {
            id: "age",
            name: "Age",
            type: "number",
            min: 18,
            max: 80,
            default: 35,
            step: 1,
          },
          {
            id: "gender",
            name: "Gender",
            type: "select",
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ],
            default: "male",
          },
          {
            id: "smoker",
            name: "Smoker",
            type: "boolean",
            default: false,
          },
          {
            id: "coverageAmount",
            name: "Coverage Amount",
            type: "number",
            min: 10000,
            max: 10000000,
            default: 500000,
            step: 10000,
          },
          {
            id: "policyTerm",
            name: "Policy Term (Years)",
            type: "number",
            min: 5,
            max: 30,
            default: 20,
            step: 5,
          },
          {
            id: "interestRate",
            name: "Interest Rate",
            type: "number",
            min: 0.01,
            max: 0.1,
            default: 0.03,
            step: 0.005,
          },
        ],
        resultTypes: ["table", "bar", "statistics"],
        language: "r",
        status: "completed",
      },
      {
        id: 3,
        title: "Property Insurance Loss Simulation",
        category: "property",
        level: "advanced",
        description:
          "Simulate property insurance losses using probability distributions for frequency and severity to analyze risk exposure.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "10-15 minutes",
        popularity: 82,
        parameters: [
          {
            id: "policies",
            name: "Number of Policies",
            type: "number",
            min: 100,
            max: 100000,
            default: 10000,
            step: 1000,
          },
          {
            id: "years",
            name: "Simulation Years",
            type: "number",
            min: 1,
            max: 30,
            default: 5,
            step: 1,
          },
          {
            id: "frequencyDist",
            name: "Frequency Distribution",
            type: "select",
            options: [
              { value: "poisson", label: "Poisson" },
              { value: "negbinomial", label: "Negative Binomial" },
            ],
            default: "poisson",
          },
          {
            id: "freqParam",
            name: "Frequency Parameter (λ)",
            type: "number",
            min: 0.01,
            max: 1,
            default: 0.05,
            step: 0.01,
          },
          {
            id: "severityDist",
            name: "Severity Distribution",
            type: "select",
            options: [
              { value: "lognormal", label: "Lognormal" },
              { value: "gamma", label: "Gamma" },
              { value: "pareto", label: "Pareto" },
            ],
            default: "lognormal",
          },
          {
            id: "sevMean",
            name: "Severity Mean",
            type: "number",
            min: 1000,
            max: 100000,
            default: 10000,
            step: 1000,
          },
          {
            id: "sevStdDev",
            name: "Severity Std Dev",
            type: "number",
            min: 1000,
            max: 100000,
            default: 5000,
            step: 1000,
          },
        ],
        resultTypes: ["histogram", "table", "scatter", "statistics"],
        language: "fel",
        status: "failed",
      },
      {
        id: 4,
        title: "Pension Fund Valuation",
        category: "pension",
        level: "intermediate",
        description:
          "Value pension funds and project future liabilities based on demographic and economic assumptions.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "5-10 minutes",
        popularity: 78,
        parameters: [
          {
            id: "employees",
            name: "Number of Employees",
            type: "number",
            min: 10,
            max: 10000,
            default: 1000,
            step: 10,
          },
          {
            id: "avgAge",
            name: "Average Employee Age",
            type: "number",
            min: 25,
            max: 55,
            default: 40,
            step: 1,
          },
          {
            id: "retirementAge",
            name: "Retirement Age",
            type: "number",
            min: 55,
            max: 70,
            default: 65,
            step: 1,
          },
          {
            id: "discountRate",
            name: "Discount Rate",
            type: "number",
            min: 0.01,
            max: 0.1,
            default: 0.04,
            step: 0.005,
          },
          {
            id: "salaryGrowth",
            name: "Annual Salary Growth",
            type: "number",
            min: 0.01,
            max: 0.1,
            default: 0.03,
            step: 0.005,
          },
          {
            id: "fundingRatio",
            name: "Current Funding Ratio",
            type: "number",
            min: 0.5,
            max: 1.5,
            default: 0.9,
            step: 0.05,
          },
        ],
        resultTypes: ["line", "area", "table", "statistics"],
        language: "python",
        status: "active",
      },
      {
        id: 5,
        title: "Health Insurance Claims Modeling",
        category: "health",
        level: "advanced",
        description:
          "Model health insurance claims using demographic data, utilization patterns, and cost trends to predict future claims expenses.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "10-15 minutes",
        popularity: 75,
        parameters: [
          {
            id: "policyholders",
            name: "Number of Policyholders",
            type: "number",
            min: 100,
            max: 100000,
            default: 5000,
            step: 100,
          },
          {
            id: "ageDistribution",
            name: "Age Distribution",
            type: "select",
            options: [
              { value: "young", label: "Young (18-35)" },
              { value: "mixed", label: "Mixed (18-65)" },
              { value: "senior", label: "Senior (50-80)" },
            ],
            default: "mixed",
          },
          {
            id: "claimFrequency",
            name: "Annual Claim Frequency",
            type: "number",
            min: 0.5,
            max: 10,
            default: 3,
            step: 0.5,
          },
          {
            id: "avgClaimAmount",
            name: "Average Claim Amount",
            type: "number",
            min: 100,
            max: 10000,
            default: 1500,
            step: 100,
          },
          {
            id: "inflationRate",
            name: "Medical Inflation Rate",
            type: "number",
            min: 0.01,
            max: 0.15,
            default: 0.06,
            step: 0.01,
          },
          {
            id: "simulationYears",
            name: "Projection Years",
            type: "number",
            min: 1,
            max: 10,
            default: 5,
            step: 1,
          },
        ],
        resultTypes: ["line", "bar", "heatmap", "statistics"],
        language: "r",
        status: "completed",
      },
      {
        id: 6,
        title: "Financial Asset Pricing",
        category: "financial",
        level: "beginner",
        description:
          "Apply financial models to price assets including stocks, bonds, and derivatives using modern pricing theories.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "5-10 minutes",
        popularity: 85,
        parameters: [
          {
            id: "assetType",
            name: "Asset Type",
            type: "select",
            options: [
              { value: "stock", label: "Stock" },
              { value: "bond", label: "Bond" },
              { value: "option", label: "Option" },
            ],
            default: "stock",
          },
          {
            id: "currentPrice",
            name: "Current Price",
            type: "number",
            min: 1,
            max: 1000,
            default: 100,
            step: 1,
          },
          {
            id: "volatility",
            name: "Volatility",
            type: "number",
            min: 0.05,
            max: 0.5,
            default: 0.2,
            step: 0.01,
          },
          {
            id: "riskFreeRate",
            name: "Risk-Free Rate",
            type: "number",
            min: 0.01,
            max: 0.1,
            default: 0.03,
            step: 0.005,
          },
          {
            id: "timeHorizon",
            name: "Time Horizon (Years)",
            type: "number",
            min: 0.1,
            max: 10,
            default: 1,
            step: 0.1,
          },
        ],
        resultTypes: ["line", "statistics", "table"],
        language: "fel",
        status: "failed",
      },
    ]

    setSimulations(mockSimulations)
    setFilteredSimulations(mockSimulations)
  }

  const fetchRecentSimulations = async () => {
    // Simulate API call
    const mockRecentSimulations = [
      {
        id: 1,
        simulationId: 1,
        title: "Monte Carlo Risk Analysis",
        date: "2024-01-12T10:30:00Z",
        parameters: {
          iterations: 5000,
          mean: 0.07,
          stdDev: 0.18,
          years: 15,
          initialInvestment: 150000,
        },
      },
      {
        id: 2,
        simulationId: 4,
        title: "Pension Fund Valuation",
        date: "2024-01-10T14:45:00Z",
        parameters: {
          employees: 2500,
          avgAge: 42,
          retirementAge: 67,
          discountRate: 0.035,
          salaryGrowth: 0.025,
          fundingRatio: 0.85,
        },
      },
      {
        id: 3,
        simulationId: 2,
        title: "Life Insurance Premium Calculator",
        date: "2024-01-08T09:15:00Z",
        parameters: {
          age: 40,
          gender: "female",
          smoker: false,
          coverageAmount: 750000,
          policyTerm: 25,
          interestRate: 0.035,
        },
      },
    ]

    setRecentSimulations(mockRecentSimulations)
  }

  const filterSimulations = () => {
    let filtered = simulations

    if (selectedCategory !== "all") {
      filtered = filtered.filter((simulation) => simulation.category === selectedCategory)
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((simulation) => simulation.level === selectedLevel)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (simulation) =>
          simulation.title.toLowerCase().includes(query) || simulation.description.toLowerCase().includes(query),
      )
    }

    setFilteredSimulations(filtered)
  }

  const handleSimulationSelect = (simulation) => {
    setActiveSimulation(simulation)
    setSimulationResults(null)
    setValidationResults(null)
    setActiveTab("CODE")
  }

  const handleBackToList = () => {
    setActiveSimulation(null)
    setSimulationResults(null)
    setValidationResults(null)
    setActiveTab("CODE")
  }

  const handleRunSimulation = (parameters) => {
    setIsRunning(true)
    setProgress(0)
    setActiveTab("RESULTS")

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          generateMockResults(parameters)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  const generateMockResults = (parameters) => {
    const mockResults = {
      chartData: {
        pnl: Array.from({ length: 100 }, (_, i) => ({
          date: new Date(2019, 0, 1 + i * 10).toISOString(),
          value: Math.random() * 1000000 - 250000 + i * 5000,
        })),
        performance: {
          sharpe: 0.28,
          turnover: 7.81,
          fitness: 0.08,
          returns: 1.1,
          drawdown: 9.24,
          margin: 2.82,
        },
      },
      validation: {
        passed: [
          "Turnover of 7.59% is above cutoff of 1%",
          "Turnover of 7.59% is below cutoff of 70%",
          "Weight is well distributed over instruments",
          "These competitions match: Challenge, International Quant Championship 2025 Stage 2",
        ],
        failed: [
          "Sharpe of -0.10 is below cutoff of 1.25",
          "Fitness of -0.02 is below cutoff of 1",
          "Sub-universe Sharpe of -0.62 is below cutoff of -0.04",
        ],
        pending: ["Performance validation in progress"],
      },
    }

    setSimulationResults(mockResults)
    setValidationResults(mockResults.validation)
  }

  const handleCreateNewSimulation = () => {
    const newId = Math.max(...simulations.map((s) => s.id)) + 1
    const newSim = {
      id: newId,
      title: `Simulation ${newId}`,
      category: "actuarial",
      level: "beginner",
      description: "New simulation description",
      image: "/placeholder.svg?height=150&width=250",
      duration: "5-10 minutes",
      popularity: 85,
      parameters: [],
      resultTypes: [],
      language: "python",
      status: "active",
    }
    setSimulations([...simulations, newSim])
    setActiveSimulation(newSim)
    setShowNewSimulation(false)
    setActiveTab("CODE")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSaveResults = () => {
    alert("Results saved successfully!")
  }

  const handleShareResults = () => {
    alert("Share functionality would be implemented here")
  }

  const handleDownloadResults = () => {
    alert("Download functionality would be implemented here")
  }

  return (
    <div className="nexus-simulations">
      {/* Header */}
      <div className="simulation-header">
        <div className="simulation-tabs">
          <div className="simulation-info">
            <div className="alpha-icon">α</div>
            <span className="simulation-name">{activeSimulation ? activeSimulation.title : "Select a Simulation"}</span>
            {activeSimulation && <div className={`status-indicator ${activeSimulation.status}`}></div>}
            <button className="close-simulation" onClick={handleBackToList}>
              <X size={16} />
            </button>
            <button className="minimize-simulation">
              <Minimize2 size={16} />
            </button>
            <button className="dropdown-simulation">
              <ChevronDown size={16} />
            </button>
            <button className="new-simulation" onClick={() => setShowNewSimulation(true)}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="main-tabs">
          <button className={`tab-button ${activeTab === "CODE" ? "active" : ""}`} onClick={() => setActiveTab("CODE")}>
            <Code size={16} />
            CODE
          </button>
          <button
            className={`tab-button ${activeTab === "RESULTS" ? "active" : ""}`}
            onClick={() => setActiveTab("RESULTS")}
          >
            <TrendingUp size={16} />
            RESULTS
          </button>
          <button
            className={`tab-button ${activeTab === "SETTINGS" ? "active" : ""}`}
            onClick={() => setActiveTab("SETTINGS")}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="simulation-content">
        {activeTab === "CODE" && (
          <CodeEditor simulation={activeSimulation} onRun={handleRunSimulation} isRunning={isRunning} />
        )}

        {activeTab === "RESULTS" && (
          <SimulationResults
            results={simulationResults}
            validation={validationResults}
            isRunning={isRunning}
            progress={progress}
          />
        )}

        {activeTab === "SETTINGS" && (
          <SimulationSettings simulation={activeSimulation} onUpdate={setActiveSimulation} />
        )}

        {!activeSimulation ? (
          <>
            <div className="simulations-filters-sm">
              <div className="search-container">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search simulations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-container">
                <Filter size={18} />
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  {simulationCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-container">
                <BarChart2 size={18} />
                <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                  {simulationLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="simulations-content">
              <div className="simulations-main">
                <h2>Available Simulations</h2>
                <div className="simulations-grid">
                  {filteredSimulations.length > 0 ? (
                    filteredSimulations.map((simulation) => (
                      <SimulationCard
                        key={simulation.id}
                        simulation={simulation}
                        onSelect={() => handleSimulationSelect(simulation)}
                      />
                    ))
                  ) : (
                    <div className="no-simulations">
                      <p>No simulations found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="simulations-sidebar">
                <div className="recent-simulations">
                  <h3>Recently Run Simulations</h3>
                  {recentSimulations.length > 0 ? (
                    <div className="recent-list">
                      {recentSimulations.map((recent) => (
                        <div key={recent.id} className="recent-item">
                          <div className="recent-item-info">
                            <h4>{recent.title}</h4>
                            <p>
                              <Clock size={14} />
                              <span>{formatDate(recent.date)}</span>
                            </p>
                          </div>
                          <button
                            className="view-results-btn"
                            onClick={() => {
                              const sim = simulations.find((s) => s.id === recent.simulationId)
                              if (sim) {
                                setActiveSimulation(sim)
                                handleRunSimulation(recent.parameters)
                              }
                            }}
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-recent">No recent simulations found.</p>
                  )}
                </div>

                <div className="simulation-resources">
                  <h3>Learning Resources</h3>
                  <div className="resources-list">
                    <a href="#" className="resource-link">
                      <BookOpen size={16} />
                      <span>Introduction to Monte Carlo Methods</span>
                    </a>
                    <a href="#" className="resource-link">
                      <BookOpen size={16} />
                      <span>Understanding Mortality Tables</span>
                    </a>
                    <a href="#" className="resource-link">
                      <BookOpen size={16} />
                      <span>Financial Modeling Techniques</span>
                    </a>
                    <a href="#" className="resource-link">
                      <BookOpen size={16} />
                      <span>Insurance Risk Assessment</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="simulation-detail">
            <button className="back-to-simulations" onClick={handleBackToList}>
              ← Back to Simulations
            </button>

            <div className="simulation-detail-header">
              <h2>{activeSimulation.title}</h2>
              <p className="simulation-description">{activeSimulation.description}</p>
            </div>

            <div className="simulation-interface-container">
              {activeSimulation && (
                <SimulationInterface simulation={activeSimulation} onRun={handleRunSimulation} isRunning={isRunning} />
              )}

              {simulationResults && (
                <div className="simulation-results">
                  <div className="results-header">
                    <h3>Simulation Results</h3>
                    <div className="results-actions">
                      <button className="save-btn" onClick={handleSaveResults}>
                        <Save size={16} />
                        Save
                      </button>
                      <button className="share-btn" onClick={handleShareResults}>
                        <Share2 size={16} />
                        Share
                      </button>
                      <button className="download-btn" onClick={handleDownloadResults}>
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                  <ResultsVisualization simulation={activeSimulation} results={simulationResults} />
                  <ModelValidation validation={validationResults} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Simulation Modal */}
      {showNewSimulation && (
        <div className="modal-overlay">
          <div className="new-simulation-modal">
            <h3>Create New Simulation</h3>
            <div className="modal-content">
              <div className="form-group">
                <label>Simulation Name</label>
                <input type="text" placeholder="Enter simulation name" />
              </div>
              <div className="form-group">
                <label>Language</label>
                <select>
                  <option value="python">Python</option>
                  <option value="r">R</option>
                  <option value="fel">Fast Expression Language</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select>
                  <option value="actuarial">Actuarial Models</option>
                  <option value="financial">Financial Models</option>
                  <option value="risk">Risk Models</option>
                  <option value="ml">Machine Learning</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowNewSimulation(false)}>
                Cancel
              </button>
              <button className="create-btn" onClick={handleCreateNewSimulation}>
                Create Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Simulations

