import Spinner from "./Spinner";

export default function NoteForm({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  editingNote,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`glass rounded-2xl p-5 sm:p-7 mb-6 transition-all duration-300 ${
        editingNote
          ? "border-indigo-500/40 shadow-lg shadow-indigo-500/5"
          : ""
      }`}
    >
      {/* Form Title */}
      <div className="flex items-center gap-2 mb-5 text-slate-200 font-semibold text-base">
        {editingNote ? (
          <>
            <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            Edit Note
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            Create New Note
          </>
        )}
      </div>

      {/* Title Input */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Note title..."
          value={formData.title}
          onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200"
        />
      </div>

      {/* Description Textarea */}
      <div className="mb-4">
        <textarea
          placeholder="Write your note here..."
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData((p) => ({ ...p, description: e.target.value }))
          }
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200 resize-y min-h-[100px] leading-relaxed"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              {editingNote ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              {editingNote ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              )}
              {editingNote ? "Update Note" : "Create Note"}
            </>
          )}
        </button>

        {editingNote && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
