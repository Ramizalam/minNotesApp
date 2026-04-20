import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";
import Toast from "../components/Toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE}/api/notes`;

// Toast hook
function useToast() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const addToast = useCallback((message, type = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);
  return { toasts, addToast };
}

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const { toasts, addToast } = useToast();
  const searchTimerRef = useRef(null);

  // Fetch notes
  const fetchNotes = useCallback(async (search = "") => {
    try {
      setIsLoading(true);
      const url = search
        ? `${API_URL}?search=${encodeURIComponent(search)}`
        : API_URL;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (data.success) setNotes(data.data);
    } catch (err) {
      addToast("Failed to load notes", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  // Debounced search
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => fetchNotes(searchQuery), 400);
    return () => clearTimeout(searchTimerRef.current);
  }, [searchQuery, fetchNotes]);

  // Submit (create / update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast("Please fill in all fields", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const isEditing = !!editingNote;
      const url = isEditing ? `${API_URL}/${editingNote._id}` : API_URL;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        if (isEditing) {
          setNotes((prev) => prev.map((n) => (n._id === editingNote._id ? data.data : n)));
          addToast("Note updated successfully");
        } else {
          setNotes((prev) => [data.data, ...prev]);
          addToast("Note created successfully");
        }
        resetForm();
      } else {
        addToast(data.message || "Something went wrong", "error");
      }
    } catch {
      addToast("Failed to save note", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
        addToast("Note deleted");
        if (editingNote?._id === id) resetForm();
      } else {
        addToast("Failed to delete note", "error");
      }
    } catch {
      addToast("Failed to delete note", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, description: note.description });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingNote(null);
    setFormData({ title: "", description: "" });
  };

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent mb-2">
            Your Notes
          </h1>
          <p className="text-slate-500 text-sm">Capture your thoughts, ideas, and reminders</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search notes by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-xl transition-all duration-300"
          />
        </div>

        {/* Note Form */}
        <NoteForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          editingNote={editingNote}
          onCancel={resetForm}
        />

        {/* Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-200">All Notes</h2>
            <span className="text-xs text-slate-500 font-medium">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          </div>

          {isLoading ? (
            /* Skeleton Loading */
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl p-5 animate-pulse-slow">
                  <div className="h-5 w-3/5 bg-white/[0.06] rounded-lg mb-3" />
                  <div className="h-3.5 w-11/12 bg-white/[0.06] rounded-lg mb-2" />
                  <div className="h-3.5 w-2/5 bg-white/[0.06] rounded-lg mb-3" />
                  <div className="h-3 w-1/4 bg-white/[0.06] rounded-lg" />
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <path d="M14 2v6h6M9 15l2 2 4-4" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-400 mb-1">
                {searchQuery ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-sm text-slate-600">
                {searchQuery
                  ? `No notes match "${searchQuery}"`
                  : "Create your first note above to get started!"}
              </p>
            </div>
          ) : (
            /* Notes List */
            <div className="space-y-3">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingId === note._id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Toast toasts={toasts} />
    </div>
  );
}
