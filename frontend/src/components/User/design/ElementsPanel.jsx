export default function ElementsPanel({ onAddShape }) {
  return (
    <div className="p-2 bg-white border rounded shadow-md mt-2 flex gap-2">
      <button
        onClick={() => onAddShape("rect")}
        className="bg-gray-200 px-2 py-1 rounded"
      >
        ▭
      </button>
      <button
        onClick={() => onAddShape("circle")}
        className="bg-gray-200 px-2 py-1 rounded"
      >
        ◯
      </button>
      <button
        onClick={() => onAddShape("triangle")}
        className="bg-gray-200 px-2 py-1 rounded"
      >
        🔺
      </button>
      <button
        onClick={() => onAddShape("line")}
        className="bg-gray-200 px-2 py-1 rounded"
      >
        ➖
      </button>
    </div>
  );
}
