import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import HeaderBack from "../../Layout/HeaderBack";

export default function Notifications() {
  return (
    <ImageBackground
      source={require("../../../assets/bg/bg2.png")} // Replace with your image source
      style={styles.backgroundImage}
    >
      <HeaderBack /> 
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Make sure the ImageBackground takes the full screen
    // Other styles for your ImageBackground
  },
})
