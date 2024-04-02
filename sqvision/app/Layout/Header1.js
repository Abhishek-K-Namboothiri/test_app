import React, { useState } from "react";

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

 

const Header = ({ onLocationChange }) => {

  const [location, setLocation] = useState('Bangalore'); // Set the initial location to Bangalore

 

  const handleLocationPress = () => {

    // Handle the click action here

    // For example, you can show a location picker modal or navigate to another screen with location options

    console.log("Location Clicked!");

  };

 

 

  const handleLocationChange = (newLocation) => {

    setLocation(newLocation);

    onLocationChange(newLocation); // Pass the location to the parent or other components that use this header

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

                {location} {/* Display the selected location */}

              </Text>

            </TouchableOpacity>

          </View>

 

        </View>

       

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

  itbrunocombr:  Platform.select({

    ios: {

      top: 23,

      opacity: 0.4,

      lineHeight: 18,

      fontSize: 12,

      textAlign: "left",

      color: "#FFFFFF",

      left: 0,

      position: "absolute",

   

    },

 

    android: {

      top: 40,

      opacity: 0.4,

      lineHeight: 18,

      fontSize: 12,

      textAlign: "left",

      color: "#FFFFFF",

      left: 0,

      position: "absolute",

    },

  }),

 

 

  profileContent: {

    top: 9,

    left: 10,

    width: 132,

    height: 41,

    position: "absolute",

  },

  profile: {

    top: 220,

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