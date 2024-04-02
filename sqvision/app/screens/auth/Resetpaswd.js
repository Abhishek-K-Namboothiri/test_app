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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { COLORS, ROUTES } from '../../constants';
//import * as API from '../../constants/apiConf'
import {UPDATEPAS} from "../../constants/apiConf";



const Resetpaswd = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigation = useNavigation();
  const route = useRoute(); 
  const [isPasswordShown, setIsPasswordShown] = useState(false);

     // Add a state for the password match error
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [formData, setFormData] = useState({
    
    password: '',
    confirmPassword: '', // Added confirm password field
    
  });
  const email = route.params?.email;
  console.log('###########3', email)
  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
    
    // Clear password match error when user edits the passwords
    if (key === 'password' || key === 'confirmPassword') {
      setPasswordMatchError('');
    }
  };

  const handleRegister = () => {
    // Perform form validation here
    if (
      !formData.password ||
      !formData.confirmPassword 
      
    ) {
      // Handle missing field error
      setPasswordMatchError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      // Handle password mismatch error
      setPasswordMatchError('Passwords do not match');
      return;
    }

    // If form is valid, proceed with registration
    const jsonData = JSON.stringify({ 
      email: email.email,
      password: formData.confirmPassword,
     });
    console.log(jsonData,UPDATEPAS);

    // Make a network request to your API with the JSON data
    // Replace this with your actual API endpoint
    fetch(UPDATEPAS, {
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
      //   if (data.success) {
      //     setModalMessage('Your Password has been changed successfully.');
      //     setIsModalVisible(true);
      //   } else {
      //     setModalMessage('Password update failed. Please try again.');
      //     setIsModalVisible(true);
      //   }
      //   // Navigate to the appropriate screen after registration
        //navigation.navigate(ROUTES.LOGIN); // Replace with your desired route
      })
      .catch((error) => {
        console.error('Registration error:', error);
      });
  };

  const setsuccessModal = () => {
    setIsModalVisible(true);
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image
    source={require('../../../assets/social/sheild.png')} // Replace with the path to your PNG image
    style={styles.image}
  />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 22,marginTop:100 }}>
          <View style={{ marginVertical: 22 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: COLORS.black }}>
              Reset Password
            </Text>
            <Text style={{ fontSize: 16, color: COLORS.black }}>At least 9 characters, with uppercase and lowercase letters.</Text>
          </View>

          
          

          {/* Password */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>New Password</Text>
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
                placeholder="Enter new password"
                placeholderTextColor={COLORS.black}
                secureTextEntry={!isPasswordShown}
                style={{
                  width: '100%',
                }}
                onChangeText={(text) => handleInputChange('password', text)}
              />

              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={{
                  position: 'absolute',
                  right: 12,
                }}
              >
                {isPasswordShown ? (
                  <Ionicons name="eye-off" size={24} color={COLORS.black} />
                ) : (
                  <Ionicons name="eye" size={24} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Confirm Password</Text>
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
          placeholder="Confirm your password"
          placeholderTextColor={COLORS.black}
          secureTextEntry={!isPasswordShown}
          style={{
            width: '100%',
          }}
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
        />
      </View>
                      {/* Display password match error */}
      {passwordMatchError ? (
        <Text style={{ color: 'red', marginTop: 5 }}>{passwordMatchError}</Text>
      ) : null}
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
            title="Reset Password"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
            onPress={() => {
              handleRegister();
              setsuccessModal(); // Note: The correct function name is setSuccessModal, not setsuccessModal
            }}
          />

             {/* Modal */}
             <Modal visible={isModalVisible}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../../../assets/jobs/shield.gif')} style={{ width: 200, height: 200  }} />
              <Text style={{ marginTop: 10 }}>Your Password has been changed successfully.</Text>
              <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                <Text style={{ fontSize: 16,color: COLORS.primary,
                  fontWeight: 'bold', marginTop: 20 }}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </Modal>

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
            <Text style={{ fontSize: 16, color: COLORS.black }}>Back to</Text>
            <Pressable
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  marginLeft: 6,
                }}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  
  image: {
    left: '31%',
    top: 100,
    width: '33%', // Adjust the width as needed
    height:135, // Adjust the height as needed
    resizeMode: 'cover', // or 'contain' or 'stretch'
    justifyContent: 'center',
  },
});

export default Resetpaswd;
