// components/Customisation.jsx
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import JerseyModel from "./JerseyModel";
import { OrbitControls } from "@react-three/drei";
import SidebarPanel from "./SidebarPanel";
import MeshLayerMapper from "./mapFabricLayersToMeshNames";
import DesignLoader from "./DesignLoader";

export default function Customisation() {
  const [selectedColor, setSelectedColor] = useState("#5C78CC");
  const [userDesign, setUserDesign] = useState(null);
  const [selectedDesignURL, setSelectedDesignURL] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("layer1");
  const [selectedDesignJSON, setSelectedDesignJSON] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen bg-gray-50">
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="flex flex-col h-full">
          {/* Top: 3D Canvas (40% height) */}
          <div className="h-2/5 relative bg-gradient-to-br from-gray-100 to-gray-200">
            <Canvas
              camera={{ position: [0, 0, 12], fov: 50 }}
              className="w-full h-full"
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} />
              <directionalLight position={[-5, 5, -5]} intensity={0.4} />

              <JerseyModel
                selectedColor={selectedColor}
                userDesign={userDesign}
                selectedLayer={selectedLayer}
              />

              <OrbitControls
                enableZoom={true}
                enablePan={false}
                enableRotate={true}
                maxPolarAngle={Math.PI / 1.3}
                minPolarAngle={Math.PI / 4}
                rotateSpeed={0.8}
              />
              <MeshLayerMapper />
            </Canvas>

            {/* Mobile Instructions */}
            <div className="absolute top-2 left-2 right-2 text-center">
              <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                Drag to rotate • Pinch to zoom
              </div>
            </div>
          </div>

          {/* Bottom: Sidebar (60% height) */}
          <div className="h-3/5 bg-white border-t-2 border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-3">
              <h2 className="text-lg font-bold text-gray-800">
                Customize Jersey
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="h-full overflow-y-auto px-4 pb-4">
              <SidebarPanel
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedDesignURL={selectedDesignURL}
                setSelectedDesignURL={setSelectedDesignURL}
                setUserDesign={setUserDesign}
                selectedLayer={selectedLayer}
                setSelectedDesignJSON={setSelectedDesignJSON}
                setSelectedLayer={setSelectedLayer}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Layout - Side by Side */
        <div className="flex h-full">
          {/* Left: 3D Canvas (50% width) */}
          <div className="w-1/2 relative bg-gradient-to-br from-gray-100 to-gray-200">
            <Canvas
              camera={{ position: [0, 0, 10], fov: 45 }}
              className="w-full h-full"
            >
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} />
              <directionalLight position={[-5, 5, -5]} intensity={0.5} />

              <JerseyModel
                selectedColor={selectedColor}
                userDesign={userDesign}
                selectedLayer={selectedLayer}
              />

              <OrbitControls
                enableZoom={true}
                enablePan={false}
                enableRotate={true}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 4}
              />
              <MeshLayerMapper />
            </Canvas>

            {/* Desktop Info */}
            <div className="absolute top-4 left-4 text-sm text-gray-700 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow">
              🎨 Jersey Designer
            </div>
          </div>

          {/* Right: Sidebar (50% width) */}
          <div className="w-1/2 bg-white border-l border-gray-200 overflow-hidden">
            <div className="h-full overflow-y-auto p-5">
              <SidebarPanel
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedDesignURL={selectedDesignURL}
                setSelectedDesignURL={setSelectedDesignURL}
                setUserDesign={setUserDesign}
                selectedLayer={selectedLayer}
                setSelectedDesignJSON={setSelectedDesignJSON}
                setSelectedLayer={setSelectedLayer}
              />
            </div>
          </div>
        </div>
      )}

      {/* JSON loader */}
      {selectedDesignJSON && (
        <DesignLoader
          jsonData={selectedDesignJSON}
          onExport={(pngData) => {
            console.log("Exported PNG received:", pngData.length);
            setUserDesign(pngData);
          }}
        />
      )}
    </div>
  );
}
