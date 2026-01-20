import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";

const NoteOptionModal = ({ visible, onClose, note, onTogglePrivacy, onDelete, position }) => {
    if (!visible || !note) return null;

    const menuOptions = [
        {
            id: "privacy",
            label: note.isPrivate ? "Make Public" : "Make Private",
            icon: note.isPrivate ? "lock-open-outline" : "lock-closed-outline",
            onPress: () => {
                onTogglePrivacy(note);
                onClose();
            },
        },
        {
            id: "delete",
            label: "Delete Note",
            icon: "trash-outline",
            onPress: () => {
                onDelete(note);
                onClose();
            },
            danger: true,
        },
    ];

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={{ flex: 1 }} onPress={onClose}>
                    <View
                        style={[
                            styles.menuContainer,
                            position ? {
                                top: position.y + 5,
                                right: 20,
                            } : {
                                top: 100,
                                right: 20,
                            },
                        ]}
                    >
                        {menuOptions.map((option, index) => (
                            <Pressable
                                key={option.id}
                                style={({ pressed }) => [
                                    styles.menuItem,
                                    index === 0 && styles.firstItem,
                                    index === menuOptions.length - 1 && styles.lastItem,
                                    pressed && styles.menuItemPressed,
                                ]}
                                onPress={option.onPress}
                            >
                                <Ionicons
                                    name={option.icon}
                                    size={18}
                                    color={option.danger ? Colors.danger : Colors.text}
                                    style={styles.menuIcon}
                                />
                                <Text
                                    style={[
                                        styles.menuText,
                                        option.danger && styles.menuTextDanger,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    menuContainer: {
        position: "absolute",
        backgroundColor: "#fff",
        borderRadius: 8,
        minWidth: 180,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: Colors.bg300,
    },
    firstItem: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    lastItem: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderBottomWidth: 0,
    },
    menuItemPressed: {
        backgroundColor: Colors.bg200,
    },
    menuIcon: {
        marginRight: 12,
    },
    menuText: {
        fontFamily: "Inter-Regular",
        fontSize: 15,
        color: Colors.text,
    },
    menuTextDanger: {
        color: Colors.danger,
    },
});

export default NoteOptionModal;
