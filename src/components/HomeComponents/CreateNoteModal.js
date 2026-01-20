import React from "react";
import { Alert } from "react-native";

const CreateNoteModal = ({ visible, onClose, onCreateText, onCreateList }) => {
    React.useEffect(() => {
        if (visible) {
            Alert.alert(
                "Create New",
                "Select note type",
                [
                    {
                        text: "Text Note",
                        onPress: () => {
                            onClose();
                            onCreateText();
                        },
                    },
                    {
                        text: "Checklist",
                        onPress: () => {
                            onClose();
                            onCreateList();
                        },
                    },
                    {
                        text: "Cancel",
                        onPress: onClose,
                        style: "cancel",
                    },
                ],
                { cancelable: true, onDismiss: onClose }
            );
        }
    }, [visible]);

    return null;
};

export default CreateNoteModal;
