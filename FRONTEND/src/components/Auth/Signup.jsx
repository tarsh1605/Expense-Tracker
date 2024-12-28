import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData.username, formData.email, formData.password);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-blue-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900 animate-slide-down">
            Create Account
          </h2>
          <p className="mt-2 text-blue-600 animate-slide-up">
            Join us to start tracking your expenses
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200
                       hover:border-blue-400"
            />
          </div>

          <div className="space-y-1">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200
                       hover:border-blue-400"
            />
          </div>

          <div className="space-y-1">
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200
                       hover:border-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md 
                     hover:bg-blue-700 hover:scale-105 hover:shadow-lg
                     transform transition-all duration-300 ease-in-out
                     animate-bounce-gentle"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
export default Signup;
