import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Database, 
  Cloud, 
  Save,
  RotateCcw
} from "lucide-react";

export default function Settings() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("general");

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    projectName: "Bridge Design Project",
    companyName: "Trump Construction",
    defaultEngineer: "John Smith",
    autoSave: true,
    notifications: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "dark",
    language: "en",
    fontSize: "medium"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    desktopNotifications: true,
    reportCompletion: true,
    designUpdates: false,
    systemAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiration: 90,
    sessionTimeout: 30
  });

  const sections = [
    { id: "general", title: "General", icon: <SettingsIcon className="h-4 w-4" /> },
    { id: "appearance", title: "Appearance", icon: <Palette className="h-4 w-4" /> },
    { id: "notifications", title: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "security", title: "Security", icon: <Shield className="h-4 w-4" /> }
  ];

  const handleSave = () => {
    // In a real app, this would save to a backend or localStorage
    console.log("Settings saved");
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      // Reset to default values
      setGeneralSettings({
        projectName: "Bridge Design Project",
        companyName: "Trump Construction",
        defaultEngineer: "John Smith",
        autoSave: true,
        notifications: true
      });
      setAppearanceSettings({
        theme: "dark",
        language: "en",
        fontSize: "medium"
      });
      setNotificationSettings({
        emailNotifications: true,
        desktopNotifications: true,
        reportCompletion: true,
        designUpdates: false,
        systemAlerts: true
      });
      setSecuritySettings({
        twoFactorAuth: false,
        passwordExpiration: 90,
        sessionTimeout: 30
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-blue-200">Configure your Bridge Design Suite preferences</p>
          </div>
          <Button 
            onClick={() => setLocation("/")}
            className="bg-white text-blue-900 hover:bg-blue-100"
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle>Settings Menu</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                          activeSection === section.id
                            ? "bg-blue-100 text-blue-900"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <span className="mr-3">{section.icon}</span>
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Settings Panel */}
            <div className="lg:w-3/4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {sections.find(s => s.id === activeSection)?.title}
                  </CardTitle>
                  <CardDescription>
                    {activeSection === "general" && "Manage general application settings"}
                    {activeSection === "appearance" && "Customize the look and feel of the application"}
                    {activeSection === "notifications" && "Configure notification preferences"}
                    {activeSection === "security" && "Manage security and privacy settings"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* General Settings */}
                  {activeSection === "general" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Project Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="projectName">Default Project Name</Label>
                            <Input
                              id="projectName"
                              value={generalSettings.projectName}
                              onChange={(e) => setGeneralSettings({...generalSettings, projectName: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                              id="companyName"
                              value={generalSettings.companyName}
                              onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="defaultEngineer">Default Engineer</Label>
                            <Input
                              id="defaultEngineer"
                              value={generalSettings.defaultEngineer}
                              onChange={(e) => setGeneralSettings({...generalSettings, defaultEngineer: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Application Behavior</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Auto-save Projects</Label>
                              <p className="text-sm text-gray-500">Automatically save changes to projects</p>
                            </div>
                            <Switch
                              checked={generalSettings.autoSave}
                              onCheckedChange={(checked) => setGeneralSettings({...generalSettings, autoSave: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Enable Notifications</Label>
                              <p className="text-sm text-gray-500">Show notifications for important events</p>
                            </div>
                            <Switch
                              checked={generalSettings.notifications}
                              onCheckedChange={(checked) => setGeneralSettings({...generalSettings, notifications: checked})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeSection === "appearance" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Theme</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: "light", name: "Light", description: "Clean and bright interface" },
                            { id: "dark", name: "Dark", description: "Reduced eye strain in low light" },
                            { id: "system", name: "System", description: "Follow system preference" }
                          ].map((theme) => (
                            <div
                              key={theme.id}
                              className={`border rounded-lg p-4 cursor-pointer ${
                                appearanceSettings.theme === theme.id
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => setAppearanceSettings({...appearanceSettings, theme: theme.id})}
                            >
                              <div className="font-medium">{theme.name}</div>
                              <div className="text-sm text-gray-500">{theme.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Language & Display</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="language">Language</Label>
                            <select
                              id="language"
                              className="w-full p-2 border rounded-md"
                              value={appearanceSettings.language}
                              onChange={(e) => setAppearanceSettings({...appearanceSettings, language: e.target.value})}
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="fontSize">Font Size</Label>
                            <select
                              id="fontSize"
                              className="w-full p-2 border rounded-md"
                              value={appearanceSettings.fontSize}
                              onChange={(e) => setAppearanceSettings({...appearanceSettings, fontSize: e.target.value})}
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeSection === "notifications" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Email Notifications</Label>
                              <p className="text-sm text-gray-500">Receive notifications via email</p>
                            </div>
                            <Switch
                              checked={notificationSettings.emailNotifications}
                              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Desktop Notifications</Label>
                              <p className="text-sm text-gray-500">Show notifications on your desktop</p>
                            </div>
                            <Switch
                              checked={notificationSettings.desktopNotifications}
                              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, desktopNotifications: checked})}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Report Completion</Label>
                              <p className="text-sm text-gray-500">Notify when reports are generated</p>
                            </div>
                            <Switch
                              checked={notificationSettings.reportCompletion}
                              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, reportCompletion: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Design Updates</Label>
                              <p className="text-sm text-gray-500">Notify when designs are modified</p>
                            </div>
                            <Switch
                              checked={notificationSettings.designUpdates}
                              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, designUpdates: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>System Alerts</Label>
                              <p className="text-sm text-gray-500">Notify about system issues or maintenance</p>
                            </div>
                            <Switch
                              checked={notificationSettings.systemAlerts}
                              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemAlerts: checked})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeSection === "security" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Authentication</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Two-Factor Authentication</Label>
                              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                            </div>
                            <Switch
                              checked={securitySettings.twoFactorAuth}
                              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Password Policy</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="passwordExpiration">Password Expiration (days)</Label>
                            <Input
                              id="passwordExpiration"
                              type="number"
                              value={securitySettings.passwordExpiration}
                              onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiration: parseInt(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Session Management</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                            <Input
                              id="sessionTimeout"
                              type="number"
                              value={securitySettings.sessionTimeout}
                              onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button variant="outline" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Defaults
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}