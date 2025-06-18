import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { CameraView as ExpoCameraView } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

const CameraViewComponent = React.forwardRef(({ isActive, onTakePicture, onCloseCamera, isTakingPicture }, ref) => {
  const [facing, setFacing] = useState('back');
  const [isLoading, setIsLoading] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isActive) {
      setIsLoading(false);
      setCameraReady(true);
    }
    
    return () => {
      console.log('Cleaning up camera resources...');
    };
  }, [isActive]);
  
  const toggleCameraFacing = useCallback(() => {
    setFacing(current => current === 'back' ? 'front' : 'back');
  }, []);
  
  const handleCameraReady = () => {
    setCameraReady(true);
  };

  const handleMountError = () => {
    setError('حدث خطأ أثناء تحميل الكاميرا');
  };

  if (!isActive) return null;
  
  if (isLoading) {
    return (
      <View style={[styles.cameraContainer, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>جاري تحميل الكاميرا...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.cameraContainer, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <ExpoCameraView
        ref={ref}
        style={styles.camera}
        facing={facing}
        onCameraReady={handleCameraReady}
        onMountError={handleMountError}
      >
        <View style={styles.cameraHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={onCloseCamera}>
            <MaterialIcons name="close" size={28} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.flipButton} 
            onPress={toggleCameraFacing}
            disabled={isTakingPicture}
          >  
            <MaterialIcons name="flip-camera-ios" size={28} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.captureButton, 
              isTakingPicture && styles.captureButtonDisabled
            ]} 
            onPress={onTakePicture}
            disabled={isTakingPicture}
          >
            {isTakingPicture ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.innerButton} />
            )}
          </TouchableOpacity>
        </View>
      </ExpoCameraView>
    </View>
  );
});

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  innerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default CameraViewComponent;
