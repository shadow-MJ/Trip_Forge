import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getUnreadNotificationCount } from "../api/notificationsApi";
import { useAuth } from "../context/useAuth";
import { getInitials } from "../utils/formatters";
import { BellIcon, BrandIcon, CloseIcon, MenuIcon } from "./Icons";
import NotificationsPanel from "./NotificationsPanel";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [openMenuPath, setOpenMenuPath] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const mobileMenuOpen = openMenuPath === location.pathname;

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let active = true;
    async function fetchCount() {
      try {
        const count = await getUnreadNotificationCount();
        if (active) setUnreadCount(count);
      } catch {
        // Keep count resilient
      }
    }
    fetchCount();

    function handleNotificationsSync() {
      fetchCount();
    }

    window.addEventListener(
      "tripforge:notifications-updated",
      handleNotificationsSync,
    );
    return () => {
      active = false;
      window.removeEventListener(
        "tripforge:notifications-updated",
        handleNotificationsSync,
      );
    };
  }, [isAuthenticated, location.pathname]);

  const effectiveUnreadCount = isAuthenticated ? unreadCount : 0;

  async function handleLogout() {
    setOpenMenuPath(null);
    await logout();
    navigate("/");
  }

  return (
    <>
      <header className="tf-navbar no-print">
        <div className="container tf-navbar__inner">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="tf-navbar__brand"
          >
            <span className="tf-navbar__logo">
              <BrandIcon size={18} />
            </span>
            <span className="tf-navbar__brand-name">TripForge</span>
          </Link>

          <nav className="tf-navbar__desktop" aria-label="Primary navigation">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `tf-navbar__link ${isActive ? "tf-navbar__link--active" : ""}`
                  }
                >
                  Trips
                </NavLink>
                <NavLink
                  to="/map"
                  className={({ isActive }) =>
                    `tf-navbar__link ${isActive ? "tf-navbar__link--active" : ""}`
                  }
                >
                  Map
                </NavLink>
                <NavLink
                  to="/trips/new"
                  className={({ isActive }) =>
                    `tf-navbar__link ${isActive ? "tf-navbar__link--active" : ""}`
                  }
                >
                  New trip
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `tf-navbar__link ${isActive ? "tf-navbar__link--active" : ""}`
                  }
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `tf-navbar__link ${isActive ? "tf-navbar__link--active" : ""}`
                  }
                >
                  Settings
                </NavLink>

                <button
                  type="button"
                  className="btn btn-ghost tf-navbar__bell"
                  onClick={() => setPanelOpen(true)}
                  aria-label={`Open notifications${effectiveUnreadCount > 0 ? `, ${effectiveUnreadCount} unread` : ""}`}
                >
                  <BellIcon size={18} />
                  {effectiveUnreadCount > 0 && (
                    <span className="tf-navbar__badge">
                      {effectiveUnreadCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/profile"
                  className="tf-navbar__avatar"
                  title={user?.name}
                >
                  {getInitials(user?.name)}
                </Link>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/map"
                  className={({ isActive }) =>
                    `btn btn-ghost btn-sm ${isActive ? "btn-secondary" : ""}`
                  }
                >
                  Map
                </NavLink>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get started
                </Link>
              </>
            )}
          </nav>

          <div className="tf-navbar__mobile-actions">
            {isAuthenticated && (
              <button
                type="button"
                className="btn btn-ghost btn-icon tf-navbar__bell"
                onClick={() => setPanelOpen(true)}
                aria-label={`Open notifications${effectiveUnreadCount > 0 ? `, ${effectiveUnreadCount} unread` : ""}`}
              >
                <BellIcon size={18} />
                {effectiveUnreadCount > 0 && (
                  <span className="tf-navbar__badge">
                    {effectiveUnreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={() =>
                setOpenMenuPath(mobileMenuOpen ? null : location.pathname)
              }
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon size={18} />
              ) : (
                <MenuIcon size={18} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="tf-navbar__mobile-drawer container">
            {isAuthenticated ? (
              <div className="tf-navbar__mobile-links">
                <NavLink
                  to="/dashboard"
                  className="tf-navbar__mobile-link"
                  onClick={() => setOpenMenuPath(null)}
                >
                  Trips
                </NavLink>
                <NavLink
                  to="/map"
                  className="tf-navbar__mobile-link"
                  onClick={() => setOpenMenuPath(null)}
                >
                  Map
                </NavLink>
                <NavLink
                  to="/trips/new"
                  className="tf-navbar__mobile-link"
                  onClick={() => setOpenMenuPath(null)}
                >
                  New trip
                </NavLink>
                <NavLink
                  to="/notifications"
                  className="tf-navbar__mobile-link"
                  onClick={() => setOpenMenuPath(null)}
                >
                  Notifications{" "}
                  {effectiveUnreadCount > 0 ? `(${effectiveUnreadCount})` : ""}
                </NavLink>
                <NavLink
                  to="/profile"
                  className="tf-navbar__mobile-link"
                  onClick={() => setOpenMenuPath(null)}
                >
                  Profile ({user?.name})
                </NavLink>
                <NavLink
                  to="/settings"
                  className="tf-navbar__mobile-link"
                  onClick={() => setOpenMenuPath(null)}
                >
                  Settings
                </NavLink>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="tf-navbar__mobile-links">
                <NavLink
                  to="/map"
                  className={({ isActive }) =>
                    `btn ${isActive ? "btn-primary" : "btn-secondary"}`
                  }
                  onClick={() => setOpenMenuPath(null)}
                >
                  Map
                </NavLink>
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  onClick={() => setOpenMenuPath(null)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setOpenMenuPath(null)}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {isAuthenticated && panelOpen && (
        <NotificationsPanel
          onClose={() => setPanelOpen(false)}
          onUnreadCountChange={setUnreadCount}
        />
      )}
    </>
  );
}
