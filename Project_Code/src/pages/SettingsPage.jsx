import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useAuth } from "../context/useAuth";
import { applyTheme, getSavedTheme } from "../utils/theme";
import "./SettingsPage.css";

const PREFS_KEY = "tripforge_notification_prefs";

function loadNotificationPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore storage access errors
  }
  return {
    itinerary: true,
    ideasAndPolls: true,
    expenses: true,
    discussion: true,
  };
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(getSavedTheme);
  const [prefs, setPrefs] = useState(loadNotificationPrefs);
  const [savedToast, setSavedToast] = useState("");

  function handleThemeChange(nextTheme) {
    const applied = applyTheme(nextTheme);
    setTheme(applied);
    setSavedToast(
      `Switched to ${applied === 'dark' ? 'dark obsidian' : 'off-white light'} mode.`
    );
  }

  function handlePrefToggle(key) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
    setSavedToast("Notification preference updated.");
  }

  async function handleSignOut() {
    await logout();
    navigate("/");
  }

  return (
    <main className="container page-section">
      <div className="tf-settings__wrap">
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">
              Customize appearance and in-app notification preferences.
            </p>
          </div>
          {savedToast && (
            <span className="badge" role="status">
              {savedToast}
            </span>
          )}
        </div>

        <div className="tf-settings__stack">
          <Card
            title="Appearance"
            subtitle="Switch between warm off-white light and dark obsidian espresso modes."
          >
            <div
              className="tf-settings__theme-grid"
              role="radiogroup"
              aria-label="Theme mode"
            >
              <button
                type="button"
                role="radio"
                aria-checked={theme === "light"}
                className={`tf-settings__theme-option ${
                  theme === "light" ? "tf-settings__theme-option--active" : ""
                }`}
                onClick={() => handleThemeChange("light")}
              >
                <span
                  className="tf-settings__swatch tf-settings__swatch--light"
                  aria-hidden="true"
                />
                <div>
                  <p className="tf-settings__option-title">Off-white light</p>
                  <p className="tf-settings__option-desc">
                    Warm alabaster and raw linen with smoked espresso accents
                  </p>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={theme === "dark"}
                className={`tf-settings__theme-option ${
                  theme === "dark" ? "tf-settings__theme-option--active" : ""
                }`}
                onClick={() => handleThemeChange("dark")}
              >
                <span
                  className="tf-settings__swatch tf-settings__swatch--dark"
                  aria-hidden="true"
                />
                <div>
                  <p className="tf-settings__option-title">Obsidian & bronze</p>
                  <p className="tf-settings__option-desc">
                    Deep roasted obsidian surfaces with burnished gold bronze
                  </p>
                </div>
              </button>
            </div>
          </Card>

          <Card
            title="In-app notifications"
            subtitle="Choose which workspace updates appear in your notification panel."
          >
            <div className="tf-settings__toggles">
              <label
                className="tf-settings__toggle-row"
                htmlFor="pref-itinerary"
              >
                <div>
                  <p className="tf-settings__option-title">Itinerary updates</p>
                  <p className="tf-settings__option-desc">
                    When members add, edit, or move trip activities
                  </p>
                </div>
                <input
                  id="pref-itinerary"
                  type="checkbox"
                  className="tf-settings__checkbox"
                  checked={prefs.itinerary}
                  onChange={() => handlePrefToggle("itinerary")}
                />
              </label>

              <label className="tf-settings__toggle-row" htmlFor="pref-polls">
                <div>
                  <p className="tf-settings__option-title">Ideas &amp; polls</p>
                  <p className="tf-settings__option-desc">
                    When new ideas are suggested or a poll opens and closes
                  </p>
                </div>
                <input
                  id="pref-polls"
                  type="checkbox"
                  className="tf-settings__checkbox"
                  checked={prefs.ideasAndPolls}
                  onChange={() => handlePrefToggle("ideasAndPolls")}
                />
              </label>

              <label
                className="tf-settings__toggle-row"
                htmlFor="pref-expenses"
              >
                <div>
                  <p className="tf-settings__option-title">Expense entries</p>
                  <p className="tf-settings__option-desc">
                    When shared group expenses are logged
                  </p>
                </div>
                <input
                  id="pref-expenses"
                  type="checkbox"
                  className="tf-settings__checkbox"
                  checked={prefs.expenses}
                  onChange={() => handlePrefToggle("expenses")}
                />
              </label>

              <label
                className="tf-settings__toggle-row"
                htmlFor="pref-discussion"
              >
                <div>
                  <p className="tf-settings__option-title">
                    Discussion replies
                  </p>
                  <p className="tf-settings__option-desc">
                    When members post notes or reply to threads
                  </p>
                </div>
                <input
                  id="pref-discussion"
                  type="checkbox"
                  className="tf-settings__checkbox"
                  checked={prefs.discussion}
                  onChange={() => handlePrefToggle("discussion")}
                />
              </label>
            </div>
          </Card>

          <Card
            title="Account session"
            subtitle="Currently active authentication session."
          >
            <div className="tf-settings__account-row">
              <div>
                <p className="tf-settings__option-title">{user?.name}</p>
                <p className="tf-settings__option-desc">{user?.email}</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
