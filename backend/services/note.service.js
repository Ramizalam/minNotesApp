const Note = require("../models/Note");

const getAllNotes = async (userId, search = "") => {
  let filter = { userId };

  if (search && search.trim()) {
    filter.title = { $regex: search.trim(), $options: "i" };
  }

  const notes = await Note.find(filter).sort({ createdAt: -1 });
  return notes;
};

const getNoteById = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    throw { status: 404, message: "Note not found" };
  }
  return note;
};

const createNote = async ({ title, description, userId }) => {
  const note = await Note.create({ title, description, userId });
  return note;
};

const updateNote = async (noteId, userId, updateData) => {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!note) {
    throw { status: 404, message: "Note not found" };
  }
  return note;
};

const deleteNote = async (noteId, userId) => {
  const note = await Note.findOneAndDelete({ _id: noteId, userId });

  if (!note) {
    throw { status: 404, message: "Note not found" };
  }
  return note;
};

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
