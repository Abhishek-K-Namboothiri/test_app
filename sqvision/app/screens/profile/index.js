import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from "react-redux";

const ProfileScreen = () => {

  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const [avatarSource, setAvatarSource] = useState(require('../../../assets/bg/hero3.png'));
  const user = useSelector((state) => state.auth.user);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  console.log("***",user)
  usr_data = user;
  console.log('USERRRRRRRRRRR',user)
  
  
  const handleImagePick = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
  
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
  
    if (pickerResult.cancelled === true) {
      return;
    }
  
    setAvatarSource({ uri: pickerResult.uri });
    scaleValue.setValue(0.6);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 2,
      useNativeDriver: true,
    }).start();
  };


  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/bg/bg.png")}
        style={styles.coverImage}
      />
      <View style={styles.avatarContainer}>
      <Animated.Image source={avatarSource} style={[styles.avatar, { transform: [{ scale: scaleValue }] }]} />
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleImagePick}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
       
        <Text style={[styles.name, styles.textWithShadow]}>{user.username}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.username}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoValue}>Bangalore, India</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>company:</Text>
          <Text style={styles.infoValue}>{user.company}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  coverImage: {
    height: 200,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color:'white'
  },
  content: {
    marginTop: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoValue: {
    marginTop: 5,
  },

  editButtonText: {
    color: 'white',
    fontSize: 18,
  },

  editButton: {
    position: 'absolute',
    right: '27%',  // Adjust as per your needs
    bottom: '15%', // Adjust as per your needs
    backgroundColor: '#2C3E50',
    padding: '3%', // Adjust padding as percentage to keep consistent sizing 
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;