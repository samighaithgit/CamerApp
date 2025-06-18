import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  Image
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Text, TouchableOpacity } from 'react-native';

// هون منستدعي الكومبوننتس
import WelcomeScreen from './WelcomeScreen';  // هاي نقلناها على مجلد الـ screens
import CameraViewComponent from '../components/CameraView';
import ConfirmModal from '../components/ConfirmModal';
import SavedGallery from '../components/SavedGallery';

// هدول الستايلات لشاشة الكاميرا الأساسية
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  settingsButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 20,
    marginTop: 30,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 15,
  },
  galleryTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  previewImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30,
    lineHeight: 24,
  },
  openCameraButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  openCameraButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  toggleButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#4a90e2',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  innerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a90e2',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
  },
  fullScreenCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  fullScreenCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default function CameraScreen() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [isGalleryImageVisible, setIsGalleryImageVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const cameraRef = useRef(null);
  
  // هون منستخدم الـ hooks الجداد
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  
  // هاي عشان نحمل الصور المحفوظة أول ما يشتغل التطبيق
  useEffect(() => {
    const loadSavedImages = async () => {
      try {
        if (mediaLibraryPermission?.granted) {
          const album = await MediaLibrary.getAlbumAsync('MyCameraApp');
          if (album) {
            const { assets } = await MediaLibrary.getAssetsAsync({
              album: album,
              first: 20,
              sortBy: ['creationTime'],
              mediaType: ['photo']
            });
            setSavedImages(assets.map(asset => asset.uri));
          }
        }
      } catch (error) {
        console.error('خطأ في تحميل الصور المحفوظة:', error);
      }
    };
    
    loadSavedImages();
  }, [mediaLibraryPermission]);

  const requestPermissions = async () => {
    try {
      setError(null);
      
      // هون منطلب صلاحية الكاميرا
      console.log('طلب إذن الكاميرا...');
      const cameraResponse = await requestCameraPermission();
      console.log('استجابة إذن الكاميرا:', cameraResponse);
      
      // وهون منطلب صلاحية الوصول للملفات
      console.log('طلب إذن الوسائط...');
      const mediaResponse = await requestMediaLibraryPermission();
      console.log('استجابة إذن الوسائط:', mediaResponse);
      
      const cameraGranted = cameraResponse?.granted;
      const mediaGranted = mediaResponse?.granted;
      
      if (cameraGranted && mediaGranted) {
        console.log('تم منح جميع الأذونات، تفعيل الكاميرا...');
        return true;
      } else {
        let errorMessages = [];
        
        if (!cameraGranted) {
          errorMessages.push('• يرجى منح إذن الكاميرا لاستخدام التطبيق');
        }
        
        if (!mediaGranted) {
          errorMessages.push('• يرجى منح إذن الوصول إلى الوسائط لحفظ الصور');
        }
        
        setError(errorMessages.join('\n'));
        return false;
      }
    } catch (err) {
      console.error('خطأ في طلب الأذونات:', err);
      const errorMessage = err.message || 'حدث خطأ غير متوقع';
      setError(`حدث خطأ أثناء طلب الأذونات:\n${errorMessage}`);
      return false;
    }
  };

  const handleOpenCamera = async () => {
    try {
      console.log('محاولة فتح الكاميرا...');
      setError(null);
      
      const success = await requestPermissions();
      if (success) {
        setIsCameraActive(true);
        console.log('تم تفعيل الكاميرا بنجاح');
      }
    } catch (error) {
      console.error('خطأ في فتح الكاميرا:', error);
      setError('حدث خطأ أثناء محاولة فتح الكاميرا');
      setIsCameraActive(false);
    }
  };

  const handleCloseCamera = () => {
    try {
      setIsCameraActive(false);
      setError(null);
      console.log('تم إغلاق الكاميرا');
    } catch (error) {
      console.error('خطأ في إغلاق الكاميرا:', error);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || isTakingPicture) {
      console.log('Camera not ready or already taking picture');
      return;
    }
    
    try {
      console.log('محاولة التقاط صورة...');
      setIsTakingPicture(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false
      });
      
      console.log('تم التقاط الصورة بنجاح:', photo);
      
      if (!photo?.uri) {
        throw new Error('فشل في التقاط الصورة: لا يوجد رابط للصورة');
      }
      
      setCapturedImage(photo.uri);
      setShowModal(true);
    } catch (error) {
      console.error('Error taking picture:', error);
      
      let errorMessage = 'حدث خطأ أثناء محاولة التقاط الصورة';
      
      if (error.message.includes('permission')) {
        errorMessage = 'تم رفض إذن الكاميرا. يرجى التحقق من الإعدادات';
      } else if (error.message.includes('camera not ready')) {
        errorMessage = 'الكاميرا غير جاهزة. يرجى المحاولة مرة أخرى';
      }
      
      Alert.alert('خطأ', errorMessage);
    } finally {
      setIsTakingPicture(false);
    }
  };

  const saveImage = async () => {
    if (!capturedImage) {
      Alert.alert('خطأ', 'لا توجد صورة لحفظها');
      return;
    }
    
    try {
      console.log('بدء حفظ الصورة:', capturedImage);
      
      // التحقق من وجود الصورة
      const fileInfo = await FileSystem.getInfoAsync(capturedImage);
      if (!fileInfo.exists) {
        throw new Error('ملف الصورة غير موجود');
      }
      
      console.log('إنشاء أصل الصورة...');
      const asset = await MediaLibrary.createAssetAsync(capturedImage);
      
      if (!asset) {
        throw new Error('فشل في إنشاء أصل الوسائط');
      }
      
      console.log('تم إنشاء الأصل:', asset);
      
      // إنشاء ألبوم إذا لم يكن موجودًا
      let album = await MediaLibrary.getAlbumAsync('MyCameraApp');
      
      if (!album) {
        console.log('إنشاء ألبوم جديد...');
        await MediaLibrary.createAlbumAsync('MyCameraApp', asset, false);
      } else {
        console.log('إضافة إلى الألبوم الموجود...');
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      
      // تحديث قائمة الصور المحفوظة
      setSavedImages(prev => [asset.uri, ...prev]);
      
      Alert.alert('تم الحفظ', 'تم حفظ الصورة بنجاح في معرض الصور');
      
      setShowModal(false);
      setCapturedImage(null);
      
    } catch (error) {
      console.error('Error saving image:', error);
      
      let errorMessage = 'حدث خطأ أثناء محاولة حفظ الصورة';
      
      if (error.message.includes('permission')) {
        errorMessage = 'تم رفض إذن الوصول إلى الوسائط';
      }
      
      Alert.alert('خطأ', errorMessage);
    }
  };

  const cancelSave = () => {
    setShowModal(false);
    setCapturedImage(null);
  };

  const handleGalleryImagePress = (uri) => {
    setSelectedImageUri(uri);
    setIsGalleryImageVisible(true);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setError(null)}
        >
          <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isCameraActive ? (
        <WelcomeScreen onOpenCamera={handleOpenCamera} />
      ) : (
        <CameraViewComponent
          ref={cameraRef}
          isActive={isCameraActive}
          onTakePicture={takePicture}
          onCloseCamera={handleCloseCamera}
          isTakingPicture={isTakingPicture}
        />
      )}
      
      <SavedGallery 
        savedImages={savedImages} 
        onImagePress={handleGalleryImagePress}
      />

      <Modal
        visible={isGalleryImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsGalleryImageVisible(false)}
      >
        <View style={styles.fullScreenContainer}>
          <Image
            source={{ uri: selectedImageUri }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.fullScreenCloseButton}
            onPress={() => setIsGalleryImageVisible(false)}
          >
            <Text style={styles.fullScreenCloseButtonText}>إغلاق</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      <ConfirmModal
        visible={showModal}
        imageUri={capturedImage}
        onSave={saveImage}
        onCancel={cancelSave}
      />
    </View>
  );
}