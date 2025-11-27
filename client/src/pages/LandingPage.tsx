import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  FileText, 
  Calculator, 
  Download, 
  CheckCircle, 
  Zap, 
  TrendingUp, 
  Shield,
  Users,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  File,
  Image,
  FileSpreadsheet
} from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [projectName, setProjectName] = useState("");
  const [locationState, setLocationState] = useState("");
  const [outputFiles, setOutputFiles] = useState<any[]>([]);

  // Fetch available output files
  useEffect(() => {
    const fetchOutputFiles = async () => {
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll simulate with the files we know exist
        const files = [
          { name: "basic_bridge_visualization.dxf", type: "dxf", size: "1.2 KB" },
          { name: "basic_bridge_visualization.svg", type: "svg", size: "1.6 KB" },
          { name: "bridge_parameters_summary.txt", type: "txt", size: "0.5 KB" },
          { name: "BRIDGE_GAD_1_PDF_2025-11-25_01-47-14.pdf", type: "pdf", size: "66.9 KB" },
          { name: "BRIDGE_GAD_1_PNG_2025-11-25_01-47-14.png", type: "png", size: "66.9 KB" }
        ];
        setOutputFiles(files);
      } catch (error) {
        console.error("Error fetching output files:", error);
      }
    };

    fetchOutputFiles();
  }, []);

  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    // In a real implementation, this would create a project and navigate to it
    setLocation("/projects");
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'dxf': return <File className="h-8 w-8 text-blue-500" />;
      case 'svg': return <Image className="h-8 w-8 text-green-500" />;
      case 'txt': return <FileText className="h-8 w-8 text-gray-500" />;
      case 'pdf': return <FileSpreadsheet className="h-8 w-8 text-red-500" />;
      case 'png': return <Image className="h-8 w-8 text-purple-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const features = [
    {
      icon: <Building className="h-8 w-8" />,
      title: "Design Automation",
      description: "Generate IRC-compliant bridge designs in minutes with our advanced algorithms"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Professional Reports",
      description: "47-sheet comprehensive Excel reports with detailed engineering calculations"
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      title: "Cost Estimation",
      description: "Accurate BOQ and cost estimation integrated with design parameters"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Fast Processing",
      description: "Reduce design time from weeks to minutes with our optimized system"
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      text: "IRC:6-2016 & IRC:112-2015 compliant designs"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      text: "Structural safety checks included"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
      text: "Optimized material usage for cost savings"
    },
    {
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      text: "Professional engineering standards"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm">
              🏗️ PREMIUM BRIDGE DESIGN SOLUTION FOR TRUMP CONSTRUCTION
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Trump Bridge <span className="text-blue-300">Design Suite</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto">
              The most advanced submersible bridge design automation system. 
              Transform hydraulic parameters into complete engineering designs, 
              professional drawings, and accurate cost estimates in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg"
                onClick={() => setLocation("/projects")}
              >
                <Zap className="h-6 w-6 mr-2" />
                Start Design Project
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-6 text-lg"
              >
                <Download className="h-6 w-6 mr-2" />
                View Sample Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* OUTPUT FILES SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recently Generated Files
            </h2>
            <p className="text-lg text-gray-600">
              Sample outputs from our integrated design, drawing, and estimation system
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {outputFiles.map((file, index) => (
              <Card key={index} className="border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="flex flex-col items-center">
                  <div className="mb-4">
                    {getFileIcon(file.type)}
                  </div>
                  <CardTitle className="text-center text-sm">{file.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-xs text-gray-500 mb-3">{file.size}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(`/api/output/${file.name}`, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Integrated Design, Drawing & Estimation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for professional bridge engineering projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TABS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="design" className="text-lg py-3">Design</TabsTrigger>
              <TabsTrigger value="drawing" className="text-lg py-3">Drawing</TabsTrigger>
              <TabsTrigger value="estimate" className="text-lg py-3">Estimate</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Automated Bridge Design</CardTitle>
                  <CardDescription>
                    Generate complete IRC-compliant designs with one click
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Design Features</h3>
                      <ul className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center">
                            {benefit.icon}
                            <span className="ml-2">{benefit.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Design Process</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <span className="text-blue-800 font-bold">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Input Parameters</h4>
                            <p className="text-sm text-gray-600">Enter hydraulic and structural data</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <span className="text-blue-800 font-bold">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Auto-Generate</h4>
                            <p className="text-sm text-gray-600">System creates complete design</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <span className="text-blue-800 font-bold">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Review & Export</h4>
                            <p className="text-sm text-gray-600">Verify and download reports</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="drawing" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Professional Drawings</CardTitle>
                  <CardDescription>
                    Generate CAD-ready drawings and visualizations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center">
                      <CardHeader>
                        <div className="mx-auto bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle>DXF Files</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">CAD-compatible drawings for professional use</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="text-center">
                      <CardHeader>
                        <div className="mx-auto bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle>PDF Reports</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Printable documentation with all calculations</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="text-center">
                      <CardHeader>
                        <div className="mx-auto bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-purple-600" />
                        </div>
                        <CardTitle>SVG Visuals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Web-friendly visualizations for presentations</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="estimate" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Cost Estimation</CardTitle>
                  <CardDescription>
                    Accurate BOQ and cost calculations integrated with design
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Estimation Components</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between border-b pb-2">
                          <span>Materials</span>
                          <span className="font-medium">₹2,500,000</span>
                        </li>
                        <li className="flex justify-between border-b pb-2">
                          <span>Labor</span>
                          <span className="font-medium">₹1,200,000</span>
                        </li>
                        <li className="flex justify-between border-b pb-2">
                          <span>Equipment</span>
                          <span className="font-medium">₹800,000</span>
                        </li>
                        <li className="flex justify-between border-b pb-2">
                          <span>Overheads</span>
                          <span className="font-medium">₹500,000</span>
                        </li>
                        <li className="flex justify-between pt-2 font-bold text-lg">
                          <span>Total Estimate</span>
                          <span className="text-blue-600">₹5,000,000</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Estimation Benefits</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>Real-time cost updates with design changes</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>Detailed BOQ with material quantities</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>Market rate integration</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>Budget tracking and variance analysis</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Bridge Design Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Trump Construction in revolutionizing bridge engineering with our automated design suite
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-6 text-lg"
              onClick={() => setLocation("/projects")}
            >
              Start Your First Project
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-6 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Trump Bridge Design</h3>
              <p className="text-gray-400">
                Advanced bridge engineering solutions for modern infrastructure projects.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@trumpbridges.com
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  New York, NY
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Bridge Design</li>
                <li>Structural Analysis</li>
                <li>Cost Estimation</li>
                <li>Project Management</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Our Team</li>
                <li>Careers</li>
                <li>Partners</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Trump Bridge Design Suite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}