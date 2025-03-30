import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getUserRole } from "../firebase/roleUtils";
import AdminControls from "../components/AdminControls";
import { onAuthStateChanged } from "firebase/auth";

const Settings = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [role, setRole] = useState<string>("staff");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTheme(data.preferences?.theme || "light");
          setNotifications(data.preferences?.notifications ?? true);
          setRole(await getUserRole(user.uid));
        }
      } catch (err) {
        setError("Failed to load settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { preferences: { theme, notifications } }, { merge: true });
      alert("Settings saved successfully!");
    } catch {
      alert("Failed to save settings. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-white">Loading settings...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">User Settings</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Theme:</label>
        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value as "light" | "dark")}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="mb-4 flex items-center">
        <input 
          type="checkbox" 
          checked={notifications} 
          onChange={(e) => setNotifications(e.target.checked)} 
          className="mr-2"
        />
        <span className="font-semibold">Enable Notifications</span>
      </div>

      <button 
        onClick={saveSettings} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        Save Settings
      </button>

      {role === "admin" && <AdminControls />}
    </div>
  );
};

export default Settings;
