import {
  addNoteTicket,
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../services/note.js";

export const createNoteController = async (req, res) => {
  const { note, userId, tableId, ticketId, companyId } = req.body;
  const newNote = await createNote(note, userId, tableId, ticketId, companyId);
  if (newNote?.msg) {
    res.status(404).json(newNote);
    return;
  }
  res.json(newNote);
};
export const updateNoteController = async (req, res) => {
  const { id } = req.params;
  const { note, ticketId, userId, companyId, noteId } = req.body;

  const noteUpdate = await updateNote(
    id,
    noteId,
    note,
    ticketId,
    userId,
    companyId
  );
  if (noteUpdate?.msg) {
    res.status(404).json(noteUpdate);
    return;
  }
  res.json(noteUpdate);
};
export const deleteNoteController = async (req, res) => {
  const { id } = req.params;
  const { idBody } = req.body;
  const noteDeleted = await deleteNote(id, idBody);
  if (noteDeleted?.msg) {
    res.status(404).json(noteDeleted);
    return;
  }
  res.json(noteDeleted);
};

export const getAllNotesController = async (req, res) => {
  const notes = await getAllNotes(req.user.companyId.toString());
  if (notes?.msg) {
    res.status(404).json(notes);
    return;
  }
  res.json(notes);
};
export const getNoteByIdController = async (req, res) => {
  const { id } = req.params;
  const note = await getNoteById(id);
  if (note?.msg) {
    res.status(404).json(note);
    return;
  }
  res.json(note);
};

export const addNoteTicketController = async (req, res) => {
  const { data } = req.body;
  const note = await addNoteTicket(data);
  if (note?.msg) {
    res.status(404).json(note);
    return;
  }
  res.json(note);
};
