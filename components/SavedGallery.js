import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SavedGallery = ({ savedImages, onImagePress }) => {
  if (savedImages.length === 0) return null;
  
  return (
    <View style={styles.galleryContainer}>
      <Text style={styles.galleryTitle}>الصور المحفوظة</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.galleryScrollView}
      >
        {savedImages.map((uri, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.imageWrapper}
            onPress={() => onImagePress && onImagePress(uri)}
          >
            <Image 
              source={{ uri }} 
              style={styles.thumbnail} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'right',
  },
  galleryScrollView: {
    paddingBottom: 10,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});

export default SavedGallery;
