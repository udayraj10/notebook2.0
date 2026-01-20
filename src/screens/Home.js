import React, { useState, useMemo } from "react";
import { StyleSheet, View, Text, FlatList, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/styles";
import * as LocalAuthentication from "expo-local-authentication";

import { Fab, FabMenu } from "../components/HomeComponents/Fab";
import SearchBar from "../components/HomeComponents/SearchBar";
import { useNoteBook } from "../context/NotesContext";
import NoteItem from "../components/HomeComponents/NoteItem";
import NoteOptionModal from "../components/HomeComponents/NoteOptionModal";



const Home = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fabMenuVisible, setFabMenuVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const { notes, updateNote, deleteNote } = useNoteBook();
  const insets = useSafeAreaInsets();

  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, notes]);

  const handleMenuPress = (note, positionData) => {
    if (positionData) {
      setMenuPosition({ y: positionData.pageY });
    }
    setSelectedNote(note);
    setModalVisible(true);
  };

  const handleTogglePrivacy = async (note) => {
    const nextPrivacy = !note.isPrivate;
    if (note.isPrivate && !nextPrivacy) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to Make Public",
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
      });
      if (result.success) {
        await updateNote(note.id, { isPrivate: false });
      } else {
        Alert.alert("Authentication Failed", "You could not be verified.");
      }
    } else {
      await updateNote(note.id, { isPrivate: true });
    }
  };

  const handleDeleteNote = async (note) => {
    await deleteNote(note.id);
    setModalVisible(false);
    setSelectedNote(null);
  };

  // Sort notes in descending order (newest first)
  const mergedData = filteredNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleFabPress = () => {
    setFabMenuVisible(true);
  };

  const handleFabMenuSelect = (type) => {
    setFabMenuVisible(false);
    navigation.navigate("Note", { type });
  };

  const renderNote = ({ item, index }) => {
    return <NoteItem note={item} index={index} onMenuPress={handleMenuPress} />;
  };

  const handleScrollBeginDrag = () => { };

  return (
    <View style={styles.screenBg}>
      <NoteOptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        note={selectedNote}
        onTogglePrivacy={handleTogglePrivacy}
        onDelete={handleDeleteNote}
        position={menuPosition}
      />
      <FabMenu
        visible={fabMenuVisible}
        onClose={() => setFabMenuVisible(false)}
        onSelect={handleFabMenuSelect}
      />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>NoteLab</Text>
      </View>
      <View style={styles.container}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FlatList
          data={mergedData}
          renderItem={renderNote}
          numColumns={1}
          keyExtractor={(item) => `note-${item.id}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 100,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.fabContainer}>
          <Fab
            icon="add"
            label="Add Note"
            onPress={handleFabPress}
            style={styles.fab}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: Colors.bg200,
  },
  header: {
    backgroundColor: Colors.bg100,
    paddingBottom: 12,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 28,
    color: Colors.text,
    marginTop: 8,
  },
  container: {
    flex: 1,
  },
  fabContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    width: 160,
    height: 56,
    borderRadius: 12,
  }
});