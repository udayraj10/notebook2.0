import React from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../../constants/styles"

const NoteHeader = ({
  navigation,
  onSave,
  onToggleEdit,
  isViewMode,
  isEditing = false,
  disableActions = false
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={disableActions}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.actionButtons}>
          {isEditing && isViewMode && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onToggleEdit}
              disabled={disableActions}
            >
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
          {!isViewMode && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onSave}
              disabled={disableActions}
            >
              <Ionicons name="checkmark" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default NoteHeader

const styles = StyleSheet.create({
  safeArea: {
    // No background color for a clean look
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "transparent",
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  actionText: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: Colors.primary,
  },
}); 