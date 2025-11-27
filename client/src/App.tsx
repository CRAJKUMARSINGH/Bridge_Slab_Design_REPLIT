import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Projects from "@/pages/Projects";
import WorkbookLayout from "@/pages/Workbook";
import LandingPage from "@/pages/LandingPage";
import IntegrationDashboard from "@/pages/IntegrationDashboard";
import Documentation from "@/pages/Documentation";
import Settings from "@/pages/Settings";
import { useEffect } from "react";

// Removed HtmlSheetsRedirect component as we're using LandingPage

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/projects" component={Projects} />
      <Route path="/workbook/:id" component={WorkbookLayout} />
      <Route path="/integration" component={IntegrationDashboard} />
      <Route path="/docs" component={Documentation} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;