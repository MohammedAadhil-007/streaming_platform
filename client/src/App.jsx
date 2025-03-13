import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { adminEmails } from "./config";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import EditVideo from "./components/EditVideo"; // ✅ Add this line


function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Prevents flickering on refresh

  useEffect(() => {
    const initAuth = async () => {
      await setPersistence(auth, browserLocalPersistence); // ✅ Ensure session persistence

      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsAdmin(currentUser ? adminEmails.includes(currentUser.email) : false);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    initAuth();
  }, []);

  if (loading) return <div className="text-center text-white mt-10">Loading...</div>; // ✅ Prevents flicker

  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
          <Route path="/admin-dashboard" element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/edit/:id" element={<EditVideo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
