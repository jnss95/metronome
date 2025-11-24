import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

interface SettingModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Modal component for settings selection.
 * Displays a centered modal with a title and content.
 */
export function SettingModal({
  visible,
  onClose,
  title,
  children,
}: SettingModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          <Pressable
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Material Design 3 colors
const colors = {
  scrim: 'rgba(0, 0, 0, 0.6)',
  surface: '#2B2930',
  surfaceVariant: '#49454F',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',
  primary: '#D0BCFF',
  primaryContainer: '#4F378B',
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    userSelect: 'none',
  } as any,
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.onSurface,
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flexGrow: 0,
  },
  contentContainer: {
    gap: 8,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignSelf: 'center',
  },
  closeButtonPressed: {
    opacity: 0.8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
