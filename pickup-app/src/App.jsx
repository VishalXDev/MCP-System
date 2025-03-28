import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PickupDashboard from "./pages/PickupDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PickupDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
