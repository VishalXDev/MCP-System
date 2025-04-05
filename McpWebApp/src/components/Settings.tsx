import { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5MB.");
      return;
    }

    setFile(selectedFile);
    setProfilePic(URL.createObjectURL(selectedFile)); // preview
  };

  const uploadProfilePic = async (): Promise<string | null> => {
    if (!user || !file) return null;

    try {
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return `${downloadURL}?t=${Date.now()}`; // cache-busting
    } catch (error) {
      console.error("❌ Error uploading profile pic:", error);
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

      toast.success("✅ Settings saved!");
    } catch (error) {
      console.error("❌ Error saving settings:", error);
      toast.error("Failed to save settings.");
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

      <div className="mb-4">
        {profilePic && (
          <img src={profilePic} alt="Profile" className="w-20 h-20 rounded-full mb-2" />
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="block" />
      </div>

      <label className="block mb-2">
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="ml-2 p-2 rounded bg-gray-700 text-white w-full"
        />
      </label>

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

      <label className="block mb-4">
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        <span className="ml-2">Enable Notifications</span>
      </label>

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
