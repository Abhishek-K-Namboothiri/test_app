import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { connect } from 'react-redux';
import { logout } from '../../redux/authActions';
import HeaderBack from "../../Layout/HeaderBack";
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get("window").height;

const FAQ_DATA = [
  {
    question: 'What is SqVision APP?',
    answer:
      'SqVision is a Computer-Vision application available for Android devices. It uses Artificial-Intelligence to analyze its surroundings and provide information in human-readable format.',
  },
  {
    question: 'How do I download and install SqVision?',
    answer:
      'You can download SqVision Application from the Google Play Store. Simply open the Play Store app on your Android device, search for "SqVision," and tap the "Install" button.',
  },
  {
    question: 'How do I create an account on SqVision?',
    answer:
      'To create an account, open the app and follow the on-screen instructions. Typically, you will need to provide your email address, create a password, and verify your account through a confirmation email.',
  },
  {
    question: 'I forgot my password. How can I reset it?',
    answer:
      'If you\'ve forgotten your password, click on the "Forgot Password" or "Reset Password" option on the login screen. You\'ll receive an email with instructions on how to reset your password.',
  },
  {
    question: 'Can I use SqVision offline?',
    answer:
      'No, the Application requires an internet connection as most of the inferencing is done online.',
  },
  {
    question: 'Is my data secure with SqVision?',
    answer:
      'At SqVision, safeguarding your data is our top priority. We understand the importance of your privacy and security. If you have any specific concerns or questions about how we handle your data, please don\'t hesitate to reach out to our support team, and we\'ll be happy to provide further information or address your concerns.',
  },
];

function Settings(props) {
  const [activeSections, setActiveSections] = useState([]);
  const [isFAQVisible, setFAQVisible] = useState(false);

  const toggleFAQVisibility = () => {
    setFAQVisible(!isFAQVisible);
  };

  const renderFAQ = () => {
    if (isFAQVisible) {
      return (
        <Accordion
          sections={FAQ_DATA}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={setActiveSections}
          underlayColor={'#fcdc9c'}
        />
      );
    }
    return null;
  };

  const renderHeader = (section, index, isActive) => {
    return (
      <View style={[styles.faqItem, styles.greenBox]}>
        <Text style={styles.faqQuestion}>{section.question}</Text>
      </View>
    );
  };

  const renderContent = (section) => {
    return (
      <View style={styles.faqItem}>
        <Text style={styles.faqAnswer}>{section.answer}</Text>
      </View>
    );
  };

  const handleLogout = async () => {
    props.logout();
    try {
      await AsyncStorage.removeItem('persistedCredentials');
    } catch (error) {
      console.error('Error clearing stored credentials:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../../assets/bg/bg2.png")}
        style={styles.backgroundImage}
      >
        <HeaderBack />

        {/* Parent View for FAQ and Logout buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.faqButton} onPress={toggleFAQVisibility}>
            <Text style={styles.faqButtonText}>FAQ</Text>
          </TouchableOpacity>

          {renderFAQ()}

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    // Add other background styles here
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Align contents from the top
    alignItems: 'center',
    marginTop: windowHeight * 0.2, // Adjust the marginTop as needed
  },
  faqButton: {
    backgroundColor: 'purple',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  faqButtonText: {
    color: 'white',
    fontSize: 18,
  },
  faqItem: {
    marginBottom: 20,
    padding: 10,
  },
  greenBox: {
    backgroundColor: '#fdb140',
    padding: 13,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'purple',
  },
  faqAnswer: {
    fontSize: 16,
    marginLeft: 12,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#FF5733', // Bright reddish-orange for a "logout" feel
    padding: 16,
    margin: 20,
    width: '90%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Adding shadow on Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600', // Making the font a bit bolder
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(null, mapDispatchToProps)(Settings);
