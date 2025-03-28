import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MCPDashboard from "./pages/MCPDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MCPDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
