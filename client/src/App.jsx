import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { adminEmails } from "./config"; // ✅ Import adminEmails
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser ? adminEmails.includes(currentUser.email) : false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
          <Route path="/admin-dashboard" element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
