import { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase"; // Import Firebase Storage
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state for UI feedback

  const user = auth.currentUser;

  // Fetch user settings & profile from Firebase
  useEffect(() => {
    if (user) {
      const fetchSettings = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || "");
            setProfilePic(data.profilePic || "");
            setTheme(data.preferences?.theme || "light");
            setNotifications(data.preferences?.notifications ?? true);
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error fetching user settings:", error.message);
            setError("Failed to load settings. Please try again.");
          }
        }
      };
      fetchSettings();
    }
  }, [user]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Upload profile picture
  const uploadProfilePic = async () => {
    if (!user || !file) return null;

    try {
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error uploading profile picture:", error.message);
        setError("Failed to upload profile picture.");
      }
      return null;
    }
  };

  // Save user settings & profile update
  const saveSettings = async () => {
    if (!user) return;

    try {
      let imageUrl = profilePic;
      if (file) {
        const uploadedUrl = await uploadProfilePic();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { 
        name, 
        profilePic: imageUrl, 
        preferences: { theme, notifications } 
      }, { merge: true });

      alert("Settings saved!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving settings:", error.message);
        setError("Failed to save settings. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">User Settings</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Profile Picture Upload */}
      <div className="mb-4">
        {profilePic && <img src={profilePic} alt="Profile" className="w-20 h-20 rounded-full mb-2" />}
        <input type="file" accept="image/*" onChange={handleFileChange} className="block" />
      </div>

      {/* Name Input */}
      <label className="block mb-2">
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="ml-2 p-2 rounded bg-gray-700 text-white"
        />
      </label>

      {/* Theme Selector */}
      <label className="block mb-2">
        Theme:
        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="ml-2 p-2 rounded bg-gray-700">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      {/* Notification Toggle */}
      <label className="block mb-4">
        <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
        Enable Notifications
      </label>

      {/* Save Button */}
      <button onClick={saveSettings} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
