import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Box } from "lucide-react";

export default function SelectSportPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startIndex, setStartIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (response.ok) {
          const data = await response.json();
          console.log(" Products fetched:", data);
          setProducts(data);
          if (data.length === 0) {
            console.log("No products in database, will show fallback");
          }
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const baseSpots = [
    {
      name: "Cricket Jersey",
      sport: "Cricket",
      image: "/assets/cricket.png",
      defaultPrice: 1500,
    },
    {
      name: "Football Jersey",
      sport: "Football",
      image: "/assets/football.png",
      defaultPrice: 1500,
    },
    {
      name: "Rugby Jersey",
      sport: "Rugby",
      image: "/assets/rugby.png",
      defaultPrice: 1500,
    },
    {
      name: "Volleyball Jersey",
      sport: "Volleyball",
      image: "/assets/volleyball.png",
      defaultPrice: 1500,
    },
    {
      name: "Basketball Jersey",
      sport: "Basketball",
      image: "/assets/basketball.png",
      defaultPrice: 1500,
    },
    {
      name: "Hockey Jersey",
      sport: "Hockey",
      image: "/assets/hockey.avif",
      defaultPrice: 1500,
    },
  ];

  const displaySports = baseSpots.map((baseSport, index) => {
    // Check if this sport exists in database
    const dbProduct = products.find((p) => p.name === baseSport.name);

    if (dbProduct) {
      // Use database product data
      return {
        id: dbProduct.id,
        name: baseSport.sport,
        image: baseSport.image,
        dbProduct: dbProduct,
        isFromDatabase: true,
      };
    } else {
      return {
        id: index + 1000,
        name: baseSport.sport,
        image: baseSport.image,
        dbProduct: {
          id: index + 1000,
          name: baseSport.name,
          price: baseSport.defaultPrice,
          status: "demo",
        },
        isFromDatabase: false,
      };
    }
  });

  const handleNext = () => {
    if (startIndex + 3 < displaySports.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleSelect = (index) => {
    setFlippedIndex(index);
  };

  const handleCancel = () => {
    setFlippedIndex(null);
  };

  const handleFitSelect = (sport, fit) => {
    if (!sport || !sport.name || !fit) {
      console.error("Invalid sport or fit data:", { sport, fit });
      return;
    }

    // Pass the product_id from database
    navigate(`/customize/${sport.name.toLowerCase()}/${fit.toLowerCase()}`, {
      state: { product_id: sport.id, product: sport.dbProduct },
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sports...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold font-michroma">Design Your Legacy</h1>
        <p className="text-sm text-gray-500 mt-2">
          Select a sport to begin your custom jersey creation journey.
        </p>

        <div className="relative mt-10 max-w-5xl mx-auto px-4 overflow-hidden">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${startIndex * (100 / 3)}%)`,
                width: `${(displaySports.length * 100) / 7}%`,
              }}
            >
              {displaySports.map((sport, index) => (
                <div
                  key={index}
                  className={`w-[300px] h-[480px] flex-shrink-0 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 ${
                    flippedIndex === index ? "animate-border-glow" : ""
                  }`}
                >
                  <div className="relative w-full h-full [perspective:1000px]">
                    <div
                      className={`relative w-full h-full duration-700 [transform-style:preserve-3d] ${
                        flippedIndex === index ? "rotate-y-180" : ""
                      }`}
                    >
                      {/* Front */}
                      <div className="absolute w-full h-full backface-hidden">
                        <div className="bg-white border rounded-md shadow p-4 text-center h-full flex flex-col">
                          {/* Product Info */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>
                                {sport.isFromDatabase ? "Available" : "Demo"}
                              </span>
                              <span>Rs. {sport.dbProduct.price}</span>
                            </div>
                          </div>

                          {/* 2D Image */}
                          <div className="flex-1 flex flex-col justify-center">
                            <img
                              src={sport.image}
                              alt={sport.name}
                              className="h-[200px] mx-auto mb-2 object-contain"
                            />

                            {/* 3D Model Preview */}
                            <div
                              className={`rounded-lg p-3 mb-3 ${
                                sport.isFromDatabase
                                  ? "bg-green-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center justify-center text-gray-600">
                                <Box className="mr-2" size={20} />
                                <span className="text-sm">
                                  {sport.isFromDatabase
                                    ? "3D Model Available"
                                    : "3D Model Unavailable"}
                                </span>
                              </div>
                              {sport.isFromDatabase &&
                                sport.name.toLowerCase() === "cricket" && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    Interactive 3D Jersey Preview
                                  </p>
                                )}
                              {!sport.isFromDatabase && (
                                <p className="text-xs text-orange-600 mt-1">
                                  3D Model will be available soon
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-lg mb-1">
                              {sport.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {sport.dbProduct.name}
                            </p>
                            <button
                              onClick={() => handleSelect(index)}
                              className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:scale-95 transition"
                            >
                              Select Sport
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-tr from-yellow-100 to-white border shadow p-4 flex flex-col items-center justify-center relative rounded-md">
                        {/* Cancel button */}
                        <button
                          onClick={handleCancel}
                          className="absolute bottom-1 right-1/2 translate-x-1/2 bg-gray-200 hover:bg-red-400 text-black p-1 rounded-full shadow"
                        >
                          <X size={18} />
                        </button>

                        {/* Car and message */}
                        <img
                          src="/assets/logo.png"
                          className="w-24 animate-carZoom mb-4"
                          alt="Car"
                        />
                        <p className="text-lg font-semibold text-gray-800 mb-4 font-michroma">
                          Choose Your Perfect Fit
                        </p>

                        {/* Fit options */}
                        <div className="grid grid-cols-2 gap-2">
                          {["Mens", "Womens", "Kids", "Unisex"].map((fit) => (
                            <button
                              key={fit}
                              onClick={() => handleFitSelect(sport, fit)}
                              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:scale-95 transition text-sm"
                            >
                              {fit}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={startIndex + 3 >= displaySports.length}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
