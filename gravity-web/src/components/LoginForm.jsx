import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { navigateBasedOnRole } from "../utils/navigation";
import logoNoBg from '../assets/logo-nobg.png'

const LoginForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCred = await signInWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCred.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      const userData = userDoc.data();

      navigateBasedOnRole(userData.role, navigate);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Left Side Image */}
        <div className="w-1/2 bg-cover bg-center hidden md:block" style={{ backgroundImage: `url(${logoNoBg})` }}></div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome To Gravity!!</h2>
        
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
