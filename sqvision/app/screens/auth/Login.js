import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, Image, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, ROUTES } from '../../constants';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
import { login } from '../../redux/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = (props) => {
  const navigation = useNavigation();
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const error = useSelector((state) => state.auth.error); // Get the error state from Redux

  useEffect(() => {
    const checkPersistedCredentials = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem('persistedCredentials');
        
        if (storedCredentials) {
          const parsedCredentials = JSON.parse(storedCredentials);
          setCredentials(parsedCredentials);
          setIsChecked(true);
        }
      } catch (error) {
        console.error('Error retrieving stored credentials:', error);
      }
    };

    checkPersistedCredentials();
  }, []);
  
  
  const handleLogin = async () => {
    // Dispatch the login action with user credentials
    dispatch(login(credentials));
  
  if (isChecked) {
    // If "Remember Me" is checked, store the credentials in AsyncStorage
    try {
      await AsyncStorage.setItem('persistedCredentials', JSON.stringify(credentials));
      
    } catch (error) {
      console.error('Error storing credentials:', error);
    }
  }
  // Assuming you have a navigation reference
  // if (isChecked) {
  //   navigation.navigate(ROUTES.HOME); // Replace 'HOME' with the actual route name for your home screen
  // } else {
  //   // If "Remember Me" is not checked, you can navigate to the onboarding screen or any other screen you want.
  //   // For now, let's assume you have an onboarding screen with the route name 'ONBOARDING'
  //   navigation.navigate(ROUTES.LANDING);
  // }
};

  return (
    <View style={styles.container}>
      <View style={styles.content}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo.png')} // Replace with the path to your logo image
          style={styles.logo}
        />
      </View>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hi Welcome Back! 👋</Text>
          <Text style={styles.subWelcomeText}>Hello again, you have been missed!</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Email address</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder='Enter your email address'
              placeholderTextColor={COLORS.black}
              keyboardType='email-address'
              style={styles.inputField}
              value={credentials.email}
              onChangeText={(text) => setCredentials({ ...credentials, email: text })}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Password</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder='Enter your password'
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              style={styles.inputField}
              value={credentials.password}
              onChangeText={(text) =>
                setCredentials({ ...credentials, password: text })
              }
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.passwordIconContainer}
            >
              {
                isPasswordShown ? (
                  <Ionicons name="eye-off" size={24} color={COLORS.black} />
                ) : (
                  <Ionicons name="eye" size={24} color={COLORS.black} />
                )
              }
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.primary : undefined}
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
          <Pressable
            onPress={() => navigation.navigate('forgetpaswd')}
          >
            <Text style={styles.forgetpasswd}>Forgot Password?</Text>
          </Pressable>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Button
          title="Login"
          filled
          style={styles.loginButton}
          onPress={handleLogin}
        />

        <View style={styles.orSeparatorContainer}>
          <View style={styles.orSeparator} />
          <Text style={styles.orText}>Or Login with</Text>
          <View style={styles.orSeparator} />
        </View>

        {/* <View style={styles.socialButtonContainer}>
          <TouchableOpacity
            onPress={() => console.log("Pressed")}
            style={styles.socialButton}
          >
            <Image
              source={require("../../assets/google.png")}
              style={styles.socialIcon}
              resizeMode='contain'
            />
            <Text>Google</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Pressable
            onPress={() => navigation.navigate(ROUTES.REGISTER)}
          >
            <Text style={styles.signupLink}>Register</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    marginHorizontal: windowWidth * 0.05,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red'
  },
  logoContainer: {
    // flex: 1, // Takes up 1/2 of the row
  },
  logo: {
    width: 100, // Adjust the width and height as needed
    height: 100,
  },
  welcomeContainer: {
    marginVertical: windowHeight * 0.02,
  },
  welcomeText: {
    fontSize: windowWidth * 0.08,
    fontWeight: 'bold',
    marginVertical: windowHeight * 0.01,
    color: COLORS.black,
  },
  subWelcomeText: {
    fontSize: windowWidth * 0.05,
    color: COLORS.black,
  },
  inputContainer: {
    marginBottom: windowHeight * 0.01,
  },
  labelText: {
    fontSize: windowWidth * 0.04,
    fontWeight: '400',
    marginVertical: windowHeight * 0.008,
  },
  inputBox: {
    width: "100%",
    height: windowHeight * 0.06,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: "center",
    paddingLeft: windowWidth * 0.05,
  },
  inputField: {
    flex: 1,
    height: "100%",
  },
  passwordIconContainer: {
    position: "absolute",
    right: windowWidth * 0.05,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: windowHeight * 0.005,
  },
  checkbox: {
    marginRight: windowWidth * 0.02,
  },
  rememberMeText: {
    fontSize: windowWidth * 0.04,
  },
  loginButton: {
    marginTop: windowHeight * 0.015,
    marginBottom: windowHeight * 0.005,
  },
  orSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: windowHeight * 0.02,
  },
  orSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.grey,
    marginHorizontal: windowWidth * 0.015,
  },
  orText: {
    fontSize: windowWidth * 0.035,
  },
  socialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: windowHeight * 0.02,
  },
  socialButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: windowHeight * 0.08,
    borderWidth: 1,
    borderColor: COLORS.grey,
    marginRight: windowWidth * 0.01,
    borderRadius: 10,
    paddingHorizontal: windowWidth * 0.03,
  },
  socialIcon: {
    height: windowWidth * 0.12,
    width: windowWidth * 0.12,
    marginRight: windowWidth * 0.02,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: windowHeight * 0.02,
  },
  signupText: {
    fontSize: windowWidth * 0.04,
    color: COLORS.black,
  },
  signupLink: {
    fontSize: windowWidth * 0.04,
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: windowWidth * 0.01,
  },
  forgetpasswd: {
    fontSize: windowWidth * 0.04,
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: windowWidth * 0.24,
  },
});

export default Login;
