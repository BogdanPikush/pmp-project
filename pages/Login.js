import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Dimensions, TouchableOpacity, Alert, Animated } from 'react-native';
import { useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const handleEmail = (value) => value.trim();
const handlePassword = (value) => value.trim();

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Both fields are required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post('http://192.168.0.108:5001/api/login', { email, password });
      await AsyncStorage.setItem('userEmail', email);
      
      Alert.alert('Success', `Logged in with: ${response.data.email}`);
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Error', 'Invalid email or password. Please try again.');
    }
  };

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.mainContainer}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.text}>Log In</Text>
        <TextInput
          placeholder="E-mail"
          onChangeText={text => setEmail(handleEmail(text))}
          style={styles.input}
          value={email}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={text => setPassword(handlePassword(text))}
          style={styles.input}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('/')}>
          <Text style={styles.linkText}>Don't have an account?</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  container: {
    width: window.width - 40,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: '#1e90ff',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;
