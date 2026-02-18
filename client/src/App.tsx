import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Onboard from "@/pages/Onboard";
import InvestorOnboard from "@/pages/InvestorOnboard";
import Dashboard from "@/pages/Dashboard";
import Discover from "@/pages/Discover";
import Admin from "@/pages/Admin";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/onboard" component={Onboard} />
      <Route path="/investor-onboard" component={InvestorOnboard} />
      <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/discover">{() => <ProtectedRoute component={Discover} />}</Route>
      <Route path="/admin">{() => <ProtectedRoute component={Admin} />}</Route>
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
