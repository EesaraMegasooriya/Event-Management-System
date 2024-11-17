import React, { useState } from "react";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold">
          EM Events
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          <a href="/dashboard" className="hover:text-gray-400">
            Dashboard
          </a>
          <a href="/calendar" className="hover:text-gray-400">
            Calender
          </a>
          {/* <a href="/add-event" className="hover:text-gray-400">
            Add Event
          </a> */}
          <a href="/group-management" className="hover:text-gray-400">
            Group Management
          </a>
          {/* <a href="/event" className="hover:text-gray-400">
            View Event
          </a> */}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 focus:outline-none focus:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-2 p-4">
          <a href="/dashboard" className="hover:text-gray-400">
            Dashboard
          </a>
          <a href="/calendar" className="hover:text-gray-400">
            Calender
          </a>
          {/* <a href="/add-event" className="hover:text-gray-400">
            Add Event
          </a> */}
          <a href="/group-management" className="hover:text-gray-400">
            Group Management
          </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
