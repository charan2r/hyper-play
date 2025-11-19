import * as fabric from "fabric";
import { useEffect } from "react";

export default function DesignLoader({ jsonData, onExport }) {
  useEffect(() => {
    if (!jsonData) return;

    console.log("DesignLoader: JSON data received, starting load...");

    const hiddenCanvasEl = document.createElement("canvas");
    hiddenCanvasEl.width = 750;
    hiddenCanvasEl.height = 700;
    const canvas = new fabric.Canvas(hiddenCanvasEl, {
      crossOrigin: "anonymous",
    });

    canvas.loadFromJSON(jsonData, () => {
      console.log("JSON structure loaded into fabric canvas");

      const appliedColors = {};

      canvas.getObjects().forEach((obj) => {
        let fillColor = obj.fill || "#ffffff";
        obj.set({
          stroke: null,
          shadow: null,
          opacity: 1,
          fillRule: "nonzero",
          fill: fillColor,
        });

        appliedColors[obj.type || obj.fill || "unknown"] = fillColor;

        const scaleX = canvas.width / (obj.width * obj.scaleX);
        const scaleY = canvas.height / (obj.height * obj.scaleY);
        const scale = Math.min(scaleX, scaleY);
        obj.scaleX *= scale;
        obj.scaleY *= scale;
        obj.left = (canvas.width - obj.width * obj.scaleX) / 2;
        obj.top = (canvas.height - obj.height * obj.scaleY) / 2;
        obj.setCoords();
      });

      canvas.backgroundColor = null;
      canvas.renderAll();

      setTimeout(() => {
        const pngData = canvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 1,
          enableRetinaScaling: false,
        });
        console.log(" PNG export complete");
        onExport(pngData, appliedColors);
      }, 300);
    });
  }, [jsonData, onExport]);

  return null;
}
