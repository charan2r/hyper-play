/* eslint-disable no-unused-vars */
// Modified SidebarPanel.jsx - Submit Order navigates to Order Form Page
import { SketchPicker } from "react-color";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ⭐ Add this
import DesignEditor from "./DesignEditor";
import DesignLoader from "./DesignLoader";

export default function SidebarPanel({
  selectedColor,
  setSelectedColor,
  selectedDesignURL,
  setSelectedDesignURL,
  selectedLayer,
  setSelectedLayer,
  setUserDesign,
  setSelectedDesignJSON,
  textElements,
  setTextElements,
  isAddingText,
  setIsAddingText,
  pendingTextData,
  setPendingTextData,
}) {
  const navigate = useNavigate(); // ⭐ Navigation hook
  const [tab, setTab] = useState("Design");
  const [editorImage, setEditorImage] = useState(null);
  const [selectedJson, setSelectedJson] = useState(null);
  const [isDesignSelected, setIsDesignSelected] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [savedDesign, setSavedDesign] = useState(null);
  const [designPNG, setDesignPNG] = useState(null); // ⭐ Store PNG image

  // Text states
  const [newText, setNewText] = useState("Sample Text");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedTextColor, setSelectedTextColor] = useState("#000000");
  const [selectedTextElement, setSelectedTextElement] = useState(null);

  // Order Form States
  const [orderForm, setOrderForm] = useState({
    playerName: "",
    jerseyNumber: "",
    logoFile: null,
    hassponsor: false,
    sponsorName: "",
    jerseyQuantity: 1,
  });

  const designOptions = [
    {
      name: "Design 1",
      json: "/design/design1.json",
      preview: "/preview/preview1.png",
    },
    {
      name: "Design 2",
      json: "/design/design2.json",
      preview: "/preview/preview2.png",
    },
    {
      name: "Design 3",
      json: "/design/design3.json",
      preview: "/preview/preview3.png",
    },
    {
      name: "Design 4",
      json: "/design/design4.json",
      preview: "/preview/preview4.png",
    },
  ];

  const fontOptions = [
    "Arial",
    "Times New Roman",
    "Helvetica",
    "Georgia",
    "Verdana",
    "Courier New",
    "Impact",
    "Comic Sans MS",
  ];

  // Get available tabs based on design selection
  const getAvailableTabs = () => {
    const baseTabs = ["Design", "Custom"];
    if (isDesignSelected) {
      return ["Design", "Colors", "Custom"];
    }
    return baseTabs;
  };

  // Handle logo file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOrderForm((prev) => ({ ...prev, logoFile: file }));
    }
  };

  // Handle order form input changes
  const handleOrderFormChange = (field, value) => {
    setOrderForm((prev) => ({ ...prev, [field]: value }));
  };

  // Save design function
  const saveDesign = async () => {
    if (!selectedJson) {
      alert("Please select a design first!");
      return;
    }

    const designData = {
      json: selectedJson,
      colors: selectedColor,
      textElements: textElements,
      timestamp: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("customerToken");
      if (!token) {
        alert("You must be logged in to save a design.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/customer/design",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ design_data: designData }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save design");
      }

      console.log("Design saved to DB:", data);

      setSavedDesign(designData);
      setShowOrderForm(true);
      alert("Design saved successfully! Please fill in your details below.");
    } catch (err) {
      console.error("Error saving design:", err);
      alert("Failed to save design. Please try again.");
    }
  };

  //  Submit order - Navigate to Order Form Page
  const submitOrder = () => {
    // Validation
    if (!orderForm.playerName.trim()) {
      alert("Please enter player name");
      return;
    }
    if (!orderForm.jerseyNumber.trim()) {
      alert("Please enter jersey number");
      return;
    }
    if (!orderForm.jerseyQuantity || orderForm.jerseyQuantity < 1) {
      alert("Please enter valid quantity");
      return;
    }
    if (orderForm.hassponsor && !orderForm.sponsorName.trim()) {
      alert("Please enter sponsor name");
      return;
    }

    // Create order object
    const orderData = {
      design: savedDesign,
      orderDetails: orderForm,
      orderId: Date.now(),
      status: "pending",
      designImage: designPNG, // Include PNG image
    };

    console.log(" Order Submitted:", orderData);

    //  Navigate to Order Form Page with data
    navigate("/order-form", {
      state: {
        designImage: designPNG, //  Pass PNG image
        sport: "Soccer",
        fit: "Regular",
        style: "Custom",
        orderData: orderData, //  Pass complete order data
      },
    });
  };

  // Create text for placement
  const createTextForPlacement = () => {
    if (!newText.trim()) return;

    const textData = {
      text: newText,
      font: selectedFont,
      color: selectedTextColor,
      scale: 1,
      rotation: [0, 0, 0],
      visible: true,
    };

    setPendingTextData(textData);
    setIsAddingText(true);
    setNewText("Sample Text");
  };

  // Cancel text placement
  const cancelTextPlacement = () => {
    setIsAddingText(false);
    setPendingTextData(null);
  };

  // Update text element
  const updateTextElement = (id, updates) => {
    setTextElements(
      textElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // Delete text element
  const deleteTextElement = (id) => {
    setTextElements(textElements.filter((el) => el.id !== id));
    if (selectedTextElement?.id === id) {
      setSelectedTextElement(null);
    }
  };

  // Load design JSON
  const loadDesign = async (design) => {
    try {
      const res = await fetch(design.json);
      const jsonData = await res.json();
      setSelectedJson(jsonData);
      setSelectedDesignJSON(jsonData);
      setIsDesignSelected(true);
      setTab("Colors"); // Auto switch to colors tab after design selection
    } catch (err) {
      console.error(" Error loading design JSON:", err);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-lg md:text-xl font-bold mb-4">Sports Jersey </h1>

      {/* Show only Order Form when save button is clicked */}
      {showOrderForm ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-green-800">
              📋 Complete Your Order
            </h3>
            <button
              onClick={() => setShowOrderForm(false)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ← Back to Design
            </button>
          </div>

          {/*  Show design preview if available */}
          {designPNG && (
            <div className="mb-4 flex justify-center">
              <img
                src={designPNG}
                alt="Your Design"
                className="w-48 h-auto object-contain border rounded shadow-lg"
              />
            </div>
          )}

          <div className="space-y-4">
            {/* Player Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Player Name *
              </label>
              <input
                type="text"
                value={orderForm.playerName}
                onChange={(e) =>
                  handleOrderFormChange("playerName", e.target.value)
                }
                className="w-full border p-2 rounded text-sm"
                placeholder="Enter player name"
              />
            </div>

            {/* Jersey Number */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Jersey Number *
              </label>
              <input
                type="text"
                value={orderForm.jerseyNumber}
                onChange={(e) =>
                  handleOrderFormChange("jerseyNumber", e.target.value)
                }
                className="w-full border p-2 rounded text-sm"
                placeholder="Enter jersey number"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Logo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full border p-2 rounded text-sm"
              />
              {orderForm.logoFile && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Logo uploaded: {orderForm.logoFile.name}
                </p>
              )}
            </div>

            {/* Sponsor Section */}
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={orderForm.hassponsor}
                  onChange={(e) =>
                    handleOrderFormChange("hassponsor", e.target.checked)
                  }
                />
                <span className="text-sm font-medium">Add Sponsor</span>
              </label>

              {orderForm.hassponsor && (
                <input
                  type="text"
                  value={orderForm.sponsorName}
                  onChange={(e) =>
                    handleOrderFormChange("sponsorName", e.target.value)
                  }
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Enter sponsor name"
                />
              )}
            </div>

            {/* Jersey Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Jerseys *
              </label>
              <input
                type="number"
                min="1"
                value={orderForm.jerseyQuantity}
                onChange={(e) =>
                  handleOrderFormChange(
                    "jerseyQuantity",
                    parseInt(e.target.value)
                  )
                }
                className="w-full border p-2 rounded text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={submitOrder}
              className="w-full bg-green-600 text-white py-3 px-4 rounded font-medium hover:bg-green-700 transition-colors"
            >
              🚀 Submit Order
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Text Placement Mode Indicator */}
          {isAddingText && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-blue-800">
                    🎯 Text Placement Mode
                  </div>
                  <div className="text-sm text-blue-600">
                    Click anywhere on the jersey to place your text
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    Text: "{pendingTextData?.text}" | Font:{" "}
                    {pendingTextData?.font}
                  </div>
                </div>
                <button
                  onClick={cancelTextPlacement}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Tabs */}
          <div className="flex space-x-1 md:space-x-2 mb-4 overflow-x-auto pb-2">
            {getAvailableTabs().map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-2 md:px-3 py-1 md:py-2 rounded text-sm md:text-base whitespace-nowrap flex-shrink-0 ${
                  tab === t ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* -------------------- Design Tab -------------------- */}
          {tab === "Design" && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                {designOptions.map((d, index) => (
                  <div
                    key={index}
                    className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    onClick={() => loadDesign(d)}
                  >
                    <img
                      src={d.preview}
                      alt={d.name}
                      className="w-full h-24 sm:h-28 md:h-32 object-contain bg-gray-100"
                    />
                    <p className="text-center py-1 md:py-2 font-medium text-xs sm:text-sm md:text-base">
                      {d.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Design Selection Status */}
              {isDesignSelected && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                  <div className="font-semibold text-green-800">
                    ✅ Design Selected!
                  </div>
                  <div className="text-sm text-green-600">
                    You can now customize colors in the Colors tab.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------- Colors Tab (Only shown after design selection) -------------------- */}
          {tab === "Colors" && isDesignSelected && selectedJson && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  🎨 Customize Colors
                </h3>
                <p className="text-sm text-blue-600">
                  Select a layer and change its color
                </p>
              </div>

              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value)}
                className="w-full border p-2 md:p-3 rounded text-sm md:text-base"
              >
                {selectedJson.objects.map((obj, index) => (
                  <option key={index} value={index}>
                    Layer {index + 1}: {obj.type} ({obj.fill})
                  </option>
                ))}
              </select>

              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <SketchPicker
                    color={selectedColor}
                    width="100%"
                    styles={{
                      default: {
                        picker: {
                          width: "100%",
                          maxWidth: "300px",
                        },
                      },
                    }}
                    onChange={(color) => {
                      setSelectedColor(color.hex);
                      const updatedJson = { ...selectedJson };
                      updatedJson.objects = [...updatedJson.objects];
                      updatedJson.objects[selectedLayer] = {
                        ...updatedJson.objects[selectedLayer],
                        fill: color.hex,
                        stroke: null,
                        shadow: null,
                        opacity: 1,
                        fillRule: "nonzero",
                      };
                      setSelectedJson(updatedJson);
                      setSelectedDesignJSON(updatedJson);
                    }}
                  />
                </div>
              </div>

              {/* Save Design Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={saveDesign}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>💾</span>
                  <span>Save Design & Continue to Order</span>
                </button>
              </div>
            </div>
          )}

          {/* -------------------- Custom Tab -------------------- */}
          {tab === "Custom" && (
            <div className="w-full">
              <DesignEditor
                userImage={selectedDesignURL}
                editorImage={editorImage}
                setEditorImage={setEditorImage}
                setSelectedDesignURL={(finalImg) => {
                  setSelectedDesignURL(finalImg);
                  setUserDesign(finalImg);
                }}
              />
            </div>
          )}
        </>
      )}

      {/*  JSON loader for designs - Updated to capture PNG */}
      {selectedJson && (
        <DesignLoader
          jsonData={selectedJson}
          onExport={(pngData) => {
            console.log("📤 Design PNG exported");
            setDesignPNG(pngData); //  Store PNG image
            setUserDesign(pngData);
          }}
        />
      )}
    </div>
  );
}
