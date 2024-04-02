import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { COLORS, ROUTES } from '../../constants';
//import * as API from '../../constants/apiConf'
import { MaterialIcons } from "@expo/vector-icons";
import { API_DOM, SENDOTP} from "../../constants/apiConf";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Forgetpaswd = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    
    email: '',
    
  });
  const handleBackPress = () => {
    navigation.goBack(); // This will navigate to the previous screen
  };

  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });

    // Clear password match error when user edits the passwords
  }

  const handleRegister = () => {
   
    const jsonData = JSON.stringify({ email: formData.email });
    console.log('*********************',jsonData,SENDOTP);

    // Make a network request to your API with the JSON data
    // Replace this with your actual API endpoint
    fetch(SENDOTP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from your API
        console.log('Password change response:', data);

        // Navigate to the appropriate screen after registration
        navigation.navigate('Emailveri', { email: formData.email }); // Replace with your desired route
      })
      .catch((error) => {
        console.error('Password change response error:', error);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    ><Image
    source={require('../../../assets/social/padlock.png')} // Replace with the path to your PNG image
    style={styles.image}
  />
          
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 20,marginTop: 100 }}>
        
          <View style={{ marginVertical: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: COLORS.black }}>
              Forgot Password?
            </Text>
            <Text style={{ fontSize: 16, color: COLORS.black }}>Enter your Email address to enable 2-step verification.</Text>
          </View>

          
          

          

          {/*email id */}
          <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: 600, marginVertical: 8 }}>Enter your email Id</Text>
      <View
        style={{
          width: '100%',
          height: 48,
          borderColor: COLORS.black,
          borderWidth: 1,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 22,
        }}
      >
         <TextInput
          placeholder="email id"
          placeholderTextColor={COLORS.black}
          style={{
            width: '100%',
          }}
          // Connect TextInput value to the formData
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
      </View>
    </View>
          {/* Terms and Conditions */}
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 6,
            }}
          >
            
            
          </View>

          <Button
            title="Continue"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
            onPress={handleRegister}
          />  
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 38,
    left: 0,
    paddingLeft: 0,
    
  },
  image: {
    left: '31%',
    top: 100,
    width: '33%', // Adjust the width as needed
    height:135, // Adjust the height as needed
    resizeMode: 'cover', // or 'contain' or 'stretch'
    justifyContent: 'center',
  },
});
export default Forgetpaswd;
