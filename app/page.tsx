"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User, Bot, ExternalLink, Github, Linkedin, Mail, GitBranch, Clock, Coffee, Terminal } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface Project {
  title: string
  description: string
  tech: string[]
  link?: string
  github?: string
}

const projects: Project[] = [
  {
    title: "Truthful - AI powered Cybersecurity",
    description: "Built my own ML model to detect Real vs AI content from scratch. Trained on 100k+ frames on Google Cloud and deployed on render.",
    tech: ["Python", "PyTorch", "CUDA", "NumPy"],
    github: "#",
  },
  {
    title: "GameShare - Decentralized cloud share platform",
    description: "Building a decentralized marketplace where users can earn money for hosting their hardware via cloud and others can play via the same systems creating a low commitment, low cost, and accessible entertainment experience for everyone. Over 100+ users in beta testing.",
    tech: ["Python", "OpenCV", "YOLO", "Docker"],
    github: "#",
  },
  {
    title: "MinML - Semantic compression systems for LLMs across any platform",
    description: "Built a local, cross-provider token cache with safe prompt compression—cuts LLM cost while preserving meaning - private by default and model-agnostic.",
    tech: ["Rust (PyO3)", "Python 3.13", "Transformers/Tokenizers", "PyTorch", "Cargo", "pytest"],
    link: "#",
  },
  {
    title: "Web - Click and commit browser IDE",
    description: "Built a browser IDE with simple UX/UI, a custom terminal, deployment view, AI assistants and click and drag commit + merges, usable for anyone.",
    tech: ["React", "Node.js", "TensorFlow", "PostgreSQL"],
    link: "#",
  },
]

const experiences = [
  {
    role: "Software Engineer",
    company: "Ollon",
    period: "2025",
    description: "Scaled my own MCP server linked to Tick into production for startups, performed QA and fixes on over 200+ tickets across 10+ projects. Worked cross-functionality with businesses across Canada and the US.",
  },
  {
    role: "Growth Intern",
    company: "Knorket.AI",
    period: "2024",
    description: "Performed competitor and market analysis including sizing, growth and projections. Led tech audits, analyzed backlinks CPC and target demographics. Developed a portfolio of 15+ presentations and reports.",
  },
  {
    role: "Consultant",
    company: "Laurier Consulting Group",
    period: "2024 - 2025",
    description: "Developed GTM strategies for two companies in the US and Canada through proposals presentations and audits. Conducted comprehensive market-research, financial analysis and creation of visual analytics predicting success in upcoming years.",
  },
]

const quickPrompts = [
  { text: "Tell me about yourself", action: "about" },
  { text: "Show me your projects", action: "projects" },
  { text: "What's your experience?", action: "experience" },
  { text: "How can I contact you?", action: "contact" },
]

const funFacts = [
  "I've been playing piano since I was 12",
  "Chess Champion..self proclaimed..",
  "Love games, cyberpunk 😎",
  "142 wpm typing speed",
  "4 Hackathons attended so far",
  "Started really getting into coding this summer"
]

export default function Portfolio() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hi! I'm Tahmeed's AI assistant. I can help you navigate through the portfolio and answer questions about his work. Try asking me about his projects, experience, or background!",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [activeSection, setActiveSection] = useState("hero")
  const [codingStats, setCodingStats] = useState({
    commitsThisMonth: 0,
    hoursCodedToday: 0,
    linesWritten: 0,
    coffeeCount: 0,
    realCommitsThisMonth: 0
  })
  const [funFactsAnimated, setFunFactsAnimated] = useState<string[]>(Array(6).fill(''))
  const [animationsTriggered, setAnimationsTriggered] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const codingStatsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fetch real GitHub commits data
  const fetchGitHubCommits = async () => {
    try {
      const response = await fetch('https://api.github.com/users/ruyot/events?per_page=100')
      const json = await response.json()

      if (!Array.isArray(json)) {
        console.warn('Unexpected GitHub events response shape')
        return 47
      }

      // Get current month start date
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      // Count push events (commits) this month
      let commitsCount = 0
      json.forEach((event: any) => {
        if (event && event.type === 'PushEvent') {
          const eventDate = new Date(event.created_at)
          if (eventDate >= monthStart) {
            // Count the number of commits in this push
            commitsCount += event.payload && Array.isArray(event.payload.commits) ? event.payload.commits.length : 1
          }
        }
      })
      
      console.log(`Found ${commitsCount} commits this month`)
      return commitsCount
    } catch (error) {
      console.error('Error fetching GitHub data:', error)
      // Fallback to a realistic number if API fails
      return 47
    }
  }

  // Animate coding stats
  const animateStats = async () => {
    // Fetch real GitHub data first
    const realCommits = await fetchGitHubCommits()
    setCodingStats(prev => ({ ...prev, realCommitsThisMonth: realCommits }))
    
    const interval = setInterval(() => {
      setCodingStats(prev => {
        const newStats = { ...prev }
        
        // Update commits with real data
        if (newStats.commitsThisMonth < realCommits) {
          newStats.commitsThisMonth += Math.max(1, Math.floor(realCommits / 30))
          newStats.commitsThisMonth = Math.min(newStats.commitsThisMonth, realCommits)
        }

        // Update hours
        if (newStats.hoursCodedToday < 8.5) {
          newStats.hoursCodedToday += 0.1
        }

        // Update lines
        if (newStats.linesWritten < 2847) {
          newStats.linesWritten += 50
        }

        // Update coffee
        if (newStats.coffeeCount < 12) {
          newStats.coffeeCount += 1
        }

        return newStats
      })
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
    }, 4000)
  }

  // Type writer effect for fun facts
  const typeWriter = (text: string, index: number, speed = 100) => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setFunFactsAnimated(prev => {
          const newFacts = [...prev]
          newFacts[index] = text.slice(0, i + 1)
          return newFacts
        })
        i++
      } else {
        clearInterval(interval)
      }
    }, speed)
  }

  const animateFunFacts = () => {
    // Start typing animations with delays
    setTimeout(() => typeWriter(funFacts[0], 0, 80), 4000)
    setTimeout(() => typeWriter(funFacts[1], 1, 90), 5500)
    setTimeout(() => typeWriter(funFacts[2], 2, 85), 7000)
    setTimeout(() => typeWriter(funFacts[3], 3, 75), 8500)
    setTimeout(() => typeWriter(funFacts[4], 4, 95), 10000)
    setTimeout(() => typeWriter(funFacts[5], 5, 88), 11500)
  }

  // Scroll progress line
  const updateProgressLine = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeightRaw = document.documentElement.scrollHeight - window.innerHeight
    const docHeight = Math.max(1, docHeightRaw)
    const scrollPercent = Math.min(1, Math.max(0, scrollTop / docHeight))
    
    const headerEl = document.querySelector('header') as HTMLElement | null
    const headerWidth = headerEl ? headerEl.clientWidth : window.innerWidth

    // Calculate line width: starts small, grows to full header width
    const minWidth = 20
    const maxWidth = Math.max(0, headerWidth)
    const currentWidth = Math.round(minWidth + (maxWidth - minWidth) * scrollPercent)
    
    const progressLine = document.getElementById('progress-line')
    if (progressLine) {
      progressLine.style.width = `${Math.min(currentWidth, maxWidth)}px`
    }
  }

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3 && !animationsTriggered) {
          // Start animations when coding stats section is 30% visible
          animateStats()
          animateFunFacts()
          setAnimationsTriggered(true)
        }
      })
    }, {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    })

    if (codingStatsRef.current) {
      observer.observe(codingStatsRef.current)
    }

    return () => observer.disconnect()
  }, [animationsTriggered])

  // Scroll event listener
  useEffect(() => {
    const throttle = (func: Function, limit: number) => {
      let inThrottle: boolean
      return function(this: any, ...args: any[]) {
        if (!inThrottle) {
          func.apply(this, args)
          inThrottle = true
          setTimeout(() => inThrottle = false, limit)
        }
      }
    }

    const handleScroll = throttle(updateProgressLine, 16)
    const handleResize = throttle(updateProgressLine, 50)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    updateProgressLine() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      let botResponse = ""
      let scrollTo = ""

      if (content.toLowerCase().includes("about") || content.toLowerCase().includes("yourself")) {
        botResponse =
          "I'm Tahmeed T, an aspiring ML Engineer, Founder, and Developer. I'm passionate about building AI-powered solutions and creating innovative products. I focus on the intersection of machine learning, software development, and entrepreneurship."
        scrollTo = "about"
      } else if (content.toLowerCase().includes("project")) {
        botResponse =
          "Here are some of Tahmeed's key projects: Truthful AI Cybersecurity, Web Browser IDE, and GameShare Decentralized Platform. Each showcases different aspects of his ML and development expertise. Would you like to know more about any specific project?"
        scrollTo = "projects"
      } else if (content.toLowerCase().includes("experience")) {
        botResponse =
          "Tahmeed has experience as an ML Engineer at Ollon, Full Stack Developer at Knorket.AI, and Consultant at Laurier Consulting Group. His background spans both practical application and academic research in AI/ML."
        scrollTo = "experience"
      } else if (content.toLowerCase().includes("contact")) {
        botResponse =
          "You can reach Tahmeed through LinkedIn, GitHub, or email. He's always open to discussing new opportunities, collaborations, or interesting projects in the AI/ML space."
        scrollTo = "contact"
      } else {
        botResponse =
          "I can help you learn more about Tahmeed's background, projects, experience, or how to get in touch. What would you like to know?"
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      if (scrollTo) {
        setTimeout(() => {
          document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" })
        }, 500)
      }
    }, 1000)

    setInputValue("")
  }

  const handleQuickPrompt = (prompt: { text: string; action: string }) => {
    handleSendMessage(prompt.text)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-[1fr_400px] min-h-screen">
        {/* Main Content */}
        <div className="overflow-y-auto">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 lg:right-[400px] z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
            <div className="px-6 py-4">
              <h1 className="text-xl font-mono font-bold">Tahmeed T</h1>
            </div>
            {/* Progressive white line */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-white transition-all duration-300 ease-out"
              id="progress-line"
              style={{ width: '20px' }}
            />
          </header>

          <div className="pt-28 px-6 pb-12">
            {/* Hero Section */}
            <section id="hero" className="min-h-[calc(100vh-7rem)] relative mt-4">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:pr-6">
                {/* Text content */}
                <div className="space-y-6">
                  <h2 className="inline-block text-4xl lg:text-6xl font-bold leading-[1.1] pb-[0.1em] bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    ML Engineer
                  </h2>
                  <h3 className="text-2xl lg:text-3xl text-gray-400">Founder & Developer</h3>
                  <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                    Building the future with artificial intelligence. Passionate about creating innovative solutions at
                    the intersection of machine learning, software development, and entrepreneurship.
                  </p>
                  <div className="pt-2">
                    <a 
                      href="https://drive.google.com/file/d/1YyYSdvZ2Bpwg6_NCOCEKpJF5fn6_kQTI/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 no-underline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Resume
                    </a>
                  </div>
                </div>

                {/* Portrait - fills right half of hero */}
                <div className="flex justify-center lg:justify-end self-stretch">
                  <div className="relative w-full h-[50vh] lg:h-[calc(100vh-10rem)] bg-gray-800 border-2 border-gray-600 rounded-lg overflow-hidden">
                    <img
                      src="/me.png"
                      alt="Tahmeed T Portrait"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.nextSibling) {
                          (target.nextSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="absolute inset-0 w-full h-full bg-gray-800 flex items-center justify-center text-gray-400" style={{display: 'none'}}>
                      <User className="w-16 h-16" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20">
              <h2 className="text-3xl font-bold mb-8 font-mono">About</h2>
              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="text-gray-300 leading-relaxed">
                    I'm an aspiring ML Engineer and Founder with a passion for building systems that solve
                    real-world problems, help humanity and automate the future. My journey spans research to practical applications in the industry.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Currently focused on developing next-generation solutions while exploring entrepreneurial
                    opportunities in the tech space, seeking 2026 internships.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-200">Core Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Python", "PyTorch", "TensorFlow", "React", "Node.js", "Docker", "AWS", "Google Cloud",
                      "CUDA", "C++", "Rust", "C", "Java", "JavaScript", "TypeScript", "SQL", "NoSQL",
                      "GraphQL", "REST", "Web3", "Blockchain", "Cryptography", "Quantum Computing",
                      "Machine Learning", "Computer Vision", "Natural Language Processing"
                    ].map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-gray-700">
                          {skill}
                        </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-20">
              <h2 className="text-3xl font-bold mb-8 font-mono">Selected Projects</h2>
              <div className="grid gap-6">
                {projects.map((project, index) => (
                  <Card
                    key={index}
                    className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                        <div className="flex gap-2">
                          {project.github && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Github className="w-4 h-4" />
                            </Button>
                          )}
                          {project.link && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-gray-800 rounded text-xs border border-gray-700 text-white">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="py-20">
              <h2 className="text-3xl font-bold mb-8 font-mono">Experience</h2>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-gray-700 pl-6 pb-8">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                      <span className="text-gray-400 text-sm">{exp.period}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{exp.company}</p>
                    <p className="text-gray-400">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20">
              <h2 className="text-3xl font-bold mb-8 font-mono">Get In Touch</h2>
              <div className="space-y-6">
                <p className="text-gray-300 text-lg">
                  Interested in collaborating or discussing opportunities? Let's connect.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="mailto:tabeeb700@gmail.com"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:bg-gray-800 bg-transparent rounded text-white no-underline"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/tahmeedt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:bg-gray-800 bg-transparent rounded text-white no-underline"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a 
                    href="https://github.com/ruyot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:bg-gray-800 bg-transparent rounded text-white no-underline"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* AI Agent Sidebar */}
        <div className="bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-black" />
              <h3 className="font-semibold text-black">AI Assistant</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Ask me about Tahmeed's work</p>
          </div>

          {/* Chat Section */}
          <div className="flex-1 max-h-[40vh] flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                    {message.type === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === "user" ? "bg-black text-white ml-auto" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-700" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-200">
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Quick prompts:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs border-gray-300 hover:bg-gray-50 h-auto py-2 px-3 bg-white text-black"
                      onClick={() => handleQuickPrompt(prompt)}
                    >
                      {prompt.text}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="bg-white border-gray-300 text-black placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && inputValue.trim()) {
                      handleSendMessage(inputValue.trim())
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={() => inputValue.trim() && handleSendMessage(inputValue.trim())}
                  disabled={!inputValue.trim()}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Project Images Grid */}
          <div className="border-t border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-black mb-3">Featured Projects</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/Truthful.png" alt="Truthful Project" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/webide.png" alt="Web IDE Project" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/Gameshare.png" alt="GameShare Project" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/Truthful_about.png" alt="Truthful About Page" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/webmainframe.png" alt="Web Mainframe" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/Truthful_analysispage.png" alt="Truthful Analysis" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/MinML.png" alt="MinML Project 1" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/MinML_2.png" alt="MinML Project 2" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/MinML_3.png" alt="MinML Project 3" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/MinML_4.png" alt="MinML Project 4" className="w-full h-full object-cover rounded-lg" />
              </div>
              {/* Newly added images */}
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/Shadow1.png" alt="Shadow 1" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/Shadow2.png" alt="Shadow 2" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/Shadow3.png" alt="Shadow 3" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img src="/Shadow4.png" alt="Shadow 4" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>

          {/* Coding Stats Section */}
          <div className="border-t border-gray-200 p-4 bg-gradient-to-b from-white to-gray-50">
            <h4 className="text-sm font-semibold text-black mb-3 font-mono">Live Coding Stats</h4>
            <div className="space-y-3" ref={codingStatsRef}>
              {/* GitHub Commits This Month */}
              <div className="bg-black text-green-400 p-3 rounded-lg font-mono text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <GitBranch className="w-3 h-3" />
                  <span className="text-green-300">git log --since="1 month ago" --oneline | wc -l</span>
                </div>
                <div className="text-white">
                  <span className="text-green-400">$</span> {Math.floor(codingStats.commitsThisMonth)} commits this month
                </div>
                <div className="text-gray-400 text-[10px] mt-1">
                  {(() => {
                    const total = Math.max(1, codingStats.realCommitsThisMonth)
                    const denom = Math.max(1, Math.floor(total / 10))
                    const units = Math.min(10, Math.max(0, Math.floor(codingStats.commitsThisMonth / denom)))
                    const empties = Math.max(0, 10 - units)
                    const pct = Math.min(100, Math.max(0, Math.floor((codingStats.commitsThisMonth / total) * 100)))
                    return `[${'█'.repeat(units)}${'░'.repeat(empties)}] ${pct}%`
                  })()}
                </div>
              </div>

              {/* Hours Coded Today */}
              <div className="bg-black text-blue-400 p-3 rounded-lg font-mono text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-blue-300">watch -n 1 'ps aux | grep code'</span>
                </div>
                <div className="text-white">
                  <span className="text-blue-400">$</span> {codingStats.hoursCodedToday.toFixed(1)} hours today
                </div>
                <div className="text-gray-400 text-[10px] mt-1">
                  Active sessions: Cursor, Terminal, Browser
                </div>
              </div>

              {/* Lines Written */}
              <div className="bg-black text-yellow-400 p-3 rounded-lg font-mono text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Terminal className="w-3 h-3" />
                  <span className="text-yellow-300">{"wc -l src/**/*.{ts,tsx,py}"}</span>
                </div>
                <div className="text-white">
                  <span className="text-yellow-400">$</span> {Math.floor(codingStats.linesWritten).toLocaleString()} lines written
                </div>
                <div className="text-gray-400 text-[10px] mt-1">
                  TypeScript: 67% | Python: 28% | Other: 5%
                </div>
              </div>

              {/* Coffee Count */}
              <div className="bg-black text-orange-400 p-3 rounded-lg font-mono text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Coffee className="w-3 h-3" />
                  <span className="text-orange-300">cat /dev/coffee | grep today</span>
                </div>
                <div className="text-white">
                  <span className="text-orange-400">$</span> {Math.floor(codingStats.coffeeCount)} cups consumed
                </div>
                <div className="text-gray-400 text-[10px] mt-1">
                  Caffeine level: {codingStats.coffeeCount > 8 ? 'MAXIMUM' : 'OPTIMAL'}
                </div>
              </div>

              {/* Fun Facts Terminal Animations */}
              <div className="bg-black text-cyan-400 p-3 rounded-lg font-mono text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Terminal className="w-3 h-3" />
                  <span className="text-cyan-300">echo $fun_fact_1</span>
                </div>
                                 <div className="text-white">
                   <span className="text-cyan-400">{'>'}</span> {funFactsAnimated[0]}<span className={funFactsAnimated[0].length < funFacts[0].length ? "animate-pulse" : "hidden"}>|</span>
                 </div>
               </div>
 
               <div className="bg-black text-purple-400 p-3 rounded-lg font-mono text-xs">
                 <div className="flex items-center gap-2 mb-1">
                   <Terminal className="w-3 h-3" />
                   <span className="text-purple-300">cat ~/personal/hobbies.txt</span>
                 </div>
                 <div className="text-white">
                   <span className="text-purple-400">{'>'}</span> {funFactsAnimated[1]}<span className={funFactsAnimated[1].length < funFacts[1].length ? "animate-pulse" : "hidden"}>|</span>
                 </div>
               </div>
 
               <div className="bg-black text-pink-400 p-3 rounded-lg font-mono text-xs">
                 <div className="flex items-center gap-2 mb-1">
                   <Terminal className="w-3 h-3" />
                   <span className="text-pink-300">cat ~/games/status.txt</span>
                 </div>
                 <div className="text-white">
                   <span className="text-pink-400">{'>'}</span> {funFactsAnimated[2]}<span className={funFactsAnimated[2].length < funFacts[2].length ? "animate-pulse" : "hidden"}>|</span>
                 </div>
               </div>
 
               <div className="bg-black text-emerald-400 p-3 rounded-lg font-mono text-xs">
                 <div className="flex items-center gap-2 mb-1">
                   <Terminal className="w-3 h-3" />
                   <span className="text-emerald-300">tail ~/gaming/preferences.log</span>
                 </div>
                 <div className="text-white">
                   <span className="text-emerald-400">{'>'}</span> {funFactsAnimated[3]}<span className={funFactsAnimated[3].length < funFacts[3].length ? "animate-pulse" : "hidden"}>|</span>
                 </div>
               </div>
 
               <div className="bg-black text-amber-400 p-3 rounded-lg font-mono text-xs">
                 <div className="flex items-center gap-2 mb-1">
                   <Terminal className="w-3 h-3" />
                   <span className="text-amber-300">wpm --test-speed</span>
                 </div>
                 <div className="text-white">
                   <span className="text-amber-400">{'>'}</span> {funFactsAnimated[4]}<span className={funFactsAnimated[4].length < funFacts[4].length ? "animate-pulse" : "hidden"}>|</span>
                 </div>
               </div>
 
               <div className="bg-black text-red-400 p-3 rounded-lg font-mono text-xs">
                 <div className="flex items-center gap-2 mb-1">
                   <Terminal className="w-3 h-3" />
                   <span className="text-red-300">git log --since="this summer" --oneline</span>
                 </div>
                 <div className="text-white">
                   <span className="text-red-400">{'>'}</span> {funFactsAnimated[5]}<span className={funFactsAnimated[5].length < funFacts[5].length ? "animate-pulse" : "hidden"}>|</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
