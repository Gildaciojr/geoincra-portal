export function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">X</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
