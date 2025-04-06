import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(auth);
        toast.success("✅ Successfully signed out!");
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("❌ Sign out failed:", error);
        toast.error("Error signing out. Please try again.");
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto mb-3" />
        <p>Signing you out...</p>
      </div>
    </div>
  );
};

export default SignOut;
