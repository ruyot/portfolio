"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User, Bot, ExternalLink, Github, Linkedin, Mail } from "lucide-react"

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
    title: "Neural Network Optimizer",
    description: "Advanced ML optimization framework for deep learning models with custom gradient descent algorithms.",
    tech: ["Python", "PyTorch", "CUDA", "NumPy"],
    github: "#",
  },
  {
    title: "AI-Powered Analytics Platform",
    description: "Full-stack platform leveraging machine learning for predictive business analytics.",
    tech: ["React", "Node.js", "TensorFlow", "PostgreSQL"],
    link: "#",
  },
  {
    title: "Computer Vision Pipeline",
    description: "Real-time object detection and classification system for autonomous systems.",
    tech: ["Python", "OpenCV", "YOLO", "Docker"],
    github: "#",
  },
]

const experiences = [
  {
    role: "ML Engineer",
    company: "Stealth Startup",
    period: "2024 - Present",
    description: "Building next-generation AI systems for enterprise automation.",
  },
  {
    role: "Full Stack Developer",
    company: "Freelance",
    period: "2022 - 2024",
    description: "Developed scalable web applications and ML-powered solutions for various clients.",
  },
  {
    role: "Research Assistant",
    company: "University Lab",
    period: "2021 - 2022",
    description: "Conducted research in deep learning and neural network architectures.",
  },
]

const quickPrompts = [
  { text: "Tell me about yourself", action: "about" },
  { text: "Show me your projects", action: "projects" },
  { text: "What's your experience?", action: "experience" },
  { text: "How can I contact you?", action: "contact" },
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
          "Here are some of Tahmeed's key projects: Neural Network Optimizer, AI-Powered Analytics Platform, and Computer Vision Pipeline. Each showcases different aspects of his ML and development expertise. Would you like to know more about any specific project?"
        scrollTo = "projects"
      } else if (content.toLowerCase().includes("experience")) {
        botResponse =
          "Tahmeed has experience as an ML Engineer at a stealth startup, Full Stack Developer as a freelancer, and Research Assistant at a university lab. His background spans both practical application and academic research in AI/ML."
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
          </header>

          <div className="pt-20 px-6 pb-12">
            {/* Hero Section */}
            <section id="hero" className="min-h-[60vh] flex items-center">
              <div className="max-w-4xl">
                <div className="space-y-6">
                  <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    ML Engineer
                  </h2>
                  <h3 className="text-2xl lg:text-3xl text-gray-400">Founder & Developer</h3>
                  <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                    Building the future with artificial intelligence. Passionate about creating innovative solutions at
                    the intersection of machine learning, software development, and entrepreneurship.
                  </p>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20">
              <h2 className="text-3xl font-bold mb-8 font-mono">About</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-gray-300 leading-relaxed">
                    I'm an aspiring ML Engineer and Founder with a passion for building intelligent systems that solve
                    real-world problems. My journey spans from academic research to practical applications in industry.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Currently focused on developing next-generation AI solutions while exploring entrepreneurial
                    opportunities in the tech space.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-200">Core Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "PyTorch", "TensorFlow", "React", "Node.js", "Docker", "AWS", "PostgreSQL"].map(
                      (skill) => (
                        <span key={skill} className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-gray-700">
                          {skill}
                        </span>
                      ),
                    )}
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
                          <span key={tech} className="px-2 py-1 bg-gray-800 rounded text-xs border border-gray-700">
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
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
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

          {/* Chat Section - Moved Higher */}
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
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Project 1"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Project 2"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Project 3"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Project 4"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Project 5"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Project 6"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
