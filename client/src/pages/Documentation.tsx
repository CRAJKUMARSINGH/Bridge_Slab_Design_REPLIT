import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  FileText, 
  Video, 
  Download, 
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Code,
  Database,
  Settings,
  Users,
  Shield
} from "lucide-react";

export default function Documentation() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const documentationSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Learn how to set up and begin using the Bridge Design Suite",
      articles: [
        {
          id: "installation",
          title: "Installation Guide",
          type: "guide",
          readingTime: "5 min"
        },
        {
          id: "quickstart",
          title: "Quick Start Tutorial",
          type: "tutorial",
          readingTime: "10 min"
        },
        {
          id: "system-requirements",
          title: "System Requirements",
          type: "reference",
          readingTime: "3 min"
        }
      ]
    },
    {
      id: "user-guides",
      title: "User Guides",
      icon: <FileText className="h-5 w-5" />,
      description: "Comprehensive guides for using all features of the application",
      articles: [
        {
          id: "project-management",
          title: "Project Management",
          type: "guide",
          readingTime: "8 min"
        },
        {
          id: "design-workflow",
          title: "Design Workflow",
          type: "guide",
          readingTime: "12 min"
        },
        {
          id: "report-generation",
          title: "Report Generation",
          type: "guide",
          readingTime: "7 min"
        },
        {
          id: "cad-drawings",
          title: "CAD Drawing Export",
          type: "guide",
          readingTime: "6 min"
        }
      ]
    },
    {
      id: "technical-reference",
      title: "Technical Reference",
      icon: <Code className="h-5 w-5" />,
      description: "Detailed technical documentation for developers and advanced users",
      articles: [
        {
          id: "api-documentation",
          title: "API Documentation",
          type: "reference",
          readingTime: "15 min"
        },
        {
          id: "database-schema",
          title: "Database Schema",
          type: "reference",
          readingTime: "10 min"
        },
        {
          id: "engineering-calculations",
          title: "Engineering Calculations",
          type: "reference",
          readingTime: "20 min"
        }
      ]
    },
    {
      id: "administration",
      title: "Administration",
      icon: <Settings className="h-5 w-5" />,
      description: "Guides for system administrators and IT personnel",
      articles: [
        {
          id: "user-management",
          title: "User Management",
          type: "guide",
          readingTime: "6 min"
        },
        {
          id: "system-configuration",
          title: "System Configuration",
          type: "guide",
          readingTime: "9 min"
        },
        {
          id: "backup-restore",
          title: "Backup and Restore",
          type: "guide",
          readingTime: "8 min"
        }
      ]
    }
  ];

  const popularArticles = [
    {
      id: "troubleshooting",
      title: "Troubleshooting Common Issues",
      type: "guide",
      readingTime: "7 min"
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      type: "faq",
      readingTime: "5 min"
    },
    {
      id: "best-practices",
      title: "Best Practices for Bridge Design",
      type: "guide",
      readingTime: "12 min"
    }
  ];

  const videoTutorials = [
    {
      id: "intro-video",
      title: "Introduction to Bridge Design Suite",
      duration: "8:42"
    },
    {
      id: "design-tutorial",
      title: "Creating Your First Bridge Design",
      duration: "15:30"
    },
    {
      id: "report-video",
      title: "Generating Professional Reports",
      duration: "12:15"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Documentation Center</h1>
            <p className="text-blue-200">Comprehensive guides and resources for the Bridge Design Suite</p>
          </div>
          <Button 
            onClick={() => setLocation("/")}
            className="bg-white text-blue-900 hover:bg-blue-100"
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search documentation..."
              className="pl-10 pr-4 py-3 text-lg w-full max-w-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Popular searches:</span>
            {["bridge design", "excel reports", "cad drawings", "cost estimation"].map((term) => (
              <button
                key={term}
                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200"
                onClick={() => setSearchQuery(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Documentation Sections */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Documentation Library</h2>
              <div className="space-y-6">
                {documentationSections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-4">
                          {section.icon}
                        </div>
                        <div>
                          <CardTitle>{section.title}</CardTitle>
                          <CardDescription>{section.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.articles.map((article) => (
                          <div 
                            key={article.id} 
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => console.log(`View article: ${article.id}`)}
                          >
                            <div>
                              <h3 className="font-medium">{article.title}</h3>
                              <div className="flex items-center mt-1">
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2">
                                  {article.type}
                                </span>
                                <span className="text-xs text-gray-500">{article.readingTime}</span>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Popular Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {popularArticles.map((article) => (
                      <div 
                        key={article.id} 
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => console.log(`View article: ${article.id}`)}
                      >
                        <div>
                          <h3 className="text-sm font-medium">{article.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2">
                              {article.type}
                            </span>
                            <span className="text-xs text-gray-500">{article.readingTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Video Tutorials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Video Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {videoTutorials.map((video) => (
                      <div 
                        key={video.id} 
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => console.log(`Play video: ${video.id}`)}
                      >
                        <div>
                          <h3 className="text-sm font-medium">{video.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">{video.duration}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Downloads */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      User Manual (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Code className="h-4 w-4 mr-2" />
                      API Documentation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Sample Projects
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Bridge Design Suite</h3>
              <p className="text-gray-400">
                Advanced bridge engineering solutions for modern infrastructure projects.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Community Forum</a></li>
                <li><a href="#" className="hover:text-white">Support Tickets</a></li>
                <li><a href="#" className="hover:text-white">Training</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Case Studies</a></li>
                <li><a href="#" className="hover:text-white">Webinars</a></li>
                <li><a href="#" className="hover:text-white">White Papers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  support@bridgedesignsuite.com
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Bridge Design Suite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}