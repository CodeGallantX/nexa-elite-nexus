
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Layout } from '@/components/Layout';

// Public pages
import Index from '@/pages/Index';
import { Landing } from '@/pages/Landing';
import { PublicProfile } from '@/pages/PublicProfile';
import NotFound from '@/pages/NotFound';

// Auth pages
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { Onboarding } from '@/pages/auth/Onboarding';

// Protected pages
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { Chat } from '@/pages/Chat';
import { Scrims } from '@/pages/Scrims';
import { Loadouts } from '@/pages/Loadouts';
import { WeaponLayouts } from '@/pages/WeaponLayouts';
import { Announcements } from '@/pages/Announcements';

// Admin pages
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminPlayers } from '@/pages/admin/Players';
import { AdminStats } from '@/pages/admin/Stats';
import { AdminProfiles } from '@/pages/admin/Profiles';
import { AdminLoadouts } from '@/pages/admin/Loadouts';
import { AdminWeaponLayouts } from '@/pages/admin/WeaponLayouts';
import { AdminScrimsManagement } from '@/pages/admin/ScrimsManagement';
import { AdminEventsManagement } from '@/pages/admin/EventsManagement';
import { EventAssignment } from '@/pages/admin/EventAssignment';
import { AdminAttendance } from '@/pages/admin/Attendance';
import { AdminAnnouncementsManagement } from '@/pages/admin/AnnouncementsManagement';
import { AdminNotifications } from '@/pages/admin/Notifications';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            
            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/onboarding" element={<Onboarding />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<Layout showSidebar><Dashboard /></Layout>} />
            <Route path="/profile" element={<Layout showSidebar><Profile /></Layout>} />
            <Route path="/settings" element={<Layout showSidebar><Settings /></Layout>} />
            <Route path="/chat" element={<Layout showSidebar><Chat /></Layout>} />
            <Route path="/scrims" element={<Layout showSidebar><Scrims /></Layout>} />
            <Route path="/loadouts" element={<Layout showSidebar><Loadouts /></Layout>} />
            <Route path="/weapon-layouts" element={<Layout showSidebar><WeaponLayouts /></Layout>} />
            <Route path="/announcements" element={<Layout showSidebar><Announcements /></Layout>} />

            {/* Admin routes */}
            <Route path="/admin" element={<Layout showSidebar><AdminDashboard /></Layout>} />
            <Route path="/admin/players" element={<Layout showSidebar><AdminPlayers /></Layout>} />
            <Route path="/admin/stats" element={<Layout showSidebar><AdminStats /></Layout>} />
            <Route path="/admin/profiles" element={<Layout showSidebar><AdminProfiles /></Layout>} />
            <Route path="/admin/loadouts" element={<Layout showSidebar><AdminLoadouts /></Layout>} />
            <Route path="/admin/weapon-layouts" element={<Layout showSidebar><AdminWeaponLayouts /></Layout>} />
            <Route path="/admin/scrims" element={<Layout showSidebar><AdminScrimsManagement /></Layout>} />
            <Route path="/admin/events" element={<Layout showSidebar><AdminEventsManagement /></Layout>} />
            <Route path="/admin/events/:eventId/assign" element={<Layout showSidebar><EventAssignment /></Layout>} />
            <Route path="/admin/event-assignment" element={<Layout showSidebar><EventAssignment /></Layout>} />
            <Route path="/admin/attendance" element={<Layout showSidebar><AdminAttendance /></Layout>} />
            <Route path="/admin/announcements" element={<Layout showSidebar><AdminAnnouncementsManagement /></Layout>} />
            <Route path="/admin/notifications" element={<Layout showSidebar><AdminNotifications /></Layout>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
