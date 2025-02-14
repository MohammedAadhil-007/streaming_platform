import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar"; // Optional if you have a Navbar

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // List of manually added admins
  const admins = ["admin@example.com"];

  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        {user && <Navbar />} {/* Show navbar only when logged in */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/admin-dashboard"
            element={user && admins.includes(user.email) ? <AdminDashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
