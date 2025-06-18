import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  Image, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';

const ConfirmModal = ({ visible, imageUri, onSave, onCancel }) => {
  if (!visible) return null;
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>حفظ الصورة</Text>
          <Text style={styles.modalText}>هل تريد حفظ هذه الصورة؟</Text>
          
          <Image 
            source={{ uri: imageUri }} 
            style={styles.previewImage} 
            resizeMode="contain"
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>إلغاء</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={onSave}
            >
              <Text style={styles.buttonText}>حفظ الصورة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color: '#555',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginVertical: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#4a90e2',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ConfirmModal;
