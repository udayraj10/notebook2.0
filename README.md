# Notebook App

A modern, feature-rich note-taking app built with React Native and Expo. Notebook lets you create, organize, and manage notes and checklists with a beautiful, color-coded interface.

## Features

- **Create Notes & Checklists:** Quickly add text notes or interactive checklists.
- **Color-Coded Notes:** Each note or checklist is assigned a unique random color for easy visual distinction.
- **Search:** Instantly filter notes by title.
- **Private Notes:** Lock notes with biometric authentication (if supported by device).
- **Responsive UI:** Uses Masonry layout for a modern, adaptive grid.
- **Persistent Storage:** All notes and checklists are stored locally using SQLite for fast, offline access.
- **Custom Fonts:** Uses the Inter font family for a clean, modern look.

## Database Usage

- **SQLite Local Storage:**
  - The app uses Expo's `expo-sqlite` for local data persistence.
  - The main table, `notebook`, stores all notes and checklists with the following columns:
    - `id`: Primary key
    - `title`: Note or checklist title
    - `content`: Note content (text or serialized checklist)
    - `date`: Creation date (ISO string)
    - `isPrivate`: Boolean (0/1) for privacy lock
    - `isChecklist`: Boolean (0/1) to distinguish checklists
    - `color`: Hex color code assigned randomly at creation
  - A secondary table, `checklist_items`, stores checklist items linked to notes.

- **Color Assignment:**
  - When a new note or checklist is created, it is assigned a random color from a palette and stored in the `color` column.
  - The UI always displays the color stored in the database, ensuring consistency even after app restarts.

## Specialities

- **Unique Color Coding:** No two notes look the same! Each note/checklist gets a unique color, making organization and navigation visually intuitive.
- **Biometric Security:** Lock sensitive notes with device authentication.
- **Modern UX:** Fast, smooth, and visually appealing with custom fonts and a responsive grid.
- **Offline-First:** All data is stored locally; no internet required.

## Setup & Usage

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd Notebook
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Add Fonts:**
   - Place `Inter-Regular.ttf`, `Inter-Bold.ttf` in `assets/fonts/`.
4. **Run the app:**
   ```sh
   npx expo start
   ```
5. **Reset Database (Development):**
   - To reset the database, use the `resetDatabase` helper in `src/utils/databaseHelper.js` (see code for usage).
   - Or uninstall/reinstall the app on your device/emulator.

## Folder Structure

- `src/components/` - UI components for notes, checklists, home screen, etc.
- `src/context/NotesContext.js` - Global state and database logic.
- `src/screens/` - Main app screens (Home, Note view).
- `src/utils/databaseHelper.js` - Database schema and reset logic.
- `assets/fonts/` - Custom font files.

## License

MIT 