import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from "../screens/auth/LoginScreen";
//import HomeScreen from "../screens/auth/HomeScreen";
import Login from "../screens/auth/Login";
import Welcome from "../screens/auth/Onboard";
import Register from '../screens/auth/Register';
import forgetpaswd from '../screens/auth/forgetpaswd';
import Emailveri from '../screens/auth/Emailveri'
import Resetpaswd from '../screens/auth/Resetpaswd';

const Stack = createStackNavigator();



export default function AuthStack() {
  return (
      <Stack.Navigator initialRouteName="Onboard">
          <Stack.Screen
      name="Onboard"
      component={Welcome}
              options={{ headerShown: false }}

              
    />
    
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={Register}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="forgetpaswd"
      component={forgetpaswd}
      options={{ headerShown: false }}
    />
     <Stack.Screen
      name="Emailveri"
      component={Emailveri}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Resetpaswd"
      component={Resetpaswd}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
  )
}