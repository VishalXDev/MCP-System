import { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";

interface Preferences {
  theme: "light" | "dark";
  notifications: boolean;
}

const Settings = () => {
  const [theme, setTheme] = useState<Preferences["theme"]>("light");
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // Track unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  // Watch for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user settings
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setProfilePic(data.profilePic || "");
          setTheme(data.preferences?.theme || "light");
          setNotifications(data.preferences?.notifications ?? true);
        }
      } catch (err) {
        console.error("❌ Error fetching settings:", err);
        setError("Failed to load user settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [currentUser]);

  // Sync theme with HTML class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (file && profilePic.startsWith("blob:")) {
        URL.revokeObjectURL(profilePic);
      }
    };
  }, [file, profilePic]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setProfilePic(URL.createObjectURL(selectedFile));
    setDirty(true);
  };

  const uploadProfilePic = async (): Promise<string | null> => {
    if (!currentUser || !file) return null;

    try {
      const storageRef = ref(storage, `users/${currentUser.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return `${downloadURL}?t=${Date.now()}`;
    } catch (err) {
      console.error("❌ Profile picture upload failed:", err);
      setError("Failed to upload profile picture.");
      return null;
    }
  };

  const saveSettings = async () => {
    if (!currentUser) return;

    setSaving(true);
    setError(null);

    try {
      let imageUrl = profilePic;
      if (file) {
        const uploadedUrl = await uploadProfilePic();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          name,
          profilePic: imageUrl,
          preferences: {
            theme,
            notifications,
          },
        },
        { merge: true }
      );

      setDirty(false);
      toast.success("✅ Settings updated" + (file ? " with new profile picture!" : "!"));
    } catch (err) {
      console.error("❌ Error saving settings:", err);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
        <span className="ml-3">Loading settings...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center text-white p-6">
        <p>You must be logged in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">User Settings</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        {profilePic && (
          <img
            src={profilePic}
            alt="Profile"
            className="w-20 h-20 rounded-full mb-2 object-cover"
          />
        )}
        <label className="block mb-2 font-medium">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />
      </div>

      <label className="block mb-3">
        <span className="block mb-1">Name:</span>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setDirty(true);
          }}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </label>

      <label className="block mb-3">
        <span className="block mb-1">Theme:</span>
        <select
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value as Preferences["theme"]);
            setDirty(true);
          }}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => {
            setNotifications(e.target.checked);
            setDirty(true);
          }}
        />
        <span className="ml-2">Enable Notifications</span>
      </label>

      <button
        onClick={saveSettings}
        disabled={saving}
        className={`w-full py-2 px-4 rounded font-bold transition-all ${
          saving ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default Settings;
