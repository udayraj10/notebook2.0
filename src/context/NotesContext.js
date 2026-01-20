import { useSQLiteContext } from "expo-sqlite"
import { createContext, useContext, useEffect, useState, useMemo } from "react"

export const DB_NAME = "notebook_app.db"

const NotebookContext = createContext({
  notes: [],
  createNote: async ({ title, content, isChecklist }) => { },
  updateNote: async (id, { title, content, isChecklist }) => { },
  deleteNote: async (id) => { },
  createChecklistItem: async (noteId, title) => { },
  updateChecklistItem: async (itemId, { title, isCompleted }) => { },
  deleteChecklistItem: async (itemId) => { },
  getChecklistItems: async (noteId) => { },
})



export function NoteBookProvider({ children }) {
  const db = useSQLiteContext()
  const [notes, setNotes] = useState([])

  useEffect(() => {
    const migrate = async () => {
      await db.execAsync("DROP TABLE IF EXISTS flashcards")
      // (Reverted) No color column or color assignment logic here
    }
    migrate()
  }, [db])

  useEffect(() => {
    fetchNotes()
  }, [db])

  const fetchNotes = async () => {
    const notes = await db.getAllAsync(
      "SELECT * FROM notebook ORDER BY date DESC"
    )
    const formattedNotes = notes.map((note) => ({
      ...note,
      isPrivate: !!note.isPrivate,
      isChecklist: !!note.isChecklist || false,
      content: note.content,
      color: note.color,
    }))
    setNotes(formattedNotes)
  }

  const createNote = async (note) => {
    // No random color
    const newNote = {
      title: note.title,
      content: note.content || "",
      date: new Date().toISOString(),
      isPrivate: note.isPrivate ?? false,
      isChecklist: note.isChecklist ?? false,
      color: null,
    }
    try {
      const result = await db.runAsync(
        "INSERT INTO notebook (title, content, date, isPrivate, isChecklist, color) VALUES (?, ?, ?, ?, ?, ?)",
        newNote.title,
        newNote.content,
        newNote.date,
        newNote.isPrivate ? 1 : 0,
        newNote.isChecklist ? 1 : 0,
        newNote.color
      )
      const createdNote = { ...newNote, id: result.lastInsertRowId }
      setNotes((prev) => [...prev, createdNote])
      return createdNote
    } catch (error) {
      console.log(error, "CREATE NOTE")
      return null
    }
  }

  const updateNote = async (id, updates) => {
    try {
      const existingNote = await db.getFirstAsync(
        "SELECT * FROM notebook WHERE id = ?",
        [id]
      )
      if (!existingNote) {
        throw new Error("Note not found")
      }
      const updatedNote = {
        id,
        title: updates.title ?? existingNote.title,
        content: updates.content ?? existingNote.content,
        date: existingNote.date,
        isPrivate: updates.isPrivate ?? !!existingNote.isPrivate,
        isChecklist: updates.isChecklist ?? !!existingNote.isChecklist,
      }
      await db.runAsync(
        "UPDATE notebook SET title = ?, content = ?, isPrivate = ?, isChecklist = ? WHERE id = ?",
        updatedNote.title,
        updatedNote.content,
        updatedNote.isPrivate ? 1 : 0,
        updatedNote.isChecklist ? 1 : 0,
        id
      )
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      )
    } catch (error) {
      console.error("Failed to update note:", error)
    }
  }

  const deleteNote = async (id) => {
    try {
      await db.runAsync("DELETE FROM notebook WHERE id = ?", id)
      setNotes((prev) => prev.filter((note) => note.id !== id))
    } catch (error) {
      console.log(error, "DELETE NOTE")
    }
  }

  const createChecklistItem = async (noteId, title) => {
    try {
      const result = await db.runAsync(
        "INSERT INTO checklist_items (note_id, title, order_index) VALUES (?, ?, (SELECT COALESCE(MAX(order_index), 0) + 1 FROM checklist_items WHERE note_id = ?))",
        noteId,
        title,
        noteId
      )
      return result.lastInsertRowId
    } catch (error) {
      console.log(error, "CREATE CHECKLIST ITEM")
    }
  }

  const updateChecklistItem = async (itemId, updates) => {
    try {
      await db.runAsync(
        "UPDATE checklist_items SET title = ?, isCompleted = ? WHERE id = ?",
        updates.title,
        updates.isCompleted ? 1 : 0,
        itemId
      )
    } catch (error) {
      console.log(error, "UPDATE CHECKLIST ITEM")
    }
  }

  const deleteChecklistItem = async (itemId) => {
    try {
      await db.runAsync("DELETE FROM checklist_items WHERE id = ?", itemId)
    } catch (error) {
      console.log(error, "DELETE CHECKLIST ITEM")
    }
  }

  const getChecklistItems = async (noteId) => {
    try {
      const items = await db.getAllAsync(
        "SELECT * FROM checklist_items WHERE note_id = ? ORDER BY order_index ASC",
        noteId
      )
      return items.map((item) => ({
        ...item,
        isCompleted: !!item.isCompleted,
      }))
    } catch (error) {
      console.log(error, "GET CHECKLIST ITEMS")
      return []
    }
  }

  const value = useMemo(
    () => ({
      notes,
      createNote,
      updateNote,
      deleteNote,
      createChecklistItem,
      updateChecklistItem,
      deleteChecklistItem,
      getChecklistItems,
    }),
    [notes]
  )

  return (
    <NotebookContext.Provider value={value}>
      {children}
    </NotebookContext.Provider>
  )
}

export function useNoteBook() {
  const context = useContext(NotebookContext)
  if (!context) {
    throw new Error("useNoteBook must be used within a NoteBookProvider.")
  }
  return context
}
