import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = () => {
  const [user, setUser] = useState(null); // State to store user data

  useEffect(() => {
    // Fetch user data from AsyncStorage or server on component mount
    const fetchUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        const response = await axios.get(`http://192.168.0.108:5001/api/user/${userEmail}`);
        setUser(response.data); // Assuming response.data contains user details
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Avatar section (placeholder or upload button) */}
      <View style={styles.avatarContainer}>
        {/* Example: <Image source={user.avatarUrl ? { uri: user.avatarUrl } : require('./default-avatar.png')} style={styles.avatar} /> */}
        <TouchableOpacity style={styles.avatarPlaceholder}>
          <Text>Add Photo</Text>
        </TouchableOpacity>
      </View>

      {/* User data section */}
      <View style={styles.userDataContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Height: {user.height || 'N/A'} cm</Text>
        <Text>Weight: {user.weight || 'N/A'} kg</Text>
      </View>

      {/* Edit and Logout buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDataContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    padding: 10,
    backgroundColor: '#ffa500',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default ProfileScreen;
