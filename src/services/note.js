import noteModel from "../model/NotesModel.js";

export const createNote = async (
  note,
  userId,
  tableId,
  ticketId,
  companyId
) => {
  try {
    if (!tableId) {
      return {
        msg: "error no viene tableId",
      };
    }

    const newNote = await noteModel.create({
      note,
      ticketId,
      userId,
      tableId,
      companyId,
    });
    if (!newNote) {
      return {
        msg: "error al crear la nota",
      };
    }
    return newNote;
  } catch (error) {
    console.log(error);
  }
};

export const updateNote = async (
  id,
  noteId,
  note,
  ticketId,
  userId,
  companyId
) => {
  try {
    const noteUpdate = await noteModel.findById(id);
    if (!noteUpdate) {
      return {
        msg: "no existe nota con ese id",
      };
    }
    noteUpdate.note.forEach(async (value) => {
      if (value._id.toString() === noteId.toString()) {
        value.message = note;
      }
    });
    await noteUpdate.save();
    return noteUpdate;
  } catch (error) {
    console.log(error);
  }
};

export const deleteNote = async (id, idBody) => {
  try {
    if (idBody) {
      const notes = await noteModel.findById(id);
      const noteUpdate = notes.note.filter(
        (value) => value._id.toString() !== idBody
      );
      notes.note = noteUpdate;
      await notes.save();
      return notes;
    }
    const noteDeleted = await noteModel.findByIdAndDelete(id, { new: true });
    if (!noteDeleted) {
      return {
        msg: "no hay id con esa nota",
      };
    }
    return noteDeleted;
  } catch (error) {
    console.log(error);
  }
};

export const getAllNotes = async (companyId) => {
  try {
    const notes = await noteModel.find({ companyId });
    if (!notes) {
      return {
        notes: [],
      };
    }
    return notes;
  } catch (error) {
    console.log(error);
  }
};

export const getNoteById = async (id) => {
  try {
    const note = await noteModel.findById(id);
    if (!note) {
      return {
        msg: "no hay nota con ese id",
      };
    }
    return note;
  } catch (error) {
    console.log(error);
  }
};

export const addNoteTicket = async (data) => {
  try {
    const note = await noteModel.create({
      note: data.note,
      companyId: data.companyId,
      ticketId: data.companyId,
      userId: data.userId,
    });
    if (!note) {
      return {
        msg: "error getting note",
      };
    }
    return note;
  } catch (error) {
    console.log(error);
  }
};
