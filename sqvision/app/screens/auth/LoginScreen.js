import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { login } from '../../redux/authActions';

function LoginScreen(props) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = () => {
    // Dispatch the login action with user credentials
    props.login(credentials);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setCredentials({ ...credentials, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) =>
          setCredentials({ ...credentials, password: text })
        }
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      {props.error && <Text style={styles.errorText}>{props.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

const mapStateToProps = (state) => ({
  error: state.auth.error,
});

export default connect(mapStateToProps, { login })(LoginScreen);
