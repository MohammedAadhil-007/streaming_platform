import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const adminEmails = ["admin@example.com", "youradminemail@gmail.com"]; // ✅ Change this to your admins

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Toggle between User/Admin
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

      // ✅ Redirect Admins & Users properly
      if (isAdmin && adminEmails.includes(user.email)) {
        navigate("/admin-dashboard");
      } else if (!isAdmin) {
        navigate("/home");
      } else {
        setError("You are not authorized as an Admin.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center">{isLogin ? "Login" : "Sign Up"}</h2>

        {/* ✅ Toggle between User and Admin */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className={`px-4 py-2 rounded-lg ${!isAdmin ? "bg-blue-500 text-white" : "bg-gray-600"}`}
            onClick={() => { setIsAdmin(false); setIsLogin(true); }} // ✅ Users can sign up
          >
            User
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${isAdmin ? "bg-green-500 text-white" : "bg-gray-600"}`}
            onClick={() => { setIsAdmin(true); setIsLogin(true); }} // ✅ Admins can only log in
          >
            Admin
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleAuth} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 text-black rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 text-black rounded"
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

        {/* ✅ Hide Sign-Up Option for Admins */}
        {!isAdmin && (
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
