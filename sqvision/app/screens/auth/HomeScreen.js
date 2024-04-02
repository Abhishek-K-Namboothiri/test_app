import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { logout } from '../../redux/authActions';

function HomeScreen(props) {
  const handleLogout = () => {
    // Dispatch the logout action
    props.logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {props.user ? props.user.name : 'Guest'}!</Text>
      <Button title="Logout" onPress={handleLogout} />
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
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(HomeScreen);
