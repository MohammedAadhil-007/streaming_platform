import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { adminEmails } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false); // ✅ Separate admin toggle
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      if (storedUser.isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      const isAdminUser = adminEmails.includes(user.email); // ✅ Check if user is an admin

      // ✅ Prevent Admins from logging in through User login
      if (!isAdminLogin && isAdminUser) {
        setError("Admins must log in using the Admin login.");
        return;
      }

      // ✅ Prevent Users from logging in through Admin login
      if (isAdminLogin && !isAdminUser) {
        setError("Only admins can log in here.");
        return;
      }

      // ✅ Store user type in localStorage
      localStorage.setItem("user", JSON.stringify({ email: user.email, isAdmin: isAdminUser }));

      // ✅ Redirect to the correct dashboard
      if (isAdminUser) {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? (isAdminLogin ? "Admin Login" : "User Login") : "Sign Up"}
        </h2>

        <div className="flex justify-center gap-4 mt-4">
          <button
            className={`px-4 py-2 rounded-lg ${!isAdminLogin ? "bg-blue-500 text-white" : "bg-gray-600"}`}
            onClick={() => setIsAdminLogin(false)}
          >
            User Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${isAdminLogin ? "bg-green-500 text-white" : "bg-gray-600"}`}
            onClick={() => setIsAdminLogin(true)}
          >
            Admin Login
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleAuth} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {!isAdminLogin && (
          <p
            className="mt-3 text-center cursor-pointer text-blue-400 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create an account" : "Already have an account? Login"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
