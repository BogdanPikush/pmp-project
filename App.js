import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeRouter, Route, Routes } from 'react-router-native';
import { StyleSheet, Text, View } from 'react-native';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Home from './pages/Home.js';
import Profile from './pages/Profile.js'

export default function App() {
  return (
    <NativeRouter>
      <View style={styles.container}>
        <Routes>
          <Route exact path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </View>
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
