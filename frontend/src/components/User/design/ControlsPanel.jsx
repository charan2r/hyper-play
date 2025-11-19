import { SketchPicker } from 'react-color'

export default function ControlsPanel({ onColorChange }) {
  return (
    <div className="absolute top-20 left-4 z-50 bg-white p-4 rounded shadow">
      <h2 className="text-black font-bold mb-2">🎨 Pick a Color</h2>
      <SketchPicker
        color="#ff0000"
        onChange={(color) => onColorChange(color.hex)}
      />
    </div>
  )
}
