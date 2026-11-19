import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import BangladeshMapPage from './pages/BangladeshMapPage';
import CreateTripPage from './pages/CreateTripPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import TripDiscussionPage from './pages/trip/TripDiscussionPage';
import TripExpensesPage from './pages/trip/TripExpensesPage';
import TripIdeasPage from './pages/trip/TripIdeasPage';
import TripItineraryPage from './pages/trip/TripItineraryPage';
import TripMembersPage from './pages/trip/TripMembersPage';
import TripOverviewPage from './pages/trip/TripOverviewPage';
import TripPackingPage from './pages/trip/TripPackingPage';
import TripPollsPage from './pages/trip/TripPollsPage';
import TripSummaryPage from './pages/trip/TripSummaryPage';
import TripWorkspaceLayout from './pages/trip/TripWorkspaceLayout';
import ProtectedRoute from './routes/ProtectedRoute';

function NotFoundPage() {
  return (
    <main className="container page-section">
      <div className="tf-empty" style={{ maxWidth: '520px', marginInline: 'auto' }}>
        <h1 className="tf-empty__title">Page not found</h1>
        <p className="tf-empty__description">
          The page you requested does not exist or may have moved.
        </p>
        <div className="tf-empty__action">
          <Link to="/" className="btn btn-primary btn-sm">
            Back to TripForge
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/map" element={<BangladeshMapPage />} />
          <Route
            path="/trips/new"
            element={
              <ProtectedRoute>
                <CreateTripPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips/:tripId"
            element={
              <ProtectedRoute>
                <TripWorkspaceLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<TripOverviewPage />} />
            <Route path="itinerary" element={<TripItineraryPage />} />
            <Route path="ideas" element={<TripIdeasPage />} />
            <Route path="polls" element={<TripPollsPage />} />
            <Route path="expenses" element={<TripExpensesPage />} />
            <Route path="discussion" element={<TripDiscussionPage />} />
            <Route path="packing" element={<TripPackingPage />} />
            <Route path="members" element={<TripMembersPage />} />
            <Route path="summary" element={<TripSummaryPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
