import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const WelcomeScreen = ({ onOpenCamera }) => {
  return (
    <SafeAreaView style={styles.welcomeContainer}>
      <View style={styles.welcomeContent}>
        <MaterialIcons name="photo-camera" size={80} color="#4a90e2" />
        <Text style={styles.welcomeTitle}>تطبيق الكاميرا</Text>
        <Text style={styles.welcomeText}>
          اضغط على الزر أدناه لفتح الكاميرا والتقاط الصور
        </Text>
        <TouchableOpacity 
          style={styles.openCameraButton}
          onPress={onOpenCamera}
        >
          <Text style={styles.openCameraButtonText}>فتح الكاميرا</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
  },
  openCameraButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  openCameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
