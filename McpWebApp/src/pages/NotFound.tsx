import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-300 mt-2">Oops! Page Not Found.</p>
      <p className="text-gray-500">The page you're looking for doesn’t exist.</p>

      {/* 🔄 Go Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-5 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
      >
        Go Home
      </button>
    </motion.div>
  );
};

export default NotFound;
