import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getUserRole } from "../firebase/roleUtils";
import AdminControls from "../components/AdminControls";
import { onAuthStateChanged, User } from "firebase/auth";

const Settings = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [role, setRole] = useState<"staff" | "manager" | "admin">("staff");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchSettings(currentUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSettings = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        interface UserPreferences {
          preferences?: {
            theme?: "light" | "dark";
            notifications?: boolean;
          };
        }
        const data = docSnap.data() as UserPreferences;
        setTheme(data?.preferences?.theme ?? "light");
        setNotifications(data?.preferences?.notifications ?? true);
      }

      try {
        const userRole = await getUserRole(userId);
        setRole(userRole as "staff" | "manager" | "admin");
      } catch {
        setRole("staff");
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
      setError("⚠️ Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setSaveStatus(null);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          preferences: {
            theme,
            notifications,
          },
        },
        { merge: true }
      );
      setSaveStatus("✅ Settings saved successfully!");
    } catch (err) {
      console.error("Settings save error:", err);
      setSaveStatus("❌ Failed to save settings. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-white">Loading settings...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">User Settings</h2>

      <div className="space-y-4">
        {/* Theme */}
        <div>
          <label htmlFor="theme-select" className="block mb-2 font-medium">
            Theme:
          </label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value as "light" | "dark")}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="notifications" className="font-medium">
            Enable Notifications
          </label>
        </div>

        {/* Save button */}
        <button
          onClick={saveSettings}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Save Settings
        </button>

        {/* Save status message */}
        {saveStatus && (
          <p
            className={`text-center mt-2 font-medium ${
              saveStatus.includes("Failed") ? "text-red-400" : "text-green-400"
            }`}
          >
            {saveStatus}
          </p>
        )}
      </div>

      {/* Admin-only section */}
      {role === "admin" && (
        <div className="mt-6">
          <AdminControls />
        </div>
      )}
    </div>
  );
};

export default Settings;
