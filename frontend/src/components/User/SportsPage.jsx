import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Grid, List, Search, Star } from "lucide-react";

const SportsPage = () => {
  const [searchParams] = useSearchParams();
  const { sport } = useParams();
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/customer/products"
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Sports Products fetched:", data);
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

  // Handle URL parameters for sport filtering
  useEffect(() => {
    const sportParam = searchParams.get("sport") || sport;

    if (sportParam) {
      setSelectedSport(sportParam);
    }
  }, [searchParams, sport]);

  const sports = [
    "All",
    "Cricket",
    "Football",
    "Rugby",
    "Volleyball",
    "Basketball",
    "Hockey",
  ];

  const categories = [
    "All",
    "Jerseys",
    "Tracksuits",
    "Bottoms & Shorts",
    "Lifestyle Kits",
    "Hoodies",
    "Accessories",
  ];

  const displayProducts = products.length > 0 ? products : [];

  // Filter products based on sport, category, and search term
  const filteredProducts = displayProducts.filter((product) => {
    const matchesSport =
      selectedSport === "All" ||
      product.sport === selectedSport ||
      product.sport === "All";
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSport && matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const ProductCard = ({ product }) => (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={() => {
        window.location.href = `/products/${product.id}`;
      }}
    >
      {product.isBestseller && (
        <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 absolute z-10 rounded-br-lg">
          BESTSELLER
        </div>
      )}
      <div className="relative">
        <img
          src={
            product.image
              ? product.image.startsWith("/uploads")
                ? `http://localhost:5000${product.image}`
                : product.image
              : "/assets/image.png"
          }
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "/assets/image.png";
          }}
        />
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">
              {product.category}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
              {product.sport}
            </span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            Rs. {product.price}
          </span>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const getSportIcon = (sportName) => {
    const iconMap = {
      Cricket: "🏏",
      Football: "⚽",
      Rugby: "🏈",
      Volleyball: "🏐",
      Basketball: "🏀",
      Hockey: "🏒",
    };
    return iconMap[sportName] || "🏆";
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-gray-900 to-black text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.4) 0%, transparent 50%)`,
            }}
          ></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Sports </span>
            <span className="text-green-400">Collection</span>
          </h1>
          {selectedSport !== "All" && (
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">
                {getSportIcon(selectedSport)}
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-green-400">
                {selectedSport} Products
              </h2>
            </div>
          )}
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            {selectedSport === "All"
              ? "Explore our complete range of sports-specific gear designed for peak performance"
              : `Professional ${selectedSport.toLowerCase()} gear built to perform and made to last`}
          </p>
        </div>
      </section>

      {/* Sports Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Controls */}
          <div className="mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search sports products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sports Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSport === sport
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  {sport !== "All" && (
                    <span className="mr-2">{getSportIcon(sport)}</span>
                  )}
                  {sport}
                </button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {sortedProducts.length} products found
                  {selectedSport !== "All" && (
                    <span className="text-green-600 font-semibold">
                      {" "}
                      for {selectedSport}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-green-500 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-green-500 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {loading ? (
              // Loading state
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <div className="w-8 h-8 bg-green-500 rounded-full animate-bounce"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Loading sports products...
                </h3>
                <p className="text-gray-500">
                  Please wait while we fetch the latest products
                </p>
              </div>
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try selecting a different sport or adjusting your search
                  criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sport-Specific Call to Action */}
      <section className="relative bg-gradient-to-br from-green-600 via-gray-900 to-black text-white py-16">
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.4) 0%, transparent 50%)`,
            }}
          ></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {selectedSport !== "All"
              ? `Need Custom ${selectedSport} Gear?`
              : "Need Custom Sports Gear?"}
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {selectedSport !== "All"
              ? `Get custom ${selectedSport.toLowerCase()} uniforms designed specifically for your team's needs`
              : "Get custom sports uniforms designed specifically for your team's needs"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-500 text-black px-8 py-3 rounded-lg hover:bg-green-400 transition-colors font-bold text-lg">
              Contact Us
            </button>
            {/*<button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-colors font-bold text-lg">
              Contact Our Team
            </button>*/}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default SportsPage;
