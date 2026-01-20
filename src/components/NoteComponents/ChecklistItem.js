import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Colors } from "../../constants/styles"
import { useNoteBook } from "../../context/NotesContext"

const ChecklistItem = ({ item, noteId, onUpdate, onDelete, onToggleComplete, onEdit, isViewMode }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const { updateChecklistItem, deleteChecklistItem } = useNoteBook()

  const handleToggleComplete = async () => {
    if (onToggleComplete) {
      // For new notes, use local state
      onToggleComplete(!item.isCompleted)
    } else {
      // For existing notes, use database
      try {
        await updateChecklistItem(item.id, {
          title: item.title,
          isCompleted: !item.isCompleted,
        })
        onUpdate()
      } catch (error) {
        console.log("Error toggling checklist item:", error)
      }
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (editTitle.trim()) {
      if (onEdit) {
        // For new notes, use local state
        onEdit(editTitle.trim())
        setIsEditing(false)
      } else {
        // For existing notes, use database
        try {
          await updateChecklistItem(item.id, {
            title: editTitle.trim(),
            isCompleted: item.isCompleted,
          })
          setIsEditing(false)
          onUpdate()
        } catch (error) {
          console.log("Error updating checklist item:", error)
        }
      }
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(item.title)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (onDelete) {
      // For new notes, use local state
      onDelete()
    } else {
      // For existing notes, use database
      try {
        await deleteChecklistItem(item.id)
        onUpdate()
      } catch (error) {
        console.log("Error deleting checklist item:", error)
      }
    }
  }

  const handleLongPress = () => {
    if (isViewMode) return; // Prevent long press in view mode

    Alert.alert(
      "Edit or Delete Item",
      undefined,
      [
        { text: "Edit", onPress: handleEdit },
        { text: "Delete", style: "destructive", onPress: handleDelete },
        { text: "Cancel", style: "cancel" },
      ]
    )
  }

  if (isEditing) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={handleToggleComplete}
          disabled
        >
          <Ionicons
            name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"}
            size={20} // Reduced size
            color={item.isCompleted ? Colors.primary : Colors.textMuted}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.editInput}
          value={editTitle}
          onChangeText={setEditTitle}
          onBlur={handleSaveEdit}
          onSubmitEditing={handleSaveEdit}
          autoFocus
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleCancelEdit}>
          <Ionicons name="close" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={handleToggleComplete}
      >
        <Ionicons
          name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={24} // Reduced size
          color={item.isCompleted ? Colors.primary : Colors.textMuted}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.titleContainer}
        onPress={handleToggleComplete}
        onLongPress={isViewMode ? undefined : handleLongPress}
      >
        <Text
          style={[styles.title, item.isCompleted ? styles.completedTitle : null]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ChecklistItem

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  checkbox: {
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: "Inter-Regular",
    fontSize: 17,
    color: Colors.text,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: Colors.textMuted,
  },
  editInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 17,
    color: Colors.text,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    marginRight: 8,
  },
  actionButton: {
    padding: 4,
  },
}) 