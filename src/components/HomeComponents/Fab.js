import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";

// Reusable Fab component
export const Fab = ({ onPress, icon, label, style, color = Colors.primary }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color },
        style,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {icon && <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: label ? 8 : 0 }} />}
      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
};

// FabMenu component
export const FabMenu = ({ visible, onClose, onSelect }) => {
  if (!visible) return null;

  const menuOptions = [
    {
      id: "text",
      label: "Text Note",
      icon: "create-outline",
    },
    {
      id: "list",
      label: "Checklist",
      icon: "checkbox-outline",
    },
  ];

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.overlayTouchable} onPress={onClose} />
      <View style={styles.fabMenuContainer}>
        {menuOptions.map((option, index) => (
          <Pressable
            key={option.id}
            style={({ pressed }) => [
              styles.fabMenuItem,
              index === 0 && styles.firstItem,
              index === menuOptions.length - 1 && styles.lastItem,
              pressed && styles.fabMenuItemPressed,
            ]}
            onPress={() => onSelect(option.id)}
          >
            <Ionicons
              name={option.icon}
              size={18}
              color={Colors.text}
              style={styles.fabMenuIcon}
            />
            <Text style={styles.fabMenuText}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    zIndex: 1000,
  },
  miniFab: {
    width: 120,
    height: 44,
    borderRadius: 12, // Rectangular
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    right: 0,
    backgroundColor: Colors.primary,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 2000,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  menu: {
    position: "absolute",
    alignItems: "flex-end",
  },
  fabMenuContainer: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  fabMenuItem: {
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
  fabMenuItemPressed: {
    backgroundColor: Colors.bg200,
  },
  fabMenuIcon: {
    marginRight: 12,
  },
  fabMenuText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: Colors.text,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default Fab;
