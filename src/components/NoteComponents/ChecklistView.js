import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import {
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native"

import { Colors } from "../../constants/styles"
import { useNoteBook } from "../../context/NotesContext"
import ChecklistItem from "./ChecklistItem"
import ChecklistForm from "./ChecklistForm"

const ChecklistView = forwardRef(({ noteId, title: checklistTitle, onSubmitTitle, isViewMode }, ref) => {
  const [checklistItems, setChecklistItems] = useState([])
  const [title, setTitle] = useState("")
  const { getChecklistItems, createChecklistItem, updateChecklistItem, deleteChecklistItem } = useNoteBook()
  const scrollViewRef = useRef(null)

  const fetchChecklistItems = async () => {
    if (!noteId) return
    try {
      const items = await getChecklistItems(noteId)
      setChecklistItems(items)
    } catch (error) {
      console.log("Error fetching checklist items:", error)
    }
  }

  useEffect(() => {
    if (noteId) {
      fetchChecklistItems()
    }
  }, [noteId])

  const handleItemUpdate = () => {
    if (noteId) {
      fetchChecklistItems()
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 150)
    }
  }

  // For new notes (when noteId is undefined), handle items locally
  const handleAddItemLocal = (title) => {
    const newItem = {
      id: Date.now() + Math.random(),
      title: title,
      isCompleted: false,
      order_index: checklistItems.length + 1,
    }
    setChecklistItems(prev => [...prev, newItem])
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 150)
  }

  const handleUpdateItemLocal = (itemId, updates) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, ...updates }
          : item
      )
    )
  }

  const handleDeleteItemLocal = (itemId) => {
    setChecklistItems(prev => prev.filter(item => item.id !== itemId))
  }

  // Handle title submit for new checklist
  const handleTitleSubmit = () => {
    if (onSubmitTitle) {
      onSubmitTitle(title)
    }
  }

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getItems: () => checklistItems,
    getTitle: () => title,
  }))

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 120}
    >
      {/* Title input for new checklist notes */}
      {!noteId && (
        <TextInput
          style={styles.titleInput}
          placeholder="List title"
          placeholderTextColor={Colors.textMuted}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleTitleSubmit}
          autoFocus
          returnKeyType="done"
          editable={!isViewMode}
        />
      )}
      {/* Show checklist title for existing checklist */}
      {noteId && checklistTitle && (
        <Text style={styles.titleDisplay}>{checklistTitle}</Text>
      )}
      {!isViewMode && (
        <ChecklistForm
          noteId={noteId}
          onItemAdded={noteId ? handleItemUpdate : handleAddItemLocal}
          isNewNote={!noteId}
        />
      )}
      <ScrollView
        ref={scrollViewRef}
        style={styles.itemsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {checklistItems.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            noteId={noteId}
            onUpdate={noteId ? handleItemUpdate : () => handleUpdateItemLocal(item.id, {})}
            onDelete={noteId ? undefined : () => handleDeleteItemLocal(item.id)}
            onToggleComplete={noteId ? undefined : (isCompleted) => handleUpdateItemLocal(item.id, { isCompleted })}
            onEdit={noteId ? undefined : (title) => handleUpdateItemLocal(item.id, { title })}
            isViewMode={isViewMode} // Pass isViewMode to ChecklistItem
          />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

export default ChecklistView

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleInput: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
    color: Colors.text,
    marginHorizontal: 16,
    marginBottom: 0,
  },
  titleDisplay: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
    color: Colors.text,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  itemsContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40, // Reduced padding
  },
}) 