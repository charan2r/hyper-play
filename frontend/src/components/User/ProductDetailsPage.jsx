import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  Check,
} from "lucide-react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Primary");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Available sizes and colors
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Primary", "Secondary", "White", "Black"];

  // Fetch product details from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/products/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Product fetched:", data);
          setProduct(data);
        } else {
          console.error("Failed to fetch product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 50)) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      const payload = {
        product_id: product.id,
        quantity,
      };

      const token = localStorage.getItem("customerToken");
      if (!token) {
        alert("Please login to add items to your cart.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/customer/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      console.log("Added to cart:", data);

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Could not add to cart. Please try again.");
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    try {
      const payload = {
        product_id: product.id,
        quantity,
      };

      const token = localStorage.getItem("customerToken");
      if (!token) {
        alert("Please login before making a purchase.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/customer/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      console.log("Added to cart (Buy Now):", data);

      navigate("/checkout");
    } catch (err) {
      console.error("Error in Buy Now:", err);
      alert("Could not proceed with Buy Now. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-8 h-8 bg-green-500 rounded-full animate-bounce"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Loading product details...
            </h3>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Product not found
            </h3>
            <button
              onClick={() => navigate("/products")}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const productImages = product.images || [product.image];

  return (
    <>
      <Navbar />

      {/* Product Details Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <button
              onClick={() => navigate("/")}
              className="hover:text-green-600"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => navigate("/products")}
              className="hover:text-green-600"
            >
              Products
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-green-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={
                    productImages[activeImage]?.startsWith("/uploads")
                      ? `http://localhost:5000${productImages[activeImage]}`
                      : productImages[activeImage] || "/assets/image.png"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/assets/image.png";
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex space-x-4">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        activeImage === index
                          ? "border-green-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={
                          img?.startsWith("/uploads")
                            ? `http://localhost:5000${img}`
                            : img || "/assets/image.png"
                        }
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/assets/image.png";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Title and Rating */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-green-600 font-semibold uppercase tracking-wide">
                    {product.category}
                  </span>
                  {product.sport && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                        {product.sport}
                      </span>
                    </>
                  )}
                  {product.isBestseller && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                        BESTSELLER
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 4.5)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating || 4.5} ({product.reviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-green-600">
                    Rs. {parseFloat(product.price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {product.longDescription || product.description}
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Size
                </h3>
                <div className="flex space-x-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium ${
                        selectedSize === size
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Color
                </h3>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium ${
                        selectedColor === color
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.stock || 50)}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock || 50} items available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      addedToCart
                        ? "bg-green-600 text-white"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 border rounded-lg transition-colors ${
                      isFavorited
                        ? "border-red-500 text-red-500 bg-red-50"
                        : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
                    />
                  </button>

                  {/* Share */}
                  <button className="p-3 border border-gray-300 text-gray-600 rounded-lg hover:border-gray-400">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Quality Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-5 h-5 text-green-600" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features Section */}
      {product.features && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Product Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default ProductDetailsPage;
