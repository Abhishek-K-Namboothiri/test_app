import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import { useSelector } from "react-redux";
import AuthStack from "./AuthStack";


export default function Router() {
  const user = useSelector((state) => state.auth.user);

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
