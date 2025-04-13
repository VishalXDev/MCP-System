import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 | Page Not Found";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4"
      role="alert"
    >
      <h1 className="text-[8rem] font-extrabold text-red-600 leading-none drop-shadow-md">
        404
      </h1>

      <h2 className="text-2xl font-semibold text-gray-800 mt-2">
        Oops! Page Not Found
      </h2>

      <p className="text-gray-500 mt-1 mb-4 max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-4 px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        aria-label="Return to homepage"
      >
        🔙 Go to Homepage
      </button>
    </motion.div>
  );
};

export default NotFound;
