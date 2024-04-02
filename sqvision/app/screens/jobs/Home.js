import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Dimensions,
  Modal,
  Alert,
  Animated,
  Image,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  
} from "react-native";
import { FlatGrid, FlatList } from "react-native-super-grid";
//import { FlatList } from "react-native-gesture-handler";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS, ROUTES } from "../../constants";
import Header from "../../Layout/Header";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState , useCallback} from "react";
import { useSelector } from "react-redux";
import { KeyboardAvoidingView, Platform } from 'react-native'
import { API_DOM} from "../../constants/apiConf";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
 

const windowWidth = Dimensions.get("window").width;

const windowHeight = Dimensions.get("window").height;



let usr_data;

export default function Home() {
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);

  const [selectedTab, setSelectedTab] = useState("all");

  const [isLocationModalVisible, setLocationModalVisible] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState("Bangalore");

  const [scaleValue] = useState(new Animated.Value(1));

  const [selectedButton, setSelectedButton] = useState("All Jobs");
  
  const [refreshing, setRefreshing] = useState(false);

  const [searchText, setSearchText] = useState("");
  const locations = [
    "Bangalore",
    "New Delhi",
    "Mumbai",
    "Hyderabad",
    "Chennai",
  ];

  const [jobs, setJobs] = useState(null);
  const [acceptedJobsData, setacceptedJobsData] = useState(null);
  const [completedJobsData, setCompletedJobsData] = useState(null);
  const [allJobsData, setAllJobsData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);
    const accessToken = user.access_token;
    const user_company = user.company
    console.log("***",user)
    usr_data = user;

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      // Call your data-fetching function here
      getJobs(setJobs, setacceptedJobsData, accessToken, user_company);
      setRefreshing(false);
    }, []);
    useEffect(() => {
    const refreshData = () => {
      getJobs(setJobs, setacceptedJobsData, accessToken, user_company);
    };

    const unsubscribe = navigation.addListener("focus", () => {
      refreshData();
    });

    refreshData(); // Initial data fetch

    return unsubscribe;
  }, [navigation, accessToken, user_company]);


  function getJobs(setJobs, setacceptedJobsData, accessToken,user_company) {
    setIsLoading(true);
    const token = accessToken;
  
    axios
      .get(`${API_DOM}/native/sqvision/api/v1/jobs?Organization=${user_company}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++=", res.data);
        setJobs(res.data);
        const jobsData = res.data;
        function calculateAging(createdDate) {
          const currentDate = new Date();
          const jobDate = new Date(createdDate);
          const timeDifference = currentDate - jobDate;
          const daysAging = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          return `${daysAging}d`;
        }

        // Transform JSON data into the desired format
        // Transform JSON data into the desired format
      const acceptedJobsData = jobsData
      .filter((job) => job.is_accepted === 'Yes' && job.status !== 'Completed') // Filter based on the condition accepted_job === 'yes'
      .map((job) => ({
        jobId: job.id,
        jobNumber: job.job_number,
        Location: job.location,
        latitude: job.latitude,
        longitude: job.longitude,
        aging: calculateAging(job.created_date),
        category: job.categories, // Split categories into an array
        job_image: job.job_image,
        is_accepted: job.is_accepted,
        status : job.status,
      }));

    setacceptedJobsData(acceptedJobsData);
    const completedJobsData= jobsData
    .filter((job) => job.status=== 'Completed') // Filter based on the condition accepted_job === 'yes'
    .map((job) => ({
      jobId: job.id,
      jobNumber: job.job_number,
      Location: job.location,
      latitude: job.latitude,
      longitude: job.longitude,
      aging: calculateAging(job.created_date),
      category: job.categories, // Split categories into an array
      job_image: job.job_image,
      is_accepted: job.is_accepted,
      status : job.status,
    }));
    setCompletedJobsData(completedJobsData);
    const allJobsData= jobsData
    .filter(job => job.status !== 'Completed' && job.is_accepted !== 'Yes')
    .map((job) => ({
      jobId: job.id,
      jobNumber: job.job_number,
      Location: job.location,
      latitude: job.latitude,
      longitude: job.longitude,
      aging: calculateAging(job.created_date),
      category: job.categories, // Split categories into an array
      job_image: job.job_image,
      is_accepted: job.is_accepted,
      status : job.status,
    }));
    setAllJobsData(allJobsData);
    setIsLoading(false);
  })
  .catch((error) => {
    setIsLoading(false); // Set loading to false if an error occurs
    console.error("Error fetching data:", error);
  });
}
  useEffect(() => {
    getJobs(setJobs, setacceptedJobsData, accessToken,user_company);
  }, [accessToken]);
  const toggleLocationModal = () => {
    setLocationModalVisible(!isLocationModalVisible);
  };



  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const goToProfile = () => {
    navigation.navigate('Profile');
  };
  

  const handleLocationChange = (newLocation) => {
    setSelectedLocation(newLocation);
  };

  if (acceptedJobsData !== null) {
    acceptedJobsData.forEach((job) => {
      const agingValue = parseInt(job.aging.match(/\d+/)[0]);
  
      if (agingValue > 10) {
        job.agingColor = COLORS.dangerLinear;
      } else if (agingValue > 5) {
        job.agingColor = COLORS.warningLinear;
      } else {
        job.agingColor = COLORS.successLinear;
      }
    });
  }
  
  if (completedJobsData !== null) {
    completedJobsData.forEach((job) => {
      const agingValue = parseInt(job.aging);
  
      if (agingValue > 10) {
        job.agingColor = COLORS.dangerLinear;
      } else if (agingValue > 5) {
        job.agingColor = COLORS.warningLinear;
      } else {
        job.agingColor = COLORS.successLinear;
      }
    });
  }
  
  if (allJobsData !== null) {
    allJobsData.forEach((job) => {
      const agingValue = parseInt(job.aging.match(/\d+/)[0]);
  
      if (agingValue > 10) {
        job.agingColor = COLORS.dangerLinear;
      } else if (agingValue > 5) {
        job.agingColor = COLORS.warningLinear;
      } else {
        job.agingColor = COLORS.successLinear;
      }
    });
  }
  
  const filterJobs = (jobs) => {
    if (searchText.trim() === "") {
      return jobs;
    }

    const filteredJobs = jobs.filter(
      (job) =>
        job.jobNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        job.Location.toLowerCase().includes(searchText.toLowerCase())
    );

    return filteredJobs;
  };


//   const onSearch=(text)=>{
//     if(text == '') {
//       setAllJobsData(oldData);
//     }else{
//     let tempList=data.filter(item=>{
//       return item.title.toLowerCase().indexOf(text.toLowerCase()) > -1 ;

//     });
//     setAllJobsData(tempList)
//   };
//  }
  const button = [
    { tab: "accepted", iconName: "check", buttonName: "Accepted Jobs" },

    { tab: "assigned", iconName: "tasks", buttonName: "Assigned Jobs" },

    { tab: "rejected", iconName: "times", buttonName: "Rejected Jobs" },
  ];
  const renderJobList = () => {
    let gridData = [];
    //let isRejected = false; // flag to determine if jobs are rejected

    if (selectedTab === "accepted") {
      gridData = filterJobs(acceptedJobsData ? acceptedJobsData : []);
    } else if (selectedTab === "closed") {
      gridData = filterJobs(completedJobsData);
    } else {
      gridData = filterJobs(allJobsData);
      // isRejected = true; // set the flag to true for rejected jobs
    }

    const numColumns = Math.floor(windowWidth / 120); // Adjust the width as needed
    const itemWidth = windowWidth / numColumns;

    return (
      <View style={styles.newContainer}>
      <FlatGrid 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.jobTiles}
        itemDimension={itemWidth}
        data={gridData}
        renderItem={({ item }) => (
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
          onPressIn={() => {
            Animated.spring(scaleValue, {
                toValue: 0.95,
                friction: 3,
                useNativeDriver: false
            }).start();
        }}
        onPressOut={() => {
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 3,
                useNativeDriver: false
            }).start();
        }}
    
            style={styles.gridItem}
            onPress={() => {
              // if (!isRejected) {
                // Only navigate if jobs are not rejected

                //console.log('????????????',item);
                navigateToJobDetails(
                  item.jobNumber,
                  selectedLocation,
                  item.category,
                  item.job_image,
                  item.latitude,
                  item.longitude,
                  item.location,
                  item.jobId,
                  
                 item,
                );
              }
            }
            
            // activeOpacity={isRejected ? 1 : 0.2} // If it's rejected, keep the opacity same when pressed, else use the default value
            // disabled={isRejected} // Disable touch for rejected jobs
          >
            <ImageBackground
              source={{ uri: item.job_image }}
              //source={item.jobNumber==4126?Metro:item.job_image} // Use your image source here
              // style={styles.backgroundImagecard}
              style={[
                styles.backgroundImagecard,
                { alignItems: "flex-end", justifyContent: "flex-end" },
              ]}
            >
              <View style={styles.overlay}>
                <LinearGradient
                  colors={[item.agingColor, "rgba(0, 0, 0, 0)"]}
                  style={styles.gradientOverlay}
                  start={{ x: 0, y: 0.5 }} // Start from the left
                  end={{ x: 1, y: 0.5 }} // End at the right
                  locations={[0.4, 0.7]}
                />

                {item.jobNumber !== "4126" && (
                  <>
                    <Text style={styles.jobNumberOverlay}>
                      {item.jobNumber}
                    </Text>
                  </>
                )}
                <Text style={styles.locationOverlay}>{item.Location}</Text>
                {item.jobNumber !== "4126" && (
                  <>
                    <Text style={styles.agingOverlay}>({item.aging})</Text>
                  </>
                )}
              </View>
            </ImageBackground>
          </TouchableOpacity>
          </Animated.View>
        )}
      />
      </View>
    );
  };

 

  const navigateToJobDetails = (jobNumber, location, category, job_image,latitude,longitude, jobId, item) => {
    // setJobSelected(jobNumber)
    //console.log('1!!!!!!!!!1',item)
    const jobID =item;
    const jobSelected = jobNumber;
    navigation.navigate(ROUTES.JOBS, {
      jobSelected,
      location,
      latitude,
      longitude,
      category,
      job_image,
      jobID,
      
    });
  //  console.log("===",
  //  location,
  //  jobID,
   
  //  )
  };

  return (

    
    <ImageBackground
    
      source={require("../../../assets/bg/bg2.png")} // Replace with your image source
      style={styles.backgroundImage}
    >
      {isLoading ? ( // If isLoading is true, display the loader
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
        <KeyboardAvoidingView
          style={styles.parentContainer}
          
          //the below one has to be commented for I phone

          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : windowHeight * -.24}
        >
          <StatusBar barStyle="dark-content" />
          <View style={styles.parentContainer}>
            <View style={styles.header}>
              <Header onLocationChange={handleLocationChange} />

              <TouchableOpacity
                style={styles.profileIcon}
                onPress={goToProfile}
              >
                <Icon
                  name="user-circle"
                  size={windowWidth * 0.07}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.locationIcon}
                onPress={toggleLocationModal}
              >
                <Icon
                  name="map-marker"
                  size={windowWidth * 0.04}
                  color="blue"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View style={styles.searchContainer}>
                <View
                  style={{
                    flexDirection: "row",

                    alignItems: "center",

                    borderRadius: 5,
                  }}
                >
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search job by number or location..."
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                    // editable={false}
                    
                  />

                  <Icon
                    name="search"
                    size={windowWidth * 0.05}
                    color="blue"
                    style={{
                      position: "absolute",

                      right: 10,

                      marginRight: 10, // adjust as needed
                    }}
                  />
                </View>
              </View>
              <View style={styles.buttonContainer}>
              <TouchableOpacity
  style={[
    styles.button,
    selectedButton === "All Jobs" ? styles.activeButton : styles.inactiveButton,
    { paddingHorizontal: 15, paddingVertical: 2.5, marginRight: 5 }, // Adjust the padding and margin as needed
  ]}
  onPress={() => {
    setSelectedButton("All Jobs");
    setSelectedTab("all"); // Update the selectedTab value accordingly
  }}
>
  <Text style={styles.buttonText}>All Jobs</Text>
</TouchableOpacity>
<TouchableOpacity
  style={[
    styles.button,
    selectedButton === "Accepted Jobs" ? styles.activeButton : styles.inactiveButton,
  ]}
  onPress={() => {
    setSelectedButton("Accepted Jobs");
    setSelectedTab("accepted"); // Update the selectedTab value accordingly
  }}
>
  <Text style={styles.buttonText}>My Jobs</Text>
</TouchableOpacity>
<TouchableOpacity
  style={[
    styles.button,
    selectedButton === "Closed Jobs" ? styles.activeButton : styles.inactiveButton,
  ]}
  onPress={() => {
    setSelectedButton("Closed Jobs");
    setSelectedTab("closed"); // Update the selectedTab value accordingly
  }}
>
  <Text style={styles.buttonText}>Closed Jobs</Text>
</TouchableOpacity>

        </View>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isLocationModalVisible}
                  onRequestClose={() => {
                    //   Alert.alert("Modal has been closed.");

                    setLocationModalVisible(!isLocationModalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Picker
                        selectedValue={selectedLocation}
                        onValueChange={(itemValue) =>
                          setSelectedLocation(itemValue)
                        }
                      >
                        {locations.map((location, index) => (
                          <Picker.Item
                            key={index}
                            label={location}
                            value={location}
                          />
                        ))}
                      </Picker>

                      <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={toggleLocationModal}
                      >
                        <Text style={styles.textStyle}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>

              {renderJobList()}
            </View>
          {/* </View> */}
          </KeyboardAvoidingView>
        </>
        
      )}
    </ImageBackground>
  );
}
  

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  newContainer: {
    flex: 1,
  },

  container: Platform.select({
    ios: {
      flex: 1,

      top: windowHeight * 0.12,

      padding: windowWidth * 0.015,
    },

    android: {
      flex: 1,

      top: windowHeight * 0,

      padding: windowWidth * 0.015,
    },
  }),
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 8,
    marginLeft:8,
    
  },
  jobTiles: {
    //position:"absolute",
    marginTop: responsiveHeight(-24), // This is roughly equivalent to -230 for a typical device height of 920 units
},
  
  searchContainer: {

  flexDirection: "row",
  alignItems: "center",
  padding: windowWidth * 0.008,
  borderRadius: windowWidth * 0.02,
  backgroundColor: "transparent",
  ...Platform.select({
    ios: {
      marginTop: windowHeight * 0.001,
    },
    android: {
      marginTop: responsiveHeight(12),
    },
    default: {
      marginTop: windowHeight * 0.001, // Fallback for other platforms
    },
  }),
  },

  searchInput: {
    height: responsiveHeight(4),

    width:responsiveWidth(95),

    borderWidth: responsiveWidth(.3),

    borderColor: COLORS.grey,

    borderRadius: windowWidth * 0.02,

    paddingHorizontal: responsiveWidth(3),

    color: COLORS.black,
  },

  iconContainer: {
    marginRight: windowWidth * 0.02,

    marginLeft: windowWidth * 0.03,
  },

  button: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: windowWidth * 0.04,

    paddingVertical: windowHeight * 0.010,

    borderRadius: windowWidth * 0.02,

    marginRight: windowWidth * 0.015,
  },

  activeButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "green",
  },

  inactiveButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "purple",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
   
  },

  buttonIcon: {
    marginRight: windowWidth * 0.015,
  },

  buttonText: {
    color: "purple",

    fontWeight: "bold",
  },

  notificationContainer: {
    backgroundColor: COLORS.secondary,

    borderRadius: windowWidth * 0.01,

    marginLeft: windowWidth * 0.01,

    paddingHorizontal: windowWidth * 0.008,
  },

  notificationText: {
    color: "white",
  },

 

  icon: {
    marginBottom: windowHeight * 0.007,
  },

  jobNumber: {
    fontSize: windowWidth * 0.05,

    fontWeight: "bold",
  },

  location: {
      fontSize: windowWidth * 0.035,

      marginBottom: windowHeight * 0.1,
    },
 

  aging: {
    fontSize: windowWidth * 0.03,
  },

  profileIcon: {
    position: "absolute",

    right: 20,

    top: 50,
  },

  locationIcon: {
    position: "absolute",

    left: 10,

    top: 76,
  },

  centeredView: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    marginTop: 22,
  },

  modalView: {
    margin: 20,

    backgroundColor: "white",

    borderRadius: 20,

    padding: 35,

    alignItems: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,

      height: 2,
    },

    shadowOpacity: 0.25,

    shadowRadius: 4,

    elevation: 5,
  },

  buttonClose: {
    backgroundColor: "#2196F3",
  },

  textStyle: {
    color: "white",

    fontWeight: "bold",

    textAlign: "center",
  },

  modalText: {
    marginBottom: 15,

    textAlign: "center",
  },

  avatar: {
    width: 100,

    height: 100,

    borderRadius: 50,

    marginBottom: 15,
  },

  centeredView: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    marginTop: 22,
  },

  

  backgroundImage: {
    flex: 1,
    opacity: 1,

    resizeMode: "cover", // Make the image cover the entire container
  },
  jobImage: {
    width: windowWidth * 0.1, // Adjust the width as needed
    height: windowHeight * 0.1, // Adjust the height as needed
    marginBottom: windowHeight * 0.007, // Adjust the margin as needed
  },

  jobImage: {
    marginBottom: windowHeight * 0.007,
  },

  gridItem: {

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 3,  // for Android
    justifyContent: "center",
    alignItems: "center",
    
    margin: windowWidth * 0.008,
    borderColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white border
    borderRadius: 10,
    overflow: "hidden",
    height: 100,
    backgroundColor: "transparent",
    shadowColor: "rgba(0, 0, 0, 0.9)", // Semi-transparent black shadow
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.4, // Adjust shadow opacity
    shadowRadius: 8,
  },

  backgroundImagecard: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },

  overlay: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    paddingLeft: 6,
    // paddingTop:6
  },

  gradientOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    // borderRadius: 10,
  },

  jobNumberOverlay: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },

  locationOverlay: {
    fontSize: 16,
    color: "white",
  },

  agingOverlay: {
    fontSize: 14,
    color: "white",
  },
});
