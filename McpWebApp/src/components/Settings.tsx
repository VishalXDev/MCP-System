import { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 🔹 Loading state for better UX
  const [saving, setSaving] = useState(false); // 🔹 Disable Save button while processing

  const user = auth.currentUser;

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
          setName(data.name || "");
          setProfilePic(data.profilePic || "");
          setTheme(data.preferences?.theme || "light");
          setNotifications(data.preferences?.notifications ?? true);
        }
      } catch (error) {
        console.error("❌ Error fetching user settings:", error);
        setError("Failed to load settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type (optional)
      if (!selectedFile.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }

      // Validate file size (optional, e.g., max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB.");
        return;
      }

      setFile(selectedFile);
      setProfilePic(URL.createObjectURL(selectedFile)); // Show preview
    }
  };

  const uploadProfilePic = async (): Promise<string | null> => {
    if (!user || !file) return null;

    try {
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("❌ Error uploading profile picture:", error);
      setError("Failed to upload profile picture.");
      return null;
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);

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

      alert("✅ Settings saved!");
    } catch (error) {
      console.error("❌ Error saving settings:", error);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        <span className="ml-3">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">User Settings</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Profile Picture Upload */}
      <div className="mb-4">
        {profilePic && (
          <img src={profilePic} alt="Profile" className="w-20 h-20 rounded-full mb-2" />
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="block" />
      </div>

      {/* Name Input */}
      <label className="block mb-2">
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="ml-2 p-2 rounded bg-gray-700 text-white w-full"
        />
      </label>

      {/* Theme Selector */}
      <label className="block mb-2">
        Theme:
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="ml-2 p-2 rounded bg-gray-700 text-white"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      {/* Notification Toggle */}
      <label className="block mb-4">
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        <span className="ml-2">Enable Notifications</span>
      </label>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        disabled={saving}
        className={`py-2 px-4 rounded font-bold transition-all ${
          saving ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default Settings;
