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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { COLORS, ROUTES } from '../../constants';
//import * as API from '../../constants/apiConf'
import { OTPVERI, SENDOTP} from "../../constants/apiConf";

const Emailveri = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const [formData, setFormData] = useState({
    
    otp: '', // Added confirm password field
    
  });

  // Extract email from the route params
  const email = route.params;
  console.log('+++++++++', email)
  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });

   
  };

  const handleRegister = () => {
  
    // If form is valid, proceed with registration
    const jsonData = JSON.stringify({ 
      email: email.email,
      otp: formData.otp,
     });
    console.log('%%%%%%%%%%%5',jsonData);

    // Make a network request to your API with the JSON data
    // Replace this with your actual API endpoint
    fetch(OTPVERI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from your API
        console.log('Registration response:', data);

        // Navigate to the appropriate screen after registration
        navigation.navigate('Resetpaswd', { email }); // Replace with your desired route
      })
      .catch((error) => {
        console.error('Registration error:', error);
      });
  };

  //RESEND otp

  const handleResend = () => {
   
    const jsonData = JSON.stringify({ email: email.email });
    console.log('Resend Data',jsonData,SENDOTP);

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

        
      })
      .catch((error) => {
        console.error('Password change response error:', error);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image
    source={require('../../../assets/social/mail.png')} // Replace with the path to your PNG image
    style={styles.image}
  />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 22,marginTop:100 }}>
          
          <View style={{ marginVertical: 22 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: COLORS.black }}>
              Email Verification
            </Text>
            <Text style={{ fontSize: 16, color: COLORS.black }}>We send you a code to verify your email id.</Text>
          </View>

          
          

          

          {/* OTP */}
          <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: 600, marginVertical: 8 }}>Enter your OTP here</Text>
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
          placeholder="Please enter the 6 digit OTP"
          placeholderTextColor={COLORS.black}
          
          style={{
            width: '100%',
          }}
          value={formData.otp}
          onChangeText={(text) => handleInputChange('otp', text)}
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

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 20,
            }}
          >
            
            {/* <Text style={{ fontSize: 14 }}>Or Sign up with</Text> */}
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: COLORS.grey,
                marginHorizontal: 10,
              }}
            />
          </View>

          

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 22,
            }}
          >
            <Text style={{ fontSize: 16, color: COLORS.black }}>I don't receive a code</Text>

            <Pressable
              onPress={handleResend}
            >

              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  marginLeft: 6,
                }}
              >
                RESEND
              </Text>
            </Pressable>
          </View>
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
export default Emailveri;
