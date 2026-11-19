import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";
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
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(getSavedTheme);
  const [prefs, setPrefs] = useState(loadNotificationPrefs);
  const [savedToast, setSavedToast] = useState("");

  function handleThemeChange(nextTheme) {
    const applied = applyTheme(nextTheme);
    setTheme(applied);
    setSavedToast(
      language === "bn"
        ? `${applied === "dark" ? "ডার্ক অবসিডিয়ান" : "অফ-হোয়াইট লাইট"} থিমে পরিবর্তিত হয়েছে।`
        : `Switched to ${applied === "dark" ? "dark obsidian" : "off-white light"} mode.`,
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
    setSavedToast(
      language === "bn"
        ? "বিজ্ঞপ্তি পছন্দসমূহ আপডেট করা হয়েছে।"
        : "Notification preference updated.",
    );
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
            <h1 className="page-title">{t("settings.title", "Settings")}</h1>
            <p className="page-subtitle">
              {t(
                "settings.subtitle",
                "Customize appearance, display language, and in-app notification preferences.",
              )}
            </p>
          </div>
          {savedToast && (
            <span className="badge" role="status">
              {savedToast}
            </span>
          )}
        </div>

        <div className="tf-settings__stack">
          {/* Display Language Selection */}
          <Card
            title={t("settings.languageTitle", "Display Language")}
            subtitle={t(
              "settings.languageSubtitle",
              "Switch the interface language between English and বাংলা (Bangla). You can also toggle anytime using the translate icon in the navigation bar.",
            )}
          >
            <div
              className="tf-settings__theme-grid"
              role="radiogroup"
              aria-label="Display language"
            >
              <button
                type="button"
                role="radio"
                aria-checked={language === "en"}
                className={`tf-settings__theme-option ${
                  language === "en" ? "tf-settings__theme-option--active" : ""
                }`}
                onClick={() => {
                  setLanguage("en");
                  setSavedToast("Language set to English.");
                }}
              >
                <span
                  className="tf-settings__swatch tf-settings__swatch--light"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                  aria-hidden="true"
                >
                  EN
                </span>
                <div>
                  <p className="tf-settings__option-title">
                    {t("settings.langEn", "English")}
                  </p>
                  <p className="tf-settings__option-desc">
                    {t("settings.langEnDesc", "Standard English interface")}
                  </p>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={language === "bn"}
                className={`tf-settings__theme-option ${
                  language === "bn" ? "tf-settings__theme-option--active" : ""
                }`}
                onClick={() => {
                  setLanguage("bn");
                  setSavedToast("ভাষা বাংলায় পরিবর্তিত হয়েছে।");
                }}
              >
                <span
                  className="tf-settings__swatch tf-settings__swatch--dark"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "11px",
                    color: "var(--accent-sun)",
                  }}
                  aria-hidden="true"
                >
                  বাং
                </span>
                <div>
                  <p className="tf-settings__option-title">
                    {t("settings.langBn", "বাংলা (Bangla)")}
                  </p>
                  <p className="tf-settings__option-desc">
                    {t("settings.langBnDesc", "সহজ ও সাবলীল বাংলা ইন্টারফেস")}
                  </p>
                </div>
              </button>
            </div>
          </Card>

          <Card
            title={t("settings.appearance", "Appearance")}
            subtitle={t(
              "settings.appearanceDesc",
              "Switch between warm off-white light and dark obsidian espresso modes.",
            )}
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
                  <p className="tf-settings__option-title">
                    {t("settings.lightMode", "Off-white light")}
                  </p>
                  <p className="tf-settings__option-desc">
                    {t(
                      "settings.lightModeDesc",
                      "Warm alabaster and raw linen with smoked espresso accents",
                    )}
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
                  <p className="tf-settings__option-title">
                    {t("settings.darkMode", "Obsidian & bronze")}
                  </p>
                  <p className="tf-settings__option-desc">
                    {t(
                      "settings.darkModeDesc",
                      "Deep roasted obsidian surfaces with burnished gold bronze",
                    )}
                  </p>
                </div>
              </button>
            </div>
          </Card>

          <Card
            title={t("settings.notifications", "In-app notifications")}
            subtitle={t(
              "settings.notificationsDesc",
              "Choose which workspace updates appear in your notification panel.",
            )}
          >
            <div className="tf-settings__toggles">
              <label
                className="tf-settings__toggle-row"
                htmlFor="pref-itinerary"
              >
                <div>
                  <p className="tf-settings__option-title">
                    {t("settings.prefItinerary", "Itinerary updates")}
                  </p>
                  <p className="tf-settings__option-desc">
                    {t(
                      "settings.prefItineraryDesc",
                      "When members add, edit, or move trip activities",
                    )}
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
                  <p className="tf-settings__option-title">
                    {t("settings.prefPolls", "Ideas & polls")}
                  </p>
                  <p className="tf-settings__option-desc">
                    {t(
                      "settings.prefPollsDesc",
                      "When new ideas are suggested or a poll opens and closes",
                    )}
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
                  <p className="tf-settings__option-title">
                    {t("settings.prefExpenses", "Expense entries")}
                  </p>
                  <p className="tf-settings__option-desc">
                    {t(
                      "settings.prefExpensesDesc",
                      "When shared group expenses are logged",
                    )}
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
                    {t("settings.prefDiscussion", "Discussion replies")}
                  </p>
                  <p className="tf-settings__option-desc">
                    {t(
                      "settings.prefDiscussionDesc",
                      "When members post notes or reply to threads",
                    )}
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
            title={t("settings.account", "Account session")}
            subtitle={t(
              "settings.accountDesc",
              "Currently active authentication session.",
            )}
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
                {t("nav.signOut", "Sign out")}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
