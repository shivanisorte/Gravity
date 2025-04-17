import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { navigateBasedOnRole } from "../utils/navigation";

const SignupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    gender: "",
    team: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        ...form,
        createdAt: new Date(),
        managerId: form.role === "employee" ? "mgr001" : null, // Optional
      });

      navigateBasedOnRole(form.role, navigate);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <form onSubmit={handleSignup} className="p-4 flex flex-col gap-3">
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      
      <select name="role" onChange={handleChange}>
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
        <option value="hr">HR/Admin</option>
      </select>

      <input name="gender" placeholder="Gender" onChange={handleChange} />
      <input name="team" placeholder="Team" onChange={handleChange} />
      <input name="location" placeholder="Location" onChange={handleChange} />

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
