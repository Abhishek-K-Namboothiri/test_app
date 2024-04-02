import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Modal, Button } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import * as Location from 'expo-location';

const Header = ({ onLocationChange }) => {
  const [location, setLocation] = useState('Fetching...');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  const [tempLocation, setTempLocation] = useState('');
  const [cities, setCities] = useState([
    'Bangalore',
    'Mumbai',
    'New York',
    'London',
    'Paris',
    'Sydney',
    // ... you can add more cities
  ]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    (async () => {
      // Ask for permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        setLocation('Permission denied');
        return;
      }

      // Fetch the location
      let location = await Location.getCurrentPositionAsync({});
      if (location && location.coords) {
        // Convert the coordinates to a readable address (optional)
        const address = await Location.reverseGeocodeAsync(location.coords);
        if (address && address.length > 0) {
          setLocation(address[0].city || 'Unknown Location');
        } else {
          setLocation('Unknown Location');
        }
      } else {
        setLocation('Could not fetch location');
      }
    })();
  }, []);

  const handleCitySearch = (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const filteredCities = cities.filter(city => city.toLowerCase().includes(query.toLowerCase()));
    setSearchResults(filteredCities);
  };

  const handleLocationPress = () => {
    setTempLocation(location);
    setModalVisible(true);
  };




  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    onLocationChange(newLocation); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.header1, styles.bgIconLayout]}>
          <Image
            style={[styles.bgIcon, styles.bgIconLayout]}
            contentFit="cover"
            source={require("../../assets/bg/bg.png")}
          />
          <View style={[styles.profile, styles.profileLayout]}>
            {/* <Text style={[styles.brunoRodrigues, styles.acompanheTypo]}>
              Choose location
            </Text> */}
            
            <TouchableOpacity onPress={handleLocationPress}>
              <Text style={[styles.itbrunocombr, styles.designerTypo]}>
                {location}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(!isModalVisible);
          }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
              <TextInput
                placeholder="Search for a city"
                onChangeText={handleCitySearch}
              />
              {searchResults.map(city => (
                <TouchableOpacity key={city} onPress={() => {
                  handleLocationChange(city);
                  setModalVisible(false);
                }}>
                  <Text style={{ padding: 10 }}>{city}</Text>
                </TouchableOpacity>
              ))}
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal> */}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  bgIconLayout: {
    height: 200,
    width: "100%",
    position: "absolute",
  },
  profileLayout: {
    height: 60,
    position: "absolute",
  },
  acompanheTypo: {
    fontWeight: "600",
  },
  designerTypo: {
    fontWeight: "500",
  },
  wrapperBorder: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderColor: "#97a1d7",
    borderStyle: "solid",
    borderRadius: 8,
    flexDirection: "row",
    borderWidth: 1,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
  bgIcon: {
    top: 185,
    left: 80,
  },
  profileImageIcon: {
    width: 60,
    left: 0,
    top: 0,
  },
  brunoRodrigues: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "left",
    color: "#FFFFFF",
    left: 0,
    top: 0,
    position: "absolute",
  },
  itbrunocombr: {
    top: 23,
    // opacity: 0.4,
    lineHeight: 18,
    fontSize: 12,
    textAlign: "left",
    color: "#FFFFFF",
    left: 0,
    position: "absolute",
  },
  profileContent: {
    top: 9,
    left: 10,
    width: 132,
    height: 41,
    position: "absolute",
  },
  profile: {
    top: 239,
    left: 104,
    width: 202,
  },
  designer: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: "left",
    color: "#FFFFFF",
  },
  searchButtonContainer: {
    marginLeft: 'auto', // Move the search button to the right
  },
  searchButton: {
    paddingHorizontal: 8,
  },
  profileTags: {
    top: 303,
    left: 176,
    width: 129,
    height: 20,
    position: "absolute",
  },
  header1: {
    top: -185,
    left: -80,
  },
  header: {
    height: 150,
    width: "100%",
    left: 0,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
});

export default Header;
