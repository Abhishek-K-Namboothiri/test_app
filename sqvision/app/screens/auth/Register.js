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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { COLORS, ROUTES } from '../../constants';
import * as API from '../../constants/apiConf'


const Register = () => {
  const navigation = useNavigation();

  const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
     // Add a state for the password match error
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // Added confirm password field
    first_name: '',
    last_name: '',
    contact_number: '',
    company: '',
    role: 'user',
  });

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
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.contact_number ||
      !formData.company
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
    const jsonData = JSON.stringify(formData);
    console.log(jsonData,API.account_creation_url);

    // Make a network request to your API with the JSON data
    // Replace this with your actual API endpoint
    fetch(API.account_creation_url, {
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
        navigation.navigate(ROUTES.LOGIN); // Replace with your desired route
      })
      .catch((error) => {
        console.error('Registration error:', error);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 22,marginTop:20 }}>
          <View style={{ marginVertical: 22 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: COLORS.black }}>
              Create Account
            </Text>
            <Text style={{ fontSize: 16, color: COLORS.black }}>Unleash the Power of SQUIRREL</Text>
          </View>

          {/* Email Address */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Email address</Text>
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
                placeholder="Enter your email address"
                placeholderTextColor={COLORS.black}
                keyboardType="email-address"
                style={{
                  width: '100%',
                }}
                onChangeText={(text) => handleInputChange('email', text)}
              />
            </View>
          </View>

          {/* First Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>First Name</Text>
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
                placeholder="Enter your first name"
                placeholderTextColor={COLORS.black}
                style={{
                  width: '100%',
                }}
                onChangeText={(text) => handleInputChange('first_name', text)}
              />
            </View>
          </View>

          {/* Last Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Last Name</Text>
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
                placeholder="Enter your last name"
                placeholderTextColor={COLORS.black}
                style={{
                  width: '100%',
                }}
                onChangeText={(text) => handleInputChange('last_name', text)}
              />
            </View>
          </View>

          {/* Contact Number */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Contact Number</Text>
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
                placeholder="Enter your contact number"
                placeholderTextColor={COLORS.black}
                keyboardType="phone-pad"
                style={{
                  width: '100%',
                }}
                onChangeText={(text) => handleInputChange('contact_number', text)}
              />
            </View>
          </View>

          {/* Company */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Company</Text>
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
                placeholder="Enter your company name"
                placeholderTextColor={COLORS.black}
                style={{
                  width: '100%',
                }}
                onChangeText={(text) => handleInputChange('company', text)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Password</Text>
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
                placeholder="Enter your password"
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
            <Checkbox
              style={{ marginRight: 8 }}
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? COLORS.primary : undefined}
            />
            <Text>I agree to the terms and conditions</Text>
          </View>

          <Button
            title="Sign Up"
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
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: COLORS.grey,
                marginHorizontal: 10,
              }}
            />
            <Text style={{ fontSize: 14 }}>Or Sign up with</Text>
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
            }}
          >
            {/* Add social login buttons here */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 22,
            }}
          >
            <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account</Text>
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

export default Register;
