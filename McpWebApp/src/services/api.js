import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api"; // Ensure this is set

export const fetchOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/orders`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
};
const API_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchOrders = async () => {
    const response = await fetch(`${API_URL}/orders`);
    return response.json();
};
