import { StyleSheet, Pressable, Text, View, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import * as LocalAuthentication from "expo-local-authentication"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { Colors } from "../../constants/styles"
import { useNoteBook } from "../../context/NotesContext"
import React from "react"



const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const NoteItem = ({ note, index, onMenuPress }) => {
  const navigation = useNavigation()
  const { updateNote } = useNoteBook()
  const lockIcon = <FontAwesome name="lock" size={14} color={Colors.textMuted} style={{ marginLeft: 6 }} />
  const scale = useSharedValue(1)
  const menuButtonRef = React.useRef(null)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const onUpdate = async () => {
    if (note.isPrivate) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Note",
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
      })
      if (result.success) {
        navigation.navigate("Note", { noteId: note.id, type: note.isChecklist ? "list" : "text" })
      } else {
        Alert.alert("Authentication Failed", "You could not be verified.")
      }
    } else {
      navigation.navigate("Note", { noteId: note.id, type: note.isChecklist ? "list" : "text" })
    }
  }

  const onPrivateHandler = async () => {
    const { id, isPrivate } = note
    const nextPrivacy = !isPrivate
    if (isPrivate && !nextPrivacy) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to Make Public",
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
      })
      if (result.success) {
        Alert.alert("Make Public", "Do you want to make this note public?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Make Public",
            onPress: () => {
              updateNote(id, { isPrivate: false })
            },
          },
        ])
      } else {
        Alert.alert("Authentication Failed", "You could not be verified to make this note public.")
      }
    } else {
      const title = "Make Private"
      const message = "Do you want to make this note private?"
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Make Private",
          onPress: () => {
            updateNote(id, { isPrivate: true })
          },
        },
      ])
    }
  }

  const handleMenuPress = () => {
    if (menuButtonRef.current) {
      menuButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        onMenuPress(note, { pageX, pageY: pageY + height, width, height });
      });
    } else {
      onMenuPress(note, null);
    }
  }

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={onUpdate}

      onPressIn={() => {
        scale.value = withSpring(0.95)
      }}
      onPressOut={() => {
        scale.value = withSpring(1)
      }}
      android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
      delayPressIn={50}
      delayLongPress={500}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.noteTitle} numberOfLines={1} ellipsizeMode="tail">
              {note.title}
            </Text>
            {note.isPrivate && lockIcon}
          </View>
          <Text style={styles.noteDate}>
            {note.date ? format(new Date(note.date), "dd MMM, yyyy • hh:mm a") : ""}
          </Text>
        </View>
        <Pressable
          ref={menuButtonRef}
          onPress={handleMenuPress}
          hitSlop={10}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.textMuted} />
        </Pressable>
      </View>
    </AnimatedPressable>
  )
}

export default NoteItem

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.noteCard,
    borderWidth: 1,
    borderColor: Colors.bg300,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  noteTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: Colors.text,
  },
  noteDate: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
})
