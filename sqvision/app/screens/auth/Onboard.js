import { View, Text, Pressable, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ROUTES } from "../../constants";
import Button from '../../components/Button';
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      style={styles.container}
      colors={['#8e4285', '#007260']}
    >
      <View style={styles.backgroundContainer}>
        <Image
          source={require("../../../assets/bg/hero1.png")}
          style={styles.image1}
        />
        <Image
          source={require("../../../assets/bg/hero3.png")}
          style={styles.image2}
        />
        <Image
          source={require("../../../assets/bg/hero3.png")}
          style={styles.image3}
        />
        <Image
          source={require("../../../assets/bg/hero2.png")}
          style={styles.image4}
        />
      </View>

      {/* content  */}
      <View style={styles.contentContainer}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />
        <Image
          source={require("../../../assets/sqword.png")}
          style={styles.sqword}
        />
        <Text style={styles.title}>
        Simultaneous Quality Uplift in Real Time Reasoning at Edge Location
        </Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Connect and explore the world of computer vision
          </Text>
        </View>

        <Button
          title="Join Now"
          onPress={() => navigation.navigate(ROUTES.REGISTER)}
          style={styles.joinNowButton}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account ?
          </Text>
          <Pressable onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.loginLink}>
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: "relative",
    flex: 1,
    overflow: "hidden",
  },
  image1: {
    height: windowHeight * 0.1,
    width: windowHeight * 0.1,
    borderRadius: 20,
    position: "absolute",
    top: windowHeight * 0.06,
    left: windowWidth * 0.05,
    transform: [
      { rotate: "-15deg" },
    ],
  },
  image2: {
    height: windowHeight * 0.1,
    width: windowHeight * 0.1,
    borderRadius: 20,
    position: "absolute",
    top: -windowHeight * 0.02,
    left: windowWidth * 0.35,
    transform: [
      { rotate: "-5deg" },
    ],
  },
  image3: {
    width: windowHeight * 0.1,
    height: windowHeight * 0.1,
    borderRadius: 20,
    position: "absolute",
    top: windowHeight * 0.115,
    left: windowWidth * -0.25,
    transform: [
      { rotate: "15deg" },
    ],
  },
  image4: {
    height: windowHeight * 0.2,
    width: windowHeight * 0.2,
    borderRadius: 20,
    position: "absolute",
    top: windowHeight * 0.09,
    left: windowWidth * 0.35,
    transform: [
      { rotate: "-15deg" },
    ],
  },
  contentContainer: {
    paddingHorizontal: windowWidth * 0.06,
    position: "absolute",
    bottom: windowHeight * 0.1,
    width: "100%",
  },
  logo: {
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    marginRight: windowWidth * 0.03,
  },
  sqword: {
    width: windowWidth * 0.6,
    height: windowWidth * 0.15,
    resizeMode: "contain",
  },
  title: {
    fontSize: windowWidth * 0.06,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: windowWidth * 0.09,
  },
  descriptionContainer: {
    marginVertical: windowWidth * 0.04,
  },
  description: {
    fontSize: windowWidth * 0.035,
    color: "#FFFFFF",
    marginVertical: windowWidth * 0.01,
  },
  joinNowButton: {
    marginTop: windowWidth * 0.02,
    width: "100%",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: windowWidth * 0.024,
    justifyContent: "center",
  },
  loginText: {
    fontSize: windowWidth * 0.035,
    color: "#FFFFFF",
  },
  loginLink: {
    fontSize: windowWidth * 0.035,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: windowWidth * 0.01,
  },
});

export default Welcome;
