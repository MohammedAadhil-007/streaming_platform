import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const adminEmails = ["admin@example.com"]; // Replace with your admin email(s)

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      let userCredential;
      if (isLogin) {
        // User Login
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // User Registration
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;

      if (adminEmails.includes(user.email)) {
        navigate("/admin-dashboard"); // Redirect admin
      } else {
        navigate("/home"); // Redirect user
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center">{isLogin ? "Login" : "Sign Up"}</h2>

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

        <p
          className="mt-3 text-center cursor-pointer text-blue-400 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create an account" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
