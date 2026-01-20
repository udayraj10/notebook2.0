import React, { useState } from "react"
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Colors } from "../../constants/styles"
import { useNoteBook } from "../../context/NotesContext"

const ChecklistForm = ({ noteId, onItemAdded, isNewNote }) => {
  const [newItemTitle, setNewItemTitle] = useState("")
  const { createChecklistItem } = useNoteBook()

  const handleAddItem = async () => {
    if (newItemTitle.trim()) {
      if (isNewNote) {
        // For new notes, add to local state
        onItemAdded(newItemTitle.trim())
        setNewItemTitle("")
      } else if (noteId) {
        // For existing notes, add to database
        try {
          await createChecklistItem(noteId, newItemTitle.trim())
          setNewItemTitle("")
          onItemAdded()
        } catch (error) {
          console.log("Error adding checklist item:", error)
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a new task..."
        placeholderTextColor={Colors.textMuted}
        value={newItemTitle}
        onChangeText={setNewItemTitle}
        // onSubmitEditing={handleAddItem}
        // returnKeyType="done"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={[
          styles.addButton,
          !newItemTitle.trim() && styles.addButtonDisabled,
        ]}
        onPress={handleAddItem}
        disabled={!newItemTitle.trim()}
      >
        <Ionicons
          name="add"
          size={24}
          color={newItemTitle.trim() ? "#ffffff" : Colors.textMuted}
        />
      </TouchableOpacity>
    </View>
  )
}

export default ChecklistForm

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.bg200,
  },
  input: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: Colors.bg100,
  },
  addButton: {
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.bg300,
  },
}) 