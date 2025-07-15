
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/Layout";

// Pages
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { Onboarding } from "@/pages/auth/Onboarding";
import { Dashboard } from "@/pages/Dashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminPlayers } from "@/pages/admin/Players";
import { AdminProfiles } from "@/pages/admin/Profiles";
import { AdminStats } from "@/pages/admin/Stats";
import { Profile } from "@/pages/Profile";
import { Chat } from "@/pages/Chat";
import { Announcements } from "@/pages/Announcements";
import { Settings } from "@/pages/Settings";
import NotFound from "./pages/NotFound";
import { Loadouts } from "@/pages/Loadouts";
import { Scrims } from "@/pages/Scrims";
import { PublicProfile } from "@/pages/PublicProfile";
import { AdminLoadouts } from "@/pages/admin/Loadouts";
import { AdminScrimsManagement } from "@/pages/admin/ScrimsManagement";
import { AdminEventsManagement } from "@/pages/admin/EventsManagement";
import { AdminAttendance } from "@/pages/admin/Attendance";
import { AdminNotifications } from "@/pages/admin/Notifications";
import { AdminAnnouncementsManagement } from "@/pages/admin/AnnouncementsManagement";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'player' }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl font-orbitron">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/user/:ign" element={<Layout><PublicProfile /></Layout>} />
      <Route path="/auth/login" element={
        isAuthenticated ? 
        <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace /> : 
        <Layout><Login /></Layout>
      } />
      <Route path="/auth/signup" element={
        isAuthenticated ? 
        <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace /> : 
        <Layout><Signup /></Layout>
      } />
      <Route path="/auth/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
      <Route path="/auth/reset-password" element={<Layout><ResetPassword /></Layout>} />
      
      {/* Onboarding Route */}
      <Route path="/auth/onboarding" element={
        <ProtectedRoute>
          <Layout><Onboarding /></Layout>
        </ProtectedRoute>
      } />

      {/* Protected Player Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="player">
          <Layout showSidebar><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/loadouts" element={
        <ProtectedRoute requiredRole="player">
          <Layout showSidebar><Loadouts /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/scrims" element={
        <ProtectedRoute requiredRole="player">
          <Layout showSidebar><Scrims /></Layout>
        </ProtectedRoute>
      } />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/players" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminPlayers /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/profiles" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminProfiles /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/stats" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminStats /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/loadouts" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminLoadouts /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/scrims" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminScrimsManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/events" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminEventsManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminAttendance /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminNotifications /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/announcements" element={
        <ProtectedRoute requiredRole="admin">
          <Layout showSidebar><AdminAnnouncementsManagement /></Layout>
        </ProtectedRoute>
      } />

      {/* Shared Protected Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout showSidebar><Profile /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <Layout showSidebar><Chat /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/announcements" element={
        <ProtectedRoute>
          <Layout showSidebar><Announcements /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout showSidebar><Settings /></Layout>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
