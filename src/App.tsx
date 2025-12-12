import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkspaceLayout } from "@/components/layout";
import HomePage from "./pages/HomePage";
import DocsPage from "./pages/DocsPage";
import TasksPage from "./pages/TasksPage";
import ChatPage from "./pages/ChatPage";
import WhiteboardPage from "./pages/WhiteboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<WorkspaceLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/whiteboard" element={<WhiteboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/plugins" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HomePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
