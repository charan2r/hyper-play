import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function JerseyModel({
  selectedLayer,
  selectedColor,
  userDesign,
}) {
  const { scene } = useGLTF("/models/bike_taupo_mens_trail_jersey.glb");
  const [isMobile, setIsMobile] = useState(false);

  const defaultTexture = useTexture("/textures/sample.png");
  const userTexture = useTexture(userDesign || "/textures/sample.png");

  const textureToUse = userDesign ? userTexture : defaultTexture;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!textureToUse) return;

    textureToUse.encoding = THREE.sRGBEncoding;
    textureToUse.flipY = false;
    textureToUse.center.set(0.5, 0.5);
    textureToUse.offset.set(0, 0);
    textureToUse.repeat.set(1, 1);
    textureToUse.rotation = Math.PI * 3;
    textureToUse.needsUpdate = true;
    textureToUse.minFilter = THREE.LinearMipmapLinearFilter;
    textureToUse.magFilter = THREE.LinearFilter;

    scene.traverse((child) => {
      if (
        child.isMesh &&
        child.material &&
        child.material.isMeshStandardMaterial
      ) {
        if (userDesign) {
          child.material.map = textureToUse;
          child.material.color.set("#ffffff");
        } else {
          if (child.name.toLowerCase().includes(selectedLayer.toLowerCase())) {
            child.material.color.set(selectedColor);
            child.material.map = null;
          }
        }

        child.material.roughness = 0.8;
        child.material.metalness = 0.1;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, textureToUse, selectedColor, selectedLayer, userDesign]);

  // Mobile-responsive scale and position
  const scale = isMobile ? [5, 5, 5] : [7, 7, 7];
  const position = isMobile ? [0, -1, 0] : [0, -1.5, 0];

  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      rotation={[0, Math.PI, 0]}
    />
  );
}
