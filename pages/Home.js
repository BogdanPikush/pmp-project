import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Animated } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function Home() {
  const [data, setData] = useState([]); // State to store the data for the line chart
  const [labels, setLabels] = useState([]); // State to store the labels for the line chart
  const [toggleBagel, setToggleBagel] = useState(false); // State to keep track of whether the bagel checkbox is checked
  const [toggleCereal, setToggleCereal] = useState(false); // State to keep track of whether the cereal checkbox is checked
  const [toggleBurrito, setToggleBurrito] = useState(false); // State to keep track of whether the burrito checkbox is checked
  const [toggleHotDog, setToggleHotDog] = useState(false); // State to keep track of whether the hot dog checkbox is checked
  const [toggleSpaghetti, setToggleSpaghetti] = useState(false); // State to keep track of whether the spaghetti checkbox is checked
  const [toggleMacNCheese, setToggleMacNCheese] = useState(false); // State to keep track of whether the mac n cheese checkbox is checked
  const [fadeAnim] = useState(new Animated.Value(0)); // State for fade animation

  // Calculate total calories based on checkbox state
  const calculateCalories = () => {
    let calories = 0;
    if (toggleBagel) calories += 380;
    if (toggleCereal) calories += 540;
    if (toggleBurrito) calories += 420;
    if (toggleHotDog) calories += 420;
    if (toggleSpaghetti) calories += 485;
    if (toggleMacNCheese) calories += 1200;
    return calories;
  };

  const navigate = useNavigate(); // Use useNavigation hook

  const navigateToProfile = () => {
    navigate('/profile'); // Navigate to ProfileScreen
  };

  // Write user data to the server
  const writeUserData = async (day, calories) => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');

      const response = await axios.post('http://192.168.0.108:5001/api/saveCalories', {
        email: userEmail,
        day: day.getDate(),
        calories: calories
      });
      console.log('User data written successfully:', response.data);
    } catch (error) {
      console.error('Error writing user data:', error);
    }
  };

  // Fetch user data from the server
  const getUserData = async (day) => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');

      const response = await axios.get('http://192.168.0.108:5001/api/calories', {
        params: {
          email: userEmail,
          day: day.getDate()
        }
      });
      const { data } = response;
      const myData = data.map(item => item.calories);
      const myLabels = data.map(item => item.day);
      return [myData, myLabels];
    } catch (error) {
      console.error('Error fetching user data:', error);
      return [[], []];
    }
  };

  // Convert retrieved data to chart compatible format
  const toList = (obj) => {
    if (!obj) return [[], []];
    const data = obj.map(item => item.kcal);
    const labels = obj.map(item => item.day);
    return [data, labels];
  };

  useEffect(() => {
    const day = new Date(); // Get the current date

    const calories = calculateCalories();
    writeUserData(day, calories);

    getUserData(day)
      .then(([myData, myLabels]) => {
        setData(myData);
        setLabels(myLabels);
      })
      .catch((err) => {
        console.error('Error in useEffect:', err);
      });

    // Animate the view on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [toggleBagel, toggleCereal, toggleBurrito, toggleHotDog, toggleSpaghetti, toggleMacNCheese]);

  return (
    <ScrollView style={styles.mainContainer}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Display the Kilo-Calories over time */}
        <Text style={styles.title}>Kilo-Calories over time</Text>
        <LineChart
          data={{
            labels: labels,
            datasets: [{ data: data }]
          }}
          width={Dimensions.get("window").width - 60}
          height={220}
          yAxisSuffix=" Kcal"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#f0f0f0",
            backgroundGradientFrom: "#f0f0f0",
            backgroundGradientTo: "#dcdcdc",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa500" }
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />

        {/* Additional views */}
        <View style={styles.additionalContainer}>
          {/* Weekdays */}
          <View style={styles.weekdaysContainer}>
            <Text style={styles.subtitle}>This week</Text>
            <View style={styles.weekdays}>
              {/* Example weekdays, adjust as needed */}
              <TouchableOpacity>
                <Text style={[styles.weekday, styles.today]}>Mon</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.weekday}>Tue</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.weekday}>Wed</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.weekday}>Thu</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.weekday}>Fri</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.weekday}>Sat</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.weekday}>Sun</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional items with calories */}
          <View style={styles.extrasContainer}>
            <Text style={styles.subtitle}>Extra calories</Text>
            <TouchableOpacity
              style={[styles.extraItem, toggleBagel && styles.extraItemSelected]}
              onPress={() => setToggleBagel(!toggleBagel)}
            >
              <Text>Bagel</Text>
              <Text>+380 Kcal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.extraItem, toggleCereal && styles.extraItemSelected]}
              onPress={() => setToggleCereal(!toggleCereal)}
            >
              <Text>Cereal</Text>
              <Text>+540 Kcal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.extraItem, toggleBurrito && styles.extraItemSelected]}
              onPress={() => setToggleBurrito(!toggleBurrito)}
            >
              <Text>Burrito</Text>
              <Text>+420 Kcal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.extraItem, toggleHotDog && styles.extraItemSelected]}
              onPress={() => setToggleHotDog(!toggleHotDog)}
            >
              <Text>Hot Dog</Text>
              <Text>+420 Kcal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.extraItem, toggleSpaghetti && styles.extraItemSelected]}
              onPress={() => setToggleSpaghetti(!toggleSpaghetti)}
            >
              <Text>Spaghetti</Text>
              <Text>+485 Kcal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.extraItem, toggleMacNCheese && styles.extraItemSelected]}
              onPress={() => setToggleMacNCheese(!toggleMacNCheese)}
            >
              <Text>Mac n Cheese</Text>
              <Text>+1200 Kcal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile button */}
        <TouchableOpacity style={styles.profileButton} onPress={navigateToProfile}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: '#f0f0f0',
    },
    container: {
      margin: 20,
      padding: 10,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      elevation: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#000000',
    },
    additionalContainer: {
      marginTop: 20,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#000000',
    },
    weekdaysContainer: {
      marginBottom: 20,
    },
    weekdays: {
      flexDirection: 'row',
      marginBottom: 10,
      justifyContent: 'space-around',
    },
    weekday: {
      backgroundColor: '#ffa500',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 5,
      color: '#ffffff',
      textAlign: 'center',
      borderWidth: 1,
      borderColor: '#ffa500',
    },
    today: {
      backgroundColor: '#ffa500',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 5,
      color: '#ffffff',
      textAlign: 'center',
      borderWidth: 1,
      borderColor: '#ffa500',
    },
    extrasContainer: {
      marginTop: 20,
    },
    extraItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 10,
      backgroundColor: '#dcdcdc',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#dcdcdc',
    },
    extraItemSelected: {
      backgroundColor: '#ffa500',
      borderColor: '#ffa500',
    },
    profileButton: {
      marginTop: 20,
      backgroundColor: '#ffa500',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    profileButtonText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 16,
    },
});

export default Home;