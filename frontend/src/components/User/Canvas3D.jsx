import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import JerseyModel from "./User/JerseyModel";

export default function Canvas3D({ selectedColor }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 3], fov: 35 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <JerseyModel selectedColor={selectedColor} />

      <OrbitControls enableZoom={true} enablePan={true} />
    </Canvas>
  );
}
