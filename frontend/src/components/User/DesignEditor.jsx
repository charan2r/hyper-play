/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState, useCallback } from "react";
import ElementsPanel from "./ElementsPanel";
import { useNavigate, useLocation } from "react-router-dom";

export default function DesignEditor({ userImage, setSelectedDesignURL }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [fabricInstance, setFabricInstance] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [cropRect, setCropRect] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [isCropping, setIsCropping] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { sport, fit, style } = location.state || {};

  // Save to history
  const saveToHistory = useCallback(() => {
    if (!canvas) return;
    const current = canvas.toJSON();
    setHistory((prev) => [...prev, current]);
    setRedoStack([]);
    setIsModified(true);
  }, [canvas]);

  //  Canvas init
  useEffect(() => {
    const init = async () => {
      const fabricModule = await import("fabric");
      const fabric =
        fabricModule.fabric || fabricModule.default || fabricModule;
      window.fabric = fabric;

      setFabricInstance(fabric);

      if (canvasRef.current && canvasRef.current.__fabricCanvas) {
        canvasRef.current.__fabricCanvas.dispose();
      }

      //  Responsive canvas size
      const isMobile = window.innerWidth < 768;
      const canvasWidth = isMobile ? window.innerWidth - 40 : 750;
      const canvasHeight = isMobile ? window.innerWidth - 40 : 700;

      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: "#fff",
      });

      canvasRef.current.__fabricCanvas = newCanvas;
      setCanvas(newCanvas);

      // Mask image load
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = "/textures/sample.png";
      bgImg.onload = () => {
        const fabricBg = new fabric.Image(bgImg, {
          scaleX: newCanvas.width / bgImg.width,
          scaleY: newCanvas.height / bgImg.height,
          angle: 180,
          originX: "center",
          originY: "center",
          left: newCanvas.width / 2,
          top: newCanvas.height / 2,
          selectable: false,
          evented: false,
          absolutePositioned: true,
        });

        newCanvas.clipPath = fabricBg;
        newCanvas.backgroundImage = fabricBg;
        newCanvas.requestRenderAll();
        newCanvas.renderAll();
        saveToHistory();
      };
    };

    init();
  }, [saveToHistory]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgData = reader.result;
        setEditorImage(imgData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load User Image
  useEffect(() => {
    const imageToUse = editorImage || userImage;

    if (fabricInstance && canvas && imageToUse) {
      console.log(" Loading image to canvas");

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageToUse;

      img.onload = () => {
        console.log(" Image loaded");

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;

        const ctx = tempCanvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const left = (canvas.width - img.width * scale) / 2;
        const top = (canvas.height - img.height * scale) / 2;

        const fabricImg = new window.fabric.Image(img, {
          left,
          top,
          scaleX: scale,
          scaleY: scale,
          hasBorders: true,
          hasControls: true,
          selectable: true,
          opacity: 0.7,
        });

        fabricImg._tempCanvas = tempCanvas;
        fabricImg._tempCtx = ctx;

        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        canvas.renderAll();
        setIsImageLoaded(true);
        setActiveImage(fabricImg);
        saveToHistory();

        console.log("🎉 Image added to canvas!");
      };

      img.onerror = () => {
        console.error(" Image load error!");
      };
    }
  }, [userImage, canvas, fabricInstance, editorImage, saveToHistory]);

  //  Crop Functions
  const handleStartCrop = () => {
    const active = canvas.getActiveObject();
    if (!active || active.type !== "image") {
      alert("Please select an image first!");
      return;
    }

    setIsCropping(true);

    const rect = new fabricInstance.Rect({
      left: active.left + 30,
      top: active.top + 30,
      width: active.width * active.scaleX * 0.5,
      height: active.height * active.scaleY * 0.5,
      fill: "rgba(0,123,255,0.2)",
      stroke: "#007bff",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      hasBorders: true,
      hasControls: true,
      cornerColor: "#007bff",
      cornerSize: 10,
    });

    setCropRect(rect);
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const handleApplyCrop = () => {
    if (!cropRect || !canvas) return;
    const image = canvas.getObjects("image").find((obj) => obj !== cropRect);
    if (!image) return;

    const cropX = cropRect.left - image.left;
    const cropY = cropRect.top - image.top;

    image.set({
      cropX: cropX / image.scaleX,
      cropY: cropY / image.scaleY,
      width: cropRect.width / image.scaleX,
      height: cropRect.height / image.scaleY,
    });

    canvas.remove(cropRect);
    setCropRect(null);
    setIsCropping(false);
    canvas.setActiveObject(image);
    canvas.renderAll();
    saveToHistory();
  };

  const handleCancelCrop = () => {
    if (cropRect) {
      canvas.remove(cropRect);
      setCropRect(null);
      setIsCropping(false);
      canvas.renderAll();
    }
  };

  const handleDelete = () => {
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.renderAll();
      saveToHistory();
    }
  };

  const handleUndo = () => {
    if (history.length < 2) return;
    const prev = [...history];
    prev.pop();
    const last = prev[prev.length - 1];
    setRedoStack((r) => [...r, canvas.toJSON()]);
    setHistory(prev);
    canvas.loadFromJSON(last, () => canvas.renderAll());
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack.pop();
    setRedoStack([...redoStack]);
    setHistory((h) => [...h, last]);
    canvas.loadFromJSON(last, () => canvas.renderAll());
  };

  // Apply Design
  const handleApplyDesign = () => {
    if (canvas) {
      canvas.discardActiveObject();
      canvas.renderAll();

      const dataURL = canvas.toDataURL({ format: "png", quality: 1 });
      setSelectedDesignURL(dataURL);
      setIsModified(false);

      console.log(" Design applied to 3D view!");
    }
  };

  // Save Design
  const handleSaveDesign = async () => {
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.renderAll();

    // PNG (for preview / 3D)
    const pngData = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    const jsonData = JSON.stringify(canvas.toJSON(["layerName"]), null, 2);

    console.log(jsonData);

    try {
      // Save design to database
      const token = localStorage.getItem("customerToken");
      if (!token) {
        alert("Please login to save your design");
        return;
      }

      const designData = {
        imageURL: pngData,
        jsonData: jsonData,
        sport,
        fit,
        style,
      };

      const response = await fetch(
        "http://localhost:5000/api/customer/designs",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ design_data: designData }),
        }
      );

      if (response.ok) {
        const savedDesign = await response.json();
        console.log("Design saved with ID:", savedDesign.id);

        // Download JSON
        const blob = new Blob([jsonData], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "design.json";
        link.click();

        // Navigate with design ID
        navigate("/order-form", {
          state: {
            designImage: pngData,
            designId: savedDesign.id,
            product_id: null,
            sport,
            fit,
            style,
          },
        });
      } else {
        console.error("Failed to save design");
        alert("Failed to save design. Please try again.");
      }
    } catch (error) {
      console.error("Error saving design:", error);
      alert("Error saving design. Please try again.");
    }
  };

  const [showElementsPanel, setShowElementsPanel] = useState(false);

  const addShape = (type) => {
    if (!canvas || !fabricInstance) return;

    let shape;
    let uniqueId = Date.now() + "_" + type;

    switch (type) {
      case "rect":
        shape = new fabricInstance.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 60,
          fill: "white",
          stroke: "black",
          strokeWidth: 0,
          layerName: uniqueId,
        });
        break;
      case "circle":
        shape = new fabricInstance.Circle({
          left: 120,
          top: 120,
          radius: 40,
          fill: "lightgreen",
          stroke: "black",
          strokeWidth: 0,
          layerName: uniqueId,
        });
        break;
      case "triangle":
        shape = new fabricInstance.Triangle({
          left: 140,
          top: 140,
          width: 80,
          height: 80,
          fill: "orange",
          stroke: "black",
          strokeWidth: 0,
          layerName: uniqueId,
        });
        break;
      case "line":
        shape = new fabricInstance.Line([50, 50, 150, 50], {
          left: 160,
          top: 160,
          stroke: "black",
          strokeWidth: 3,
          layerName: uniqueId,
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    saveToHistory();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4">
      {/*  Responsive Canvas Container */}
      <div className="bg-gray-100 rounded-lg p-2 md:p-4 mb-4 overflow-auto">
        <canvas
          ref={canvasRef}
          className="mx-auto border border-gray-300 rounded shadow-lg"
        />
      </div>

      {/*  File Upload - Mobile Friendly */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          📁 Upload Design Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm border border-gray-300 rounded p-2 bg-white"
        />
      </div>

      {/*  Crop Mode Banner */}
      {isCropping && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-yellow-800">
                ✂️ Crop Mode Active
              </div>
              <div className="text-sm text-yellow-700">
                Adjust the crop area and apply
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleApplyCrop}
                className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
              >
                Apply Crop
              </button>
              <button
                onClick={handleCancelCrop}
                className="flex-1 md:flex-none bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  Control Buttons - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => setShowElementsPanel(!showElementsPanel)}
          className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 transition-colors"
        >
          🎨 Elements
        </button>

        {/*  Crop Button - Only show when image is loaded */}
        {isImageLoaded && !isCropping && (
          <button
            onClick={handleStartCrop}
            className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            ✂️ Crop Image
          </button>
        )}

        <button
          onClick={handleDelete}
          className="bg-red-700 text-white px-3 py-2 rounded text-sm hover:bg-red-800 transition-colors"
        >
          🗑️ Delete
        </button>

        {/*  Undo/Redo - Only show when changes made */}
        {isModified && history.length > 1 && (
          <button
            onClick={handleUndo}
            className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
          >
            ↶ Undo
          </button>
        )}

        {isModified && redoStack.length > 0 && (
          <button
            onClick={handleRedo}
            className="bg-gray-400 text-white px-3 py-2 rounded text-sm hover:bg-gray-500 transition-colors"
          >
            ↷ Redo
          </button>
        )}
      </div>

      {/* Elements Panel */}
      {showElementsPanel && (
        <div className="mb-4">
          <ElementsPanel onAddShape={addShape} />
        </div>
      )}

      {/*  Color Picker + Opacity - Mobile Friendly */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            🎨 Fill Color
          </label>
          <input
            type="color"
            onChange={(e) => {
              const activeObject = canvas?.getActiveObject();
              if (activeObject && activeObject.set) {
                activeObject.set("fill", e.target.value);
                canvas.renderAll();
              }
            }}
            className="w-full h-10 rounded border border-gray-300"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            👻 Opacity
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="1"
            onChange={(e) => {
              const opacity = parseFloat(e.target.value);
              const activeObject = canvas?.getActiveObject();
              if (activeObject) {
                activeObject.set("opacity", opacity);
                canvas.renderAll();
              }
            }}
            className="w-full"
          />
        </div>
      </div>

      {/*  Action Buttons - Mobile Friendly */}
      <div className="flex flex-col gap-2">
        {isModified ? (
          <>
            <button
              onClick={handleApplyDesign}
              className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors"
            >
              👁️ Apply Design
            </button>

            <button
              onClick={handleSaveDesign}
              className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 transition-colors"
              disabled={!editorImage}
            >
              💾 Save Design
            </button>
          </>
        ) : (
          <button
            onClick={handleSaveDesign}
            className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 transition-colors"
          >
            💾 Save Design
          </button>
        )}
      </div>
    </div>
  );
}
