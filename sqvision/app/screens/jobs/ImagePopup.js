import React from "react";
import { StyleSheet, View, Image, Text, FlatList, Dimensions,  Animated, ImageBackground, Platform } from "react-native";
import { COLORS } from "../../constants";
import HeaderBack from "../../Layout/HeaderBack";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ImagePopup = (props) => {
  const { imageUrl, variableDetected } = props.route.params;

  // Create data source for FlatList
  const data = [
    {
      key: "image",
      content: (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          
        />
      ),
    },
    {
      key: "text",
      content: (
        <Text style={styles.variableDetectedText}>
          {typeof variableDetected === "number"
            ? variableDetected.toString()
            : String(variableDetected)}
        </Text>
      ),
    },
  ];

  return (
    <ImageBackground
      source={require('../../../assets/bg/bg2.png')} // Replace with your image path
      style={styles.backgroundImage}
      resizeMode="cover"
    >
    <View style={styles.container}>
      <HeaderBack />
      <View style={styles.content}>
        <FlatList
          data={data}
          renderItem={({ item }) => item.content}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  content: {
    flex: 1,
    justifyContent: "center", // Center items vertically
    alignItems: "center", // Center items horizontally
    marginTop: 150, // Add a top margin to push content down
  },
  image: {
    flex: 1,
    width: windowWidth,
    height: windowHeight * 0.5, // Adjust the height as needed
  },
  variableDetectedText: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10, // Adjust the margin as needed
    textAlign: "center", // Center-align the text
  },
});

export default ImagePopup;
