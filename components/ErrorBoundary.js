import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      hasError: true
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={60} color="#ff6b6b" />
            <Text style={styles.errorTitle}>عذراً، حدث خطأ غير متوقع</Text>
            <Text style={styles.errorText}>
              {this.state.error?.toString() || 'حدث خطأ غير معروف'}
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.retryButton]} 
                onPress={this.handleRetry}
              >
                <Text style={styles.buttonText}>إعادة المحاولة</Text>
              </TouchableOpacity>
              
              {this.state.errorInfo?.componentStack && (
                <TouchableOpacity 
                  style={[styles.button, styles.detailsButton]}
                  onPress={() => {
                    Alert.alert(
                      'تفاصيل الخطأ',
                      `${this.state.error?.toString()}\n\n${this.state.errorInfo.componentStack}`,
                      [{ text: 'حسناً' }]
                    );
                  }}
                >
                  <Text style={styles.buttonText}>عرض التفاصيل</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    }

    // If there's no error, render children
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    backgroundColor: '#4a90e2',
  },
  detailsButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ErrorBoundary;
