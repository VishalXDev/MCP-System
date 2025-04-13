import jwt_decode from 'jwt-decode'; // Importing jwt-decode as a default import

// Define a type for the decoded token
interface DecodedToken {
  exp: number; // Expiry timestamp in seconds
  [key: string]: unknown; // Allow other fields in the token (optional)
}

// Set the token in localStorage or remove it if null
export const setAuthToken = (token: string | null) => {
  if (token) {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Failed to save token to localStorage:", error);
    }
  } else {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Failed to remove token from localStorage:", error);
    }
  }
};

// Get the token from localStorage and check if it has expired
export const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem("token");

    // If no token found, return null
    if (!token) return null;

    // Decode the JWT token to check expiration
    const decoded: DecodedToken = jwt_decode(token); // Using the * as import here

    // Check if the token has expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token"); // Remove expired token
      return null;
    }

    // Return the token if it's still valid
    return token;
  } catch (error) {
    console.error("Error retrieving token from localStorage:", error);
    return null;
  }
};
