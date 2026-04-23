import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const iconMap = {
  success: <CheckCircle size={18} className="text-green-600" />,
  error: <XCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-blue-500" />,
};

export function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onRemove, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-[360px] ${
        exiting ? "toast-exit" : "toast-enter"
      }`}
    >
      {iconMap[toast.type] || iconMap.info}
      <p className="text-sm text-slate-700 flex-1 font-medium">{toast.message}</p>
      <button
        onClick={() => { setExiting(true); setTimeout(onRemove, 300); }}
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

let toastIdCounter = 0;
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
