import React, { useState, useEffect, useRef } from "react"
import { useSQLiteContext } from "expo-sqlite"
import { StyleSheet, View } from "react-native"

import NoteForm from "../components/NoteComponents/NoteForm"
import ChecklistView from "../components/NoteComponents/ChecklistView"
import NoteHeader from "../components/NoteComponents/NoteHeader"
import { useNoteBook } from "../context/NotesContext"

const Note = ({ route, navigation }) => {
  const db = useSQLiteContext()
  const updatableId = route.params?.noteId
  const isEditing = !!updatableId
  const { createNote, updateNote, deleteNote, createChecklistItem } = useNoteBook()
  const [note, setNote] = useState({ title: "", content: "" })
  const checklistRef = useRef(null)
  const noteType = route.params?.type || (updatableId ? (route.params?.isChecklist ? "list" : "text") : "text");
  const [disableActions, setDisableActions] = useState(false)
  const [isViewMode, setIsViewMode] = useState(!!updatableId); // Start in view mode for existing notes

  useEffect(() => {
    if (updatableId) {
      const fetchNote = async () => {
        const currentNote = await db.getFirstAsync(
          "SELECT * FROM notebook WHERE id = ?",
          [updatableId]
        )
        if (currentNote) {
          setNote({
            title: currentNote.title || "",
            content: currentNote.content || "",
          })
        } else {
          console.log("Note not found for id:", updatableId)
        }
      }
      fetchNote()
    }
  }, [updatableId, db])

  const saveNote = async () => {
    if (!note.title?.trim() && !(noteType === "list" && checklistRef.current?.getTitle().trim())) {
      navigation.goBack()
      return
    }
    try {
      if (updatableId) {
        await updateNote(updatableId, {
          title: note.title,
          content: note.content,
          isChecklist: noteType === "list",
        })
      } else {
        const result = await createNote({
          title: noteType === "list" ? checklistRef.current?.getTitle() : note.title,
          content: note.content,
          isChecklist: noteType === "list",
        })
        if (noteType === "list" && checklistRef.current) {
          const checklistItems = checklistRef.current.getItems()
          for (const item of checklistItems) {
            await createChecklistItem(result.id, item.title)
          }
        }
      }
      navigation.goBack()
    } catch (error) {
      console.log(error, "NOTE.JS")
    }
  }

  const handleToggleEdit = () => {
    // Only toggle to edit mode, checkmark button handles saving
    setIsViewMode(false);
  }

  const handleTitleChange = (title) => {
    setNote((prev) => ({ ...prev, title }))
  }

  const handleContentChange = (content) => {
    setNote((prev) => ({ ...prev, content }))
  }

  return (
    <View style={styles.container}>
      <NoteHeader
        navigation={navigation}
        onSave={saveNote}
        onToggleEdit={handleToggleEdit}
        isViewMode={isViewMode}
        isEditing={isEditing}
        disableActions={disableActions}
      />
      <View style={styles.content}>
        {noteType === "list" ? (
          <ChecklistView
            ref={checklistRef}
            noteId={updatableId}
            title={note.title}
            onSubmitTitle={saveNote}
            isViewMode={isViewMode}
          />
        ) : (
          <NoteForm
            note={note}
            onChangeTitle={handleTitleChange}
            onChangeContent={handleContentChange}
            onSave={saveNote}
            isEditing={isEditing}
            onScrollStart={() => setDisableActions(true)}
            onScrollEnd={() => setDisableActions(false)}
            isViewMode={isViewMode}
          />
        )}
      </View>
    </View>
  )
}

export default Note

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})
