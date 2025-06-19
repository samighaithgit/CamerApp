import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, LogBox } from "react-native";
import CameraScreen from "./screens/CameraScreen";
import ErrorBoundary from "./components/ErrorBoundary";
//sami
// Ignore specific warnings
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "Sending `onAnimatedValueUpdate` with no listeners registered",
  "ViewPropTypes will be removed from React Native",
]);

// Global error handler
const globalErrorHandler = (error, isFatal) => {
  console.error("Global Error Handler:", error, "Fatal:", isFatal);
};

if (!__DEV__) {
  const defaultHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    globalErrorHandler(error, isFatal);
    defaultHandler(error, isFatal);
  });
}

const AppContent = () => (
  <View style={styles.container}>
    <StatusBar style="light" />
    <CameraScreen />
  </View>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
