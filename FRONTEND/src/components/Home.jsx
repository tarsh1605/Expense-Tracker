import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSigup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-blue-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-blue-900 animate-slide-down">
            Welcome to Expense Tracker
          </h1>
          <p className="text-xl text-blue-600 animate-slide-up">
            Track your expenses effortlessly
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md 
                     hover:bg-blue-700 hover:scale-105 hover:shadow-lg
                     transform transition-all duration-300 ease-in-out
                     animate-bounce-gentle"
          >
            LOG IN
          </button>
          <button
            onClick={handleSigup}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md 
                     border border-blue-600 hover:bg-blue-50 hover:scale-105 hover:shadow-lg
                     transform transition-all duration-300 ease-in-out
                     animate-bounce-gentle"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};
export default Home;
