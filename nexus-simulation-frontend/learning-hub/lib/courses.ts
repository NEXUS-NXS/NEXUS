export interface Course {
  id: string
  title: string
  description: string
  image: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  modules: number
  students: number
  instructor: string
  category: string
}

export interface Module {
  id: string
  title: string
  description: string
  content: string
  quizzes: Quiz[]
}

export interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export const courses: Course[] = [
  {
    id: "advanced-excel",
    title: "Advanced Excel",
    description: "Master Excel with advanced formulas, pivot tables, and data analysis techniques.",
    image: "/placeholder.svg?height=400&width=600",
    level: "Intermediate",
    duration: "20 hours",
    modules: 5,
    students: 1245,
    instructor: "Sarah Johnson",
    category: "Data Analysis",
  },
  {
    id: "python-programming",
    title: "Python Programming",
    description: "Learn Python from scratch and build real-world applications.",
    image: "/placeholder.svg?height=400&width=600",
    level: "Beginner",
    duration: "30 hours",
    modules: 8,
    students: 3421,
    instructor: "Michael Chen",
    category: "Programming",
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence Fundamentals",
    description: "Understand the core concepts of AI and its applications.",
    image: "/placeholder.svg?height=400&width=600",
    level: "Intermediate",
    duration: "25 hours",
    modules: 6,
    students: 1876,
    instructor: "Dr. Alex Morgan",
    category: "AI",
  },
  {
    id: "machine-learning",
    title: "Machine Learning Essentials",
    description: "Build and deploy machine learning models with Python and scikit-learn.",
    image: "/placeholder.svg?height=400&width=600",
    level: "Intermediate",
    duration: "35 hours",
    modules: 10,
    students: 2134,
    instructor: "Dr. Emily Zhang",
    category: "AI",
  },
  {
    id: "data-science",
    title: "Data Science Bootcamp",
    description: "Comprehensive data science training covering statistics, visualization, and modeling.",
    image: "/placeholder.svg?height=400&width=600",
    level: "Advanced",
    duration: "45 hours",
    modules: 12,
    students: 1532,
    instructor: "Prof. David Wilson",
    category: "Data Science",
  },
  {
    id: "r-programming",
    title: "R Programming for Data Analysis",
    description: "Learn R programming language for statistical computing and graphics.",
    image: "/placeholder.svg?height=400&width=600",
    level: "Beginner",
    duration: "25 hours",
    modules: 7,
    students: 987,
    instructor: "Lisa Rodriguez",
    category: "Data Science",
  },
]

export const courseModules: Record<string, Module[]> = {
  "advanced-excel": [
    {
      id: "excel-1",
      title: "Excel Basics Refresher",
      description: "Review of essential Excel features and functions",
      content:
        "This module covers the fundamental aspects of Excel that you need to master before moving to advanced topics.",
      quizzes: [
        {
          id: "quiz-excel-1-1",
          question: "Which of the following is NOT a basic Excel function?",
          options: ["SUM", "AVERAGE", "COUNT", "REGRESSION"],
          correctAnswer: 3,
        },
        {
          id: "quiz-excel-1-2",
          question: "What is the shortcut to create a new workbook in Excel?",
          options: ["Ctrl+N", "Ctrl+W", "Ctrl+S", "Ctrl+O"],
          correctAnswer: 0,
        },
      ],
    },
    {
      id: "excel-2",
      title: "Advanced Formulas and Functions",
      description: "Master complex formulas and functions for data analysis",
      content:
        "Learn how to use VLOOKUP, INDEX-MATCH, SUMIFS, and other advanced functions to analyze your data effectively.",
      quizzes: [
        {
          id: "quiz-excel-2-1",
          question:
            "Which function would you use to look up a value in a table by matching on row and column criteria?",
          options: ["VLOOKUP", "HLOOKUP", "INDEX-MATCH", "SUMIF"],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: "excel-3",
      title: "Pivot Tables and Data Analysis",
      description: "Create powerful pivot tables for data summarization",
      content:
        "This module teaches you how to use pivot tables to summarize large datasets and extract meaningful insights.",
      quizzes: [
        {
          id: "quiz-excel-3-1",
          question: "What is the primary purpose of a Pivot Table?",
          options: ["To format data", "To summarize and analyze data", "To create charts", "To import external data"],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "excel-4",
      title: "Data Visualization in Excel",
      description: "Create compelling charts and dashboards",
      content: "Learn how to visualize your data using Excel's charting tools and create interactive dashboards.",
      quizzes: [
        {
          id: "quiz-excel-4-1",
          question: "Which chart type is best for showing the composition of a whole?",
          options: ["Line chart", "Bar chart", "Pie chart", "Scatter plot"],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: "excel-5",
      title: "Automation with Macros and VBA",
      description: "Automate repetitive tasks with macros and VBA",
      content: "This advanced module introduces you to recording macros and writing VBA code to automate Excel tasks.",
      quizzes: [
        {
          id: "quiz-excel-5-1",
          question: "What is the file extension for an Excel file that contains macros?",
          options: [".xlsx", ".csv", ".xlsm", ".txt"],
          correctAnswer: 2,
        },
      ],
    },
  ],
  "python-programming": [
    {
      id: "python-1",
      title: "Python Basics",
      description: "Introduction to Python syntax and basic concepts",
      content: "Learn the fundamentals of Python programming including variables, data types, and basic operations.",
      quizzes: [
        {
          id: "quiz-python-1-1",
          question: "Which of the following is not a Python data type?",
          options: ["int", "float", "char", "bool"],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: "python-2",
      title: "Control Flow",
      description: "Master conditional statements and loops",
      content: "This module covers if-else statements, for loops, while loops, and how to control program flow.",
      quizzes: [
        {
          id: "quiz-python-2-1",
          question: "What will be the output of the following code?\nfor i in range(3):\n    print(i)",
          options: ["0 1 2", "1 2 3", "0 1 2 3", "1 2"],
          correctAnswer: 0,
        },
      ],
    },
  ],
}
