import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
          console.log("Products fetched:", data);
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

  // Use API data if available, otherwise use fallback data
  const displayProducts = products.length > 0 ? products : [];

  // Get latest products (
  const latestProducts = displayProducts.slice(0, 4);

  // Get bestsellers
  const bestSellers = displayProducts
    .filter((product) => product.isBestseller)
    .slice(0, 4);
  const bestSellersDisplay =
    bestSellers.length > 0 ? bestSellers : displayProducts.slice(0, 4);

  // Product Card Component
  const ProductCard = ({ product, showBadge = false }) => (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={() => {
        window.location.href = `/products/${product.id}`;
      }}
    >
      {showBadge && product.isBestseller && (
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
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {product.category}
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-green-600 font-bold text-xl">
            ${parseFloat(product.price).toFixed(2)}
          </p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm shadow-md hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation();

              alert(`Added ${product.name} to cart!`);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      {/* Hero Section with Enhanced Animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: 'url("/assets/image.png")',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />

        {/* Green and Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 via-gray-900/70 to-black/80"></div>

        {/* Additional Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.4) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          {/* Animated Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight animate-fadeInUp">
            <span className="inline-block animate-slideInLeft text-white">
              Any Sport
            </span>
            <span className="inline-block mx-2 text-green-400 animate-pulse">
              |
            </span>
            <span className="inline-block animate-slideInUp text-green-400">
              Any Design
            </span>
            <span className="inline-block mx-2 text-green-400 animate-pulse">
              |
            </span>
            <span className="inline-block animate-slideInRight text-white">
              Any Size
            </span>
          </h1>

          {/* Animated Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-12 font-medium max-w-4xl mx-auto text-gray-200 animate-fadeInUp animation-delay-300">
            HyperPlay brings you high-quality, pro-grade sports equipment and
            apparel designed to keep up with your every move.
          </p>

          {/* Animated Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-12">
            {/*<button
              onClick={() => (window.location.href = "/custom-design")}
              className="group bg-green-500 text-black px-6 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-xl hover:bg-green-400 transition-all duration-500 transform hover:scale-110 hover:-rotate-1 shadow-2xl w-full sm:w-auto sm:min-w-[280px] border-2 border-green-500 hover:border-green-400 animate-slideInLeft animation-delay-600 hover:shadow-green-500/25"
            >
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300"
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
                <span className="text-sm sm:text-base lg:text-lg">
                  CUSTOMIZE OWN DESIGN
                </span>
              </span>
            </button>*/}

            <button
              onClick={() => (window.location.href = "/products")}
              className="group bg-black/80 backdrop-blur-md text-white px-6 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-xl hover:bg-gray-800 transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-2xl w-full sm:w-auto sm:min-w-[280px] border-2 border-gray-700 hover:border-gray-600 animate-slideInRight animation-delay-600"
            >
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-sm sm:text-base lg:text-lg">
                  CHOOSE YOUR PRODUCT
                </span>
              </span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 sm:mt-16 animate-fadeInUp animation-delay-900">
            <p className="text-xs sm:text-sm md:text-base opacity-90 text-gray-300 tracking-widest">
              PREMIUM QUALITY • FAST DELIVERY
            </p>
          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-1/4 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 border-2 border-green-400/40 rounded-full animate-float-slow hidden sm:block"></div>
        <div className="absolute bottom-1/4 right-4 sm:right-10 w-10 h-10 sm:w-16 sm:h-16 border-2 border-gray-400/30 rounded-full animate-float-reverse hidden sm:block"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 sm:w-12 sm:h-12 border border-green-300/20 rounded-full animate-pulse hidden lg:block"></div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Latest Lineup Section */}
      <section
        id="latest-lineup"
        data-animate
        className="py-12 sm:py-16 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${
              isVisible["latest-lineup"]
                ? "animate-fadeInUp"
                : "opacity-0 translate-y-20"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              LATEST{" "}
              <span className="text-green-600 animate-pulse">LINEUP</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              New signature collections. Grab yours now!
            </p>
          </div>

          {/* Latest Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {loading
              ? [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-gray-100 rounded-lg p-8 text-center animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                ))
              : latestProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showBadge={false}
                  />
                ))}
          </div>

          {/* View All Products Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => (window.location.href = "/products")}
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* Your Colors Your Crest Your Fit Section */}
      <section
        id="your-fit"
        data-animate
        className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/assets/homepage/football.JPG")',
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/70 via-gray-900/80 to-black/90"></div>

        <div
          className={`relative z-10 text-center px-4 max-w-7xl mx-auto transition-all duration-1000 ${
            isVisible["your-fit"]
              ? "animate-fadeInUp"
              : "opacity-0 translate-y-20"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
            <span className="inline-block text-white animate-slideInLeft">
              Your Colors.
            </span>
            <span className="inline-block text-green-400 animate-slideInUp animation-delay-300">
              Your Crest.
            </span>
            <span className="inline-block text-white animate-slideInRight animation-delay-600">
              Your Fit.
            </span>
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-gray-200 max-w-2xl mx-auto animate-fadeInUp animation-delay-900">
            Pro-grade jerseys & kits built to perform, made to last.
          </p>
          <button
            onClick={() => (window.location.href = "/sports")}
            className="bg-green-500 text-black px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl hover:bg-green-400 transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-2xl animate-slideInUp animation-delay-1200"
          >
            Shop Now →
          </button>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section
        id="best-sellers"
        data-animate
        className="py-12 sm:py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${
              isVisible["best-sellers"]
                ? "animate-fadeInUp"
                : "opacity-0 translate-y-20"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">BEST SELLERS</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              The ultimate fan-favorite collection. Grab yours now!
            </p>
          </div>

          {/* Best Sellers Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {loading
              ? [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 text-center">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                ))
              : bestSellersDisplay.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showBadge={true}
                  />
                ))}
          </div>

          {/* View All Best Sellers Button */}
          <div className="text-center mt-12">
            <button
              onClick={() =>
                (window.location.href = "/products?category=Bestsellers")
              }
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
            >
              View All Best Sellers →
            </button>
          </div>
        </div>
      </section>

      {/* Custom Jerseys Section */}
      {/*<section
        id="custom-jerseys"
        data-animate
        className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden"
      >
        
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/assets/homepage/cricket.JPG")',
          }}
        />

     
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/70 via-gray-900/80 to-black/90"></div>

        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${
            isVisible["custom-jerseys"]
              ? "animate-fadeInUp"
              : "opacity-0 translate-y-20"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-green-400 animate-slideInLeft">
              Customize your Jerseys
            </span>
          </h2>
          <p className="text-lg sm:text-xl mb-4 text-gray-200 animate-fadeInUp animation-delay-300">
            Your Design. Your Game. Your Uniform
          </p>
          <p className="text-base sm:text-lg mb-8 text-gray-300 animate-fadeInUp animation-delay-600">
            Start with pro looks, finish with your crest.
          </p>
          <button className="bg-green-500 text-black px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl hover:bg-green-400 transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-2xl animate-slideInUp animation-delay-900">
            Customize your jersey →
          </button>
        </div>
      </section>*/}

      {/* Final Best Sellers Section with League Logos */}
      {/*<section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">BEST SELLERS</span>
            </h2>
            <p className="text-lg text-gray-600">
              Start with pro looks, finish with your crest
            </p>
          </div>

          
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
         
            {[1, 2, 3, 4, 5, 6].map((logo) => (
              <div
                key={logo}
                className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <span className="text-xs text-gray-500">Logo</span>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Newsletter
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
              Subscribe for exclusive deals, product updates & early-bird deals.
              No spam, pinky promise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
              <button className="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 font-semibold transform hover:scale-105">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        @keyframes float-reverse {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(30px) rotate(-180deg);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 1s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 1s ease-out;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 6s ease-in-out infinite;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-900 {
          animation-delay: 900ms;
        }

        .animation-delay-1200 {
          animation-delay: 1200ms;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-slideInLeft,
          .animate-slideInRight,
          .animate-slideInUp {
            animation-duration: 0.8s;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;
