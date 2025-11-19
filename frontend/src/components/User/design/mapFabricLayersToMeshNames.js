import { useGLTF } from "@react-three/drei";
import designData from "./json/design.json";
import { useEffect } from "react";

export default function MeshLayerMapper() {
  const { scene } = useGLTF("/models/bike_taupo_mens_trail_jersey.glb");

  useEffect(() => {
    const meshNames = [];

    // Get all mesh names from GLB
    scene.traverse((child) => {
      if (child.isMesh) {
        meshNames.push(child.name);
      }
    });

    console.log(" All Mesh Names from Model:", meshNames);

    // Auto mapping: fabric objects → mesh names
    const mappedLayers = designData.objects.map((obj, index) => {
      // Try to find a mesh name that contains this object's name
      const matchedMesh = meshNames.find((name) =>
        name.toLowerCase().includes((obj.name || "").toLowerCase())
      );
      return {
        layerId: index,
        fabricName: obj.name || `Layer${index + 1}`,
        matchedMesh: matchedMesh || null,
      };
    });

    console.log(" Layer Mapping Result:", mappedLayers);
  }, [scene]);

  return null;
}
