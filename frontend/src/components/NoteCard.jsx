import Spinner from "./Spinner";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NoteCard({ note, onEdit, onDelete, isDeleting }) {
  return (
    <div
      className={`glass glass-hover rounded-2xl p-5 transition-all duration-300 animate-slide-up hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 ${
        isDeleting ? "opacity-50 scale-[0.98] pointer-events-none" : ""
      }`}
    >
      {/* Header: Title + Actions */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-[1.05rem] font-semibold text-slate-100 leading-snug flex-1">
          {note.title}
        </h3>
        <div className="flex gap-1 shrink-0">
          {/* Edit button */}
          <button
            onClick={() => onEdit(note)}
            disabled={isDeleting}
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all duration-200 cursor-pointer"
            title="Edit note"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
          {/* Delete button */}
          <button
            onClick={() => onDelete(note._id)}
            disabled={isDeleting}
            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 cursor-pointer"
            title="Delete note"
          >
            {isDeleting ? (
              <Spinner size="sm" className="text-red-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed mb-3 whitespace-pre-wrap break-words">
        {note.description}
      </p>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        {formatDate(note.createdAt)}
      </div>
    </div>
  );
}
