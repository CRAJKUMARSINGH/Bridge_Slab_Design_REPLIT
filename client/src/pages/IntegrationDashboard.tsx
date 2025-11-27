import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  FileSpreadsheet,
  Wrench,
  Cpu,
  Database,
  GitBranch,
  BarChart3
} from "lucide-react";

export default function IntegrationDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration
  const integrationStats = {
    totalComponents: 47,
    activeIntegrations: 12,
    pendingUpdates: 3,
    systemHealth: "Good"
  };

  const components = [
    {
      id: 1,
      name: "Bridge Design Engine",
      status: "Active",
      lastUpdate: "2025-11-25",
      version: "2.1.4"
    },
    {
      id: 2,
      name: "Excel Report Generator",
      status: "Active",
      lastUpdate: "2025-11-24",
      version: "1.8.2"
    },
    {
      id: 3,
      name: "CAD Drawing System",
      status: "Active",
      lastUpdate: "2025-11-23",
      version: "3.0.1"
    },
    {
      id: 4,
      name: "Cost Estimation Module",
      status: "Pending Update",
      lastUpdate: "2025-11-20",
      version: "1.5.0"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Bridge Design Completed",
      component: "Design Engine",
      timestamp: "2 hours ago",
      status: "success"
    },
    {
      id: 2,
      action: "Excel Report Generated",
      component: "Report Generator",
      timestamp: "4 hours ago",
      status: "success"
    },
    {
      id: 3,
      action: "CAD Drawing Exported",
      component: "Drawing System",
      timestamp: "1 day ago",
      status: "success"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-white">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Integration Dashboard</h1>
            <p className="text-blue-200">Manage and monitor all system components</p>
          </div>
          <Button 
            onClick={() => setLocation("/projects")}
            className="bg-white text-blue-900 hover:bg-blue-100"
          >
            Back to Projects
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Components</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrationStats.totalComponents}</div>
                <p className="text-xs text-muted-foreground">Active system modules</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrationStats.activeIntegrations}</div>
                <p className="text-xs text-muted-foreground">Connected systems</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Updates</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrationStats.pendingUpdates}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrationStats.systemHealth}</div>
                <p className="text-xs text-muted-foreground">Operational status</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Integration Overview</CardTitle>
                  <CardDescription>
                    Complete view of all integrated components and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Core Components</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <Building className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Bridge Design Engine</h4>
                              <p className="text-sm text-gray-500">Primary design calculation system</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <FileSpreadsheet className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                              <h4 className="font-medium">Excel Report Generator</h4>
                              <p className="text-sm text-gray-500">47-sheet comprehensive reporting</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <File className="h-8 w-8 text-purple-500 mr-3" />
                            <div>
                              <h4 className="font-medium">CAD Drawing System</h4>
                              <p className="text-sm text-gray-500">DXF, SVG, PDF drawing exports</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Integration Status</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Design Engine ↔ Report Generator</span>
                          <Badge variant="outline">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Report Generator ↔ Drawing System</span>
                          <Badge variant="outline">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Drawing System ↔ Cost Estimator</span>
                          <Badge variant="outline">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Cost Estimator ↔ Database</span>
                          <Badge variant="outline">Connected</Badge>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Processing Speed</span>
                              <span className="text-sm">98%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '98%'}}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Data Accuracy</span>
                              <span className="text-sm">99.5%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '99.5%'}}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">System Uptime</span>
                              <span className="text-sm">99.9%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{width: '99.9%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="components" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Components</CardTitle>
                  <CardDescription>
                    Manage and monitor individual system components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3">Component</th>
                          <th className="text-left py-3">Status</th>
                          <th className="text-left py-3">Last Update</th>
                          <th className="text-left py-3">Version</th>
                          <th className="text-left py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {components.map((component) => (
                          <tr key={component.id} className="border-b">
                            <td className="py-3">{component.name}</td>
                            <td className="py-3">
                              <Badge variant={component.status === "Active" ? "default" : "secondary"}>
                                {component.status}
                              </Badge>
                            </td>
                            <td className="py-3">{component.lastUpdate}</td>
                            <td className="py-3">{component.version}</td>
                            <td className="py-3">
                              <Button variant="outline" size="sm">Configure</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Latest system events and operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center p-4 border rounded-lg">
                        <div className={`mr-4 p-2 rounded-full ${activity.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <CheckCircle className={`h-6 w-6 ${activity.status === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.action}</h4>
                          <p className="text-sm text-gray-500">Component: {activity.component}</p>
                        </div>
                        <div className="text-sm text-gray-500">{activity.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide integration parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">API Endpoint</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded-md"
                            defaultValue="https://api.bridgedesignsuite.com/v1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">API Key</label>
                          <input 
                            type="password" 
                            className="w-full p-2 border rounded-md"
                            defaultValue="••••••••••••••••"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Data Sync Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Automatic Sync</h4>
                            <p className="text-sm text-gray-500">Sync data every 15 minutes</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="syncToggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400" defaultChecked />
                            <label htmlFor="syncToggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Backup Frequency</h4>
                            <p className="text-sm text-gray-500">Daily backups at 2:00 AM</p>
                          </div>
                          <select className="border rounded-md p-2">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}