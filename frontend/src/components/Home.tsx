import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/dashboard'); // Navigate to the dashboard
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white">
      {/* Main Content */}
      <div className="text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome to EM Events</h1>
        <p className="text-lg md:text-xl lg:text-2xl font-light">
          A platform to seamlessly manage your events and groups
        </p>
      </div>

      {/* Call to Action */}
      <div className="mt-8">
        <button
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
          onClick={handleNavigation}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
