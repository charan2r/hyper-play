import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CustomDesignPage = () => {
  const navigate = useNavigate();
  const [selectedJersey, setSelectedJersey] = useState(null);

  const jerseyTypes = [
    {
      id: 1,
      name: "Full Sleeve",
      image: "/assets/cricket/full.png",
      description: "Complete coverage with full sleeves",
    },
    {
      id: 2,
      name: "Half Sleeve",
      image: "/assets/cricket/half.png",
      description: "Classic half sleeve design",
    },
    {
      id: 3,
      name: "Arm Cut",
      image: "/assets/cricket/arm.png",
      description: "Sleeveless arm cut style",
    },
  ];

  const handleJerseySelect = (jersey) => {
    setSelectedJersey(jersey);
  };

  const handleCustomize = () => {
    if (selectedJersey) {
      navigate("/design-editor", {
        state: {
          sport: "custom",
          fit: "unisex",
          style: selectedJersey.name,
          image: selectedJersey.image,
        },
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-600/20 via-gray-900 to-black text-white overflow-hidden ">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.4) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Customize Your</span>
            <br />
            <span className="text-green-400">Own Design</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl mb-12 font-medium max-w-3xl mx-auto text-gray-200">
            Choose your preferred jersey style and start creating your unique
            design
          </p>

          {/* Jersey Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            {jerseyTypes.map((jersey) => (
              <div
                key={jersey.id}
                onClick={() => handleJerseySelect(jersey)}
                className={`group cursor-pointer bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  selectedJersey?.id === jersey.id
                    ? "border-green-400 bg-green-400/10 shadow-lg shadow-green-400/20"
                    : "border-gray-600 hover:border-green-400/50"
                }`}
              >
                {/* Jersey Image */}
                <div className="relative h-48 mb-4 flex items-center justify-center">
                  <img
                    src={jersey.image}
                    alt={jersey.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Selection Indicator */}
                  {selectedJersey?.id === jersey.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Jersey Info */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                  {jersey.name}
                </h3>
                <p className="text-gray-400 text-sm">{jersey.description}</p>
              </div>
            ))}
          </div>

          {/* Customize Button */}
          <button
            onClick={handleCustomize}
            disabled={!selectedJersey}
            className={`px-10 py-4 text-xl font-bold rounded-lg transition-all duration-300 transform shadow-lg ${
              selectedJersey
                ? "bg-green-500 text-black hover:bg-green-400 hover:scale-105 cursor-pointer"
                : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            {selectedJersey ? (
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                START CUSTOMIZING
              </span>
            ) : (
              "SELECT A JERSEY FIRST"
            )}
          </button>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2">
                Easy Design Tools
              </h4>
              <p className="text-gray-400 text-sm">
                Intuitive drag-and-drop design interface
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2">Quick Preview</h4>
              <p className="text-gray-400 text-sm">
                See your design in real-time
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2">Premium Quality</h4>
              <p className="text-gray-400 text-sm mb-5">
                Professional-grade materials and printing
              </p>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 border-2 border-green-400/40 rounded-full animate-pulse hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 border-2 border-gray-400/30 rounded-full animate-pulse hidden lg:block"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 border border-green-300/20 rounded-full animate-pulse hidden lg:block"></div>
      </section>

      <Footer />
    </>
  );
};

export default CustomDesignPage;
