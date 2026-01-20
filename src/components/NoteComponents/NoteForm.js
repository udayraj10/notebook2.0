import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
} from "react-native"

import { Colors } from "../../constants/styles"

const NoteForm = ({
  note,
  onChangeTitle,
  onChangeContent,
  onSave,
  isEditing,
  isViewMode,
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.title}
            placeholder="Title"
            placeholderTextColor={Colors.textMuted}
            value={note.title}
            onChangeText={onChangeTitle}
            onSubmitEditing={onSave}
            autoFocus={!isViewMode}
            returnKeyType="done"
            editable={!isViewMode}
          />
        </View>
        <TextInput
          style={styles.content}
          placeholder="Content"
          placeholderTextColor={Colors.textMuted}
          value={note.content}
          onChangeText={onChangeContent}
          multiline
          textAlignVertical="top"
          autoCorrect={false}
          autoFocus={false}
          editable={!isViewMode}
        />
      </View>
    </ScrollView>
  )
}

export default NoteForm

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontFamily: "Inter-Bold",
    color: Colors.text,
    fontSize: 22,
    paddingVertical: 8,
  },
  content: {
    fontFamily: "Inter-Regular",
    fontSize: 17,
    color: Colors.text,
    minHeight: 200,
    paddingTop: 8,
  },
})
