const { z } = require("zod");
const noteService = require("../services/note.service");

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).trim(),
  description: z.string().min(1, "Description is required").max(5000).trim(),
});

const updateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).trim().optional(),
  description: z.string().min(1, "Description is required").max(5000).trim().optional(),
});

const getAllNotes = async (req, res) => {
  try {
    const { search } = req.query;
    const notes = await noteService.getAllNotes(req.userId, search);
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notes" });
  }
};

const createNote = async (req, res) => {
  try {
    const validated = createNoteSchema.parse(req.body);
    const note = await noteService.createNote({
      ...validated,
      userId: req.userId,
    });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      });
    }
    console.error("Error creating note:", error);
    res.status(500).json({ success: false, message: "Failed to create note" });
  }
};

const updateNote = async (req, res) => {
  try {
    const validated = updateNoteSchema.parse(req.body);
    const note = await noteService.updateNote(req.params.id, req.userId, validated);
    res.json({ success: true, data: note });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      });
    }
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Failed to update note",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.params.id, req.userId);
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Failed to delete note",
    });
  }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote };
