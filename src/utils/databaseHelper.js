export const resetDatabase = async (db) => {
  try {
    // Drop existing tables
    await db.execAsync("DROP TABLE IF EXISTS checklist_items")
    await db.execAsync("DROP TABLE IF EXISTS notebook")
    // Do NOT recreate flashcards table
    // Recreate tables with new schema
    await db.execAsync(`
      CREATE TABLE notebook (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        isPrivate INTEGER NOT NULL DEFAULT 0,
        isChecklist INTEGER NOT NULL DEFAULT 0,
        color TEXT
      );
    `)
    await db.execAsync(`
      CREATE TABLE checklist_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        note_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        isCompleted INTEGER NOT NULL DEFAULT 0,
        order_index INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (note_id) REFERENCES notebook (id) ON DELETE CASCADE
      );
    `)
  } catch (error) {
    console.log(error, "RESET DATABASE")
  }
}