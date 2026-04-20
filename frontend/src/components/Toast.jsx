export default function Toast({ toasts }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-toast-in flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium backdrop-blur-2xl shadow-xl shadow-black/30 ${
            toast.type === "success"
              ? "bg-green-500/15 border border-green-500/25 text-green-400"
              : "bg-red-500/15 border border-red-500/25 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          )}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
