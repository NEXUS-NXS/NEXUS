"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  User,
  Calendar,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  CheckCircle2,
  Circle,
  Code,
  FileText,
  Download,
  Share2,
  BookOpen,
} from "lucide-react"

interface PageProps {
  params: {
    tutorialId: string
  }
}

export default function TutorialDetailPageClient({ params }: PageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const tutorial = tutorials.find((t) => t.id === params.tutorialId)

  if (!tutorial) {
    notFound()
  }

  const progress = (completedSteps.length / tutorial.steps.length) * 100

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
    }
  }

  const nextStep = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = tutorial.steps[currentStep]

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
              Documentation
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
              Tutorials
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{tutorial.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Resources
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{tutorial.title}</CardTitle>
                    <CardDescription className="mt-2">{tutorial.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      tutorial.difficulty === "Beginner"
                        ? "default"
                        : tutorial.difficulty === "Intermediate"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {tutorial.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{tutorial.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{tutorial.lastUpdated}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tutorial" className="w-full">
                  <TabsList>
                    <TabsTrigger value="tutorial">Interactive Tutorial</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tutorial" className="mt-6">
                    <div className="flex flex-col gap-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>
                              Step {currentStep + 1}: {currentStepData.title}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" onClick={prevStep} disabled={currentStep === 0}>
                                <SkipBack className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={nextStep}
                                disabled={currentStep === tutorial.steps.length - 1}
                              >
                                <SkipForward className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription>{currentStepData.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-6">
                            <div className="prose max-w-none">
                              <div dangerouslySetInnerHTML={{ __html: currentStepData.content }} />
                            </div>

                            {currentStepData.code && (
                              <div>
                                <h4 className="font-medium mb-2">Code Example</h4>
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                                  <code>{currentStepData.code}</code>
                                </pre>
                              </div>
                            )}

                            {currentStepData.exercise && (
                              <Card className="bg-blue-50 border-blue-200">
                                <CardHeader>
                                  <CardTitle className="text-lg text-blue-800">Interactive Exercise</CardTitle>
                                  <CardDescription className="text-blue-700">
                                    {currentStepData.exercise.description}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="bg-white p-4 rounded-md border">
                                    <p className="text-sm text-muted-foreground mb-2">Try it yourself:</p>
                                    <textarea
                                      className="w-full h-32 p-3 font-mono text-sm border rounded-md"
                                      placeholder={currentStepData.exercise.placeholder}
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                      <Button variant="outline" size="sm">
                                        <Code className="mr-2 h-4 w-4" />
                                        Run Code
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        Show Solution
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            <div className="flex items-center justify-between">
                              <Button
                                variant="outline"
                                onClick={() => markStepComplete(currentStep)}
                                disabled={completedSteps.includes(currentStep)}
                              >
                                {completedSteps.includes(currentStep) ? (
                                  <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Completed
                                  </>
                                ) : (
                                  <>
                                    <Circle className="mr-2 h-4 w-4" />
                                    Mark Complete
                                  </>
                                )}
                              </Button>
                              {currentStep < tutorial.steps.length - 1 ? (
                                <Button onClick={nextStep}>
                                  Next Step
                                  <SkipForward className="ml-2 h-4 w-4" />
                                </Button>
                              ) : (
                                <Button>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Complete Tutorial
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="overview" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tutorial Overview</CardTitle>
                        <CardDescription>What you'll learn in this tutorial</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <h3>Learning Objectives</h3>
                          <ul>
                            {tutorial.learningObjectives.map((objective, i) => (
                              <li key={i}>{objective}</li>
                            ))}
                          </ul>

                          <h3>Prerequisites</h3>
                          <ul>
                            {tutorial.prerequisites.map((prereq, i) => (
                              <li key={i}>{prereq}</li>
                            ))}
                          </ul>

                          <h3>Tutorial Steps</h3>
                          <div className="space-y-2">
                            {tutorial.steps.map((step, i) => (
                              <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                                {completedSteps.includes(i) ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className={`text-sm ${currentStep === i ? "font-medium text-primary" : ""}`}>
                                  {i + 1}. {step.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resources" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Resources</CardTitle>
                        <CardDescription>Supplementary materials and further reading</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {tutorial.resources.map((resource, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <div>
                                  <p className="font-medium">{resource.title}</p>
                                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tutorial Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span>{tutorial.duration}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                      <span>{tutorial.difficulty}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Steps</span>
                      <span>{tutorial.steps.length} interactive steps</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span>{tutorial.lastUpdated}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Author</span>
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={tutorial.author} />
                          <AvatarFallback>{tutorial.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{tutorial.author}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed Steps</span>
                      <span className="text-sm font-medium">
                        {completedSteps.length}/{tutorial.steps.length}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Step {currentStep + 1} of {tutorial.steps.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Related Tutorials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {tutorial.relatedTutorials.map((related) => (
                      <Link key={related.id} href={`/docs/tutorials/${related.id}`} className="text-sm hover:underline">
                        {related.title}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  author: string
  lastUpdated: string
  learningObjectives: string[]
  prerequisites: string[]
  steps: {
    title: string
    description: string
    content: string
    code?: string
    exercise?: {
      description: string
      placeholder: string
      solution: string
    }
  }[]
  resources: {
    title: string
    description: string
    type: string
    url: string
  }[]
  relatedTutorials: {
    id: string
    title: string
  }[]
}

const tutorials: Tutorial[] = [

    {
        id: "1",
        title: "Building Your First Monte Carlo Simulation",
        description: "Learn to create Monte Carlo simulations for actuarial modeling with hands-on Python exercises",
        difficulty: "Intermediate",
        duration: "45 minutes",
        author: "Dr. Michael Rodriguez",
        lastUpdated: "June 10, 2023",
        learningObjectives: [
        "Understand the principles of Monte Carlo simulation",
        "Implement basic random sampling techniques",
        "Build a complete actuarial simulation model",
        "Analyze and interpret simulation results",
        "Apply Monte Carlo methods to real-world problems"
        ],
        prerequisites: [
        "Basic Python programming knowledge",
        "Understanding of probability and statistics",
        "Familiarity with actuarial concepts",
        "Basic knowledge of NumPy and Pandas"
        ],
        steps: [
            {
                title: "Introduction to Monte Carlo Methods",
                description: "Learn the fundamental concepts behind Monte Carlo simulation",
                content: `
                <p>Monte Carlo simulation is a powerful computational technique that uses random sampling to solve complex mathematical problems. In actuarial science, we use it to model uncertainty and risk in insurance and financial systems.</p>

                <h4>Key Concepts:</h4>
                <ul>
                    <li>Random sampling from probability distributions</li>
                    <li>Law of Large Numbers</li>
                    <li>Convergence and accuracy</li>
                    <li>Variance reduction techniques</li>
                </ul>
                `,
                code: `import numpy as np
            import matplotlib.pyplot as plt

            # Simple example: Estimating Pi using Monte Carlo
            def estimate_pi(n_samples):
                # Generate random points in unit square
                x = np.random.uniform(-1, 1, n_samples)
                y = np.random.uniform(-1, 1, n_samples)

                # Count points inside unit circle
                inside_circle = (x**2 + y**2) <= 1
                pi_estimate = 4 * np.sum(inside_circle) / n_samples

                return pi_estimate

            # Run simulation
            pi_est = estimate_pi(100000)
            print(f"Estimated Pi: \${pi_est:.4f}")
            print(f"Actual Pi: \${np.pi:.4f}")
            print(f"Error: \${abs(pi_est - np.pi):.4f}")`
        },

        {
        title: "Setting Up Random Variables",
        description: "Create and sample from probability distributions",
        content: `
            <p>In actuarial modeling, we need to simulate various random variables such as claim amounts, mortality rates, and interest rates. Python's NumPy library provides excellent tools for this.</p>

            <h4>Common Distributions in Actuarial Work:</h4>
            <ul>
            <li>Normal distribution for interest rates</li>
            <li>Exponential distribution for claim interarrival times</li>
            <li>Lognormal distribution for claim amounts</li>
            <li>Binomial distribution for mortality events</li>
            </ul>
        `,
        code: `import numpy as np
        from scipy import stats

        # Set random seed for reproducibility
        np.random.seed(42)

        # Generate claim amounts (lognormal distribution)
        mu_log = 8.0  # log-scale mean
        sigma_log = 1.5  # log-scale standard deviation
        n_claims = 1000

        claim_amounts = np.random.lognormal(mu_log, sigma_log, n_claims)

        # Generate claim frequencies (Poisson distribution)
        lambda_freq = 50  # expected number of claims per year
        n_years = 10

        claim_frequencies = np.random.poisson(lambda_freq, n_years)

        print(f"Average claim amount: \${np.mean(claim_amounts):.2f}")
        print(f"Average claims per year: \${np.mean(claim_frequencies):.1f}")
        `,
        exercise: {
            description: "Create your own random variables for an insurance portfolio",
            placeholder: "# Generate 1000 policy values using a normal distribution\n# with mean $100,000 and standard deviation $25,000\n\npolicy_values = ",
            solution: "policy_values = np.random.normal(100000, 25000, 1000)"
        }
        },
        {
            title: "Building the Simulation Loop",
            description: "Construct the main simulation engine",
            content: `
            <p>The core of any Monte Carlo simulation is the simulation loop. This is where we repeatedly sample from our random variables and calculate the outcomes we're interested in.</p>
            
            <h4>Simulation Structure:</h4>
            <ol>
                <li>Initialize parameters and containers</li>
                <li>Loop through simulation scenarios</li>
                <li>Generate random variables for each scenario</li>
                <li>Calculate outcomes</li>
                <li>Store results</li>
            </ol>
            `,
            code: `import numpy as np

        def insurance_portfolio_simulation(n_simulations=10000):
            """
            Simulate an insurance portfolio over one year
            """
            # Portfolio parameters
            n_policies = 1000
            premium_per_policy = 1200
            claim_probability = 0.05
            avg_claim_amount = 15000
            claim_std = 5000
            
            # Storage for results
            annual_profits = []
            
            for sim in range(n_simulations):
                # Calculate premiums collected
                total_premiums = n_policies * premium_per_policy
                
                # Simulate claims
                claims_occurred = np.random.binomial(n_policies, claim_probability)
                
                if claims_occurred > 0:
                    claim_amounts = np.random.normal(avg_claim_amount, claim_std, claims_occurred)
                    # Ensure no negative claims
                    claim_amounts = np.maximum(claim_amounts, 0)
                    total_claims = np.sum(claim_amounts)
                else:
                    total_claims = 0
                
                # Calculate profit
                profit = total_premiums - total_claims
                annual_profits.append(profit)
            
            return np.array(annual_profits)

        # Run simulation
        profits = insurance_portfolio_simulation()
        print(f"Expected annual profit: \${np.mean(profits):.2f}")
        print(f"Profit standard deviation: \${np.std(profits):.2f}")`,
                exercise: {
                description: "Modify the simulation to include expense ratio of 30%",
                placeholder: "# Add expenses to the profit calculation\n# Expenses = 30% of total premiums\n\nexpenses = \nprofit = total_premiums - total_claims - expenses",
                solution: "expenses = 0.30 * total_premiums\nprofit = total_premiums - total_claims - expenses"
                }
        },
        {
            title: "Analyzing Results",
            description: "Extract insights from your simulation results",
            content: `
            <p>Once we have our simulation results, we need to analyze them to extract meaningful insights. This includes calculating key statistics, confidence intervals, and risk measures.</p>
            
            <h4>Key Metrics to Calculate:</h4>
            <ul>
                <li>Mean and standard deviation</li>
                <li>Percentiles and Value at Risk (VaR)</li>
                <li>Probability of loss</li>
                <li>Expected shortfall</li>
            </ul>
            `,
            code: `import numpy as np
    import matplotlib.pyplot as plt

    def analyze_simulation_results(results):
        """
        Comprehensive analysis of simulation results
        """
        # Basic statistics
        mean_result = np.mean(results)
        std_result = np.std(results)
        
        # Percentiles
        percentiles = [1, 5, 10, 25, 50, 75, 90, 95, 99]
        pct_values = np.percentile(results, percentiles)
        
        # Risk measures
        var_95 = np.percentile(results, 5)  # 5th percentile for 95% VaR
        prob_loss = np.mean(results < 0) * 100
        
        # Expected shortfall (average of worst 5% outcomes)
        worst_5_percent = results[results <= var_95]
        expected_shortfall = np.mean(worst_5_percent) if len(worst_5_percent) > 0 else 0
        
        print("=== SIMULATION RESULTS ANALYSIS ===")
        print(f"Mean: \${mean_result:.2f}")
        print(f"Standard Deviation: \${std_result:.2f}")
        print(f"Probability of Loss: {prob_loss:.2f}%")
        print(f"95% VaR: \${var_95:.2f}")
        print(f"Expected Shortfall: \${expected_shortfall:.2f}")
        print()
        print("Percentiles:")
        for p, v in zip(percentiles, pct_values):
            print(f"  {p}th: \${v:.2f}")
        
        return {
            'mean': mean_result,
            'std': std_result,
            'var_95': var_95,
            'prob_loss': prob_loss,
            'expected_shortfall': expected_shortfall
        }

        # Analyze our insurance portfolio results
        analysis = analyze_simulation_results(profits)

        # Create visualization
        plt.figure(figsize=(12, 8))

        plt.subplot(2, 2, 1)
        plt.hist(profits, bins=50, alpha=0.7, edgecolor='black')
        plt.axvline(np.mean(profits), color='red', linestyle='--', label='Mean')
        plt.axvline(analysis['var_95'], color='orange', linestyle='--', label='95% VaR')
        plt.xlabel('Annual Profit ($)')
        plt.ylabel('Frequency')
        plt.title('Distribution of Annual Profits')
        plt.legend()

        plt.subplot(2, 2, 2)
        plt.boxplot(profits)
        plt.ylabel('Annual Profit ($)')
        plt.title('Profit Distribution (Box Plot)')

        plt.tight_layout()
        plt.show()`,
                exercise: {
                description: "Calculate the 99% Tail Value at Risk (TVaR) for the portfolio",
                placeholder: "# Calculate 99% TVaR (average of worst 1% outcomes)\nvar_99 = np.percentile(profits, 1)\nworst_1_percent = profits[profits <= var_99]\ntvar_99 = ",
                solution: "var_99 = np.percentile(profits, 1)\nworst_1_percent = profits[profits <= var_99]\ntvar_99 = np.mean(worst_1_percent)"
                }
            },
        {
            title: "Advanced Techniques",
            description: "Improve simulation efficiency and accuracy",
            content: `
            <p>As your simulations become more complex, you'll need advanced techniques to improve efficiency and accuracy. Here we'll cover variance reduction methods and convergence testing.</p>
            
            <h4>Variance Reduction Techniques:</h4>
            <ul>
                <li>Antithetic variates</li>
                <li>Control variates</li>
                <li>Importance sampling</li>
                <li>Stratified sampling</li>
            </ul>
            `,
            code: `import numpy as np
    import matplotlib.pyplot as plt

    def enhanced_simulation_with_variance_reduction(n_simulations=10000):
        """
        Simulation with antithetic variates for variance reduction
        """
        # Use half the simulations for original, half for antithetic
        n_half = n_simulations // 2
        
        # Portfolio parameters
        n_policies = 1000
        premium_per_policy = 1200
        claim_probability = 0.05
        
        profits = []
        
        for sim in range(n_half):
            # Generate uniform random numbers
            u1 = np.random.uniform(0, 1)
            u2 = np.random.uniform(0, 1, n_policies)
            
            # Original simulation
            claims_occurred_1 = np.sum(u2 < claim_probability)
            profit_1 = calculate_profit(claims_occurred_1, u1)
            profits.append(profit_1)
            
            # Antithetic simulation (1-u2 values)
            claims_occurred_2 = np.sum((1-u2) < claim_probability)
            profit_2 = calculate_profit(claims_occurred_2, 1-u1)
            profits.append(profit_2)
        
        return np.array(profits)

    def calculate_profit(claims_occurred, random_severity):
        """Helper function to calculate profit"""
        total_premiums = 1000 * 1200
        
        if claims_occurred > 0:
            # Use random_severity to determine claim amounts
            base_claim = 15000
            claim_multiplier = 0.5 + random_severity  # Between 0.5 and 1.5
            total_claims = claims_occurred * base_claim * claim_multiplier
        else:
            total_claims = 0
        
        return total_premiums - total_claims - 0.30 * total_premiums

    # Test convergence
    def test_convergence():
        """Test how the estimate converges as we increase sample size"""
        sample_sizes = [100, 500, 1000, 5000, 10000, 50000]
        means = []
        stds = []
        
        for n in sample_sizes:
            profits = insurance_portfolio_simulation(n)
            means.append(np.mean(profits))
            stds.append(np.std(profits))
        
        plt.figure(figsize=(12, 5))
        
        plt.subplot(1, 2, 1)
        plt.plot(sample_sizes, means, 'b-o')
        plt.xlabel('Sample Size')
        plt.ylabel('Mean Profit')
        plt.title('Convergence of Mean')
        plt.grid(True)
        
        plt.subplot(1, 2, 2)
        plt.plot(sample_sizes, stds, 'r-o')
        plt.xlabel('Sample Size')
        plt.ylabel('Standard Deviation')
        plt.title('Convergence of Standard Deviation')
        plt.grid(True)
        
        plt.tight_layout()
        plt.show()

    test_convergence()`
        }
        ],
        resources: [
        {
            title: "Monte Carlo Methods in Finance",
            description: "Comprehensive reference book on Monte Carlo applications",
            type: "PDF",
            url: "/resources/monte-carlo-finance.pdf"
        },
        {
            title: "Python Code Templates",
            description: "Ready-to-use Python templates for common simulations",
            type: "ZIP",
            url: "/resources/simulation-templates.zip"
        },
        {
            title: "Statistical Tables",
            description: "Reference tables for probability distributions",
            type: "Excel",
            url: "/resources/statistical-tables.xlsx"
        }
        ],
        relatedTutorials: [
        {
            id: "2",
            title: "Advanced Stochastic Modeling"
        },
        {
            id: "3",
            title: "Risk Measurement Techniques"
        },
        {
            id: "4",
            title: "Scenario Generation Methods"
        }
        ]
    }

]

        
        
        
        
        
    