import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Projects from "@/pages/Projects";
import WorkbookLayout from "@/pages/Workbook";
import { useEffect } from "react";

function HtmlSheetsRedirect() {
  useEffect(() => {
    window.location.href = "/api/html-sheets-index";
  }, []);
  return <div style={{ padding: "20px", textAlign: "center" }}>Loading 49 bridge design sheets...</div>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HtmlSheetsRedirect} />
      <Route path="/workbook/:id" component={WorkbookLayout} />
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
