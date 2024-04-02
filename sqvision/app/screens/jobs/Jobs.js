import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  RefreshControl,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ImageBackground,
  Platform,
  Linking,//linking the maps for location
  
} from "react-native";
import { Accelerometer} from 'expo-sensors';


import { FontAwesome,Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";
import { COLORS } from "../../constants";
import axios from "axios";
import FloorImage from "../../../assets/overlay/qr-code.png";
import ParkingImage from "../../../assets/overlay/security.png";
import minus from "../../../assets/overlay/minus.png";
import circle from "../../../assets/overlay/circle.png";
import Entryimage from "../../../assets/overlay/scan.png";
import ParkingImg from "../../../assets/overlay/parking.png";
import JobsHeader from "../../Layout/JobsHeader";

import { API_DOM, IMAGE_UPLOAD, COMPLETE, ACCEPT, JOBS, OTHER } from "../../constants/apiConf";
import { useSelector } from "react-redux";
import { Colors } from "react-native/Libraries/NewAppScreen";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CustomCamera = ({ onCloseCamera, onCapture, category,jobSelected }) => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
 //console.log("am new",jobSelected)


  let categoryImage;

  switch (category.title) {
    case "Ramp":
      categoryImage = [circle, minus];
      break;

    case "Washroom":
      categoryImage = [ParkingImage];
      break;

    case "Barcode":
      categoryImage = [FloorImage];
      break;

    case "Entry":
      categoryImage = [Entryimage];
      break;

    case "Parking":
      categoryImage = [ParkingImg];
      break;

    default:
      categoryImage = [];
  }

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.pausePreview(); // Pause the camera preview initially
    }
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: .8, // Adjust the quality as needed
        // height: 400,
        // width: 400,
      });
      setCapturedImage(photo.uri);
      setIsPreview(true);
    }
  };
  //console.log(setCapturedImage);

  const handleRetake = () => {
    setCapturedImage(null);
    setIsPreview(false);
    if (cameraRef.current) {
      cameraRef.current.resumePreview();
    }
  };

  const handleSave = () => {
    if (capturedImage) {
      onCapture(capturedImage, category);
    }
    setCapturedImage(null);
    setIsPreview(false);
    onCloseCamera(); // Close the camera after saving the image
  };
  

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          {categoryImage.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={{
                width: index === 0 ? "30%" : "75%",
                height: "30%",
                opacity: 0.5,
                position: index > 0 ? "absolute" : "relative",
                top: index > 0 ? "85%" : undefined,
              }}
            />
          ))}
        </View>
      </Camera>
      

      {!isPreview && (
        <>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
          >
            <Text style={styles.captureButtonText}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onCloseCamera}>
          <MaterialIcons name="cancel" size={60} color="white" />
          </TouchableOpacity>
        </>
      )}

      {isPreview && (
        <>
        <View style={styles.previewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          </View>
          <View style={styles.buttonsContainer}>
            {/* Save button */}
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}> Save </Text>
            </TouchableOpacity>
        
            {/* Retake button */}
            <TouchableOpacity style={styles.button} onPress={handleRetake}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const ImageComponent = ({ imageUrl, VariableDetected, category, onImagepress, openCategoryInfo }) => {
  const [isImageLoading, setImageLoading] = useState(true);

  const handleLoadEnd = () => {
    // Wait for 3 seconds (3000 milliseconds) before hiding the loader
    setTimeout(() => {
        setImageLoading(false);
    }, 3000);
    
};
  //  const streamedDataItem = category.stream_data.find(
  //    item => item.image === imageUrl.split("_").pop().split(".")[0]
  //  );
  //VariableDetected = streamedDataItem?.Inference_Data?.Variable || null;
  //alert(streamedDataItem);
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log(VariableDetected);
  const imageCardStyle =
    VariableDetected !== null ? styles.greenBorder : styles.dangerBorder;
  ////console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  ////console.log(VariableDetected);
  return (
    <View style={styles.imageContainer}>
    <TouchableOpacity
      style={[styles.imageCard, imageCardStyle]}
      onPress={() =>{
        openCategoryInfo(category);
        onImagepress(API_DOM + imageUrl, VariableDetected);
    }} // Show category info when clicking the image
      
    >
    <View style={styles.imageLoaderContainer}>

<Image

  source={{ uri: API_DOM + imageUrl }}

  style={styles.image}

  resizeMode="cover"
  

  onLoadEnd={handleLoadEnd}  // Image has been loaded

/>

{isImageLoading && (

  <ActivityIndicator color={COLORS.purple} style={styles.imageActivityIndicator} />

)}

</View>
    </TouchableOpacity>
      {VariableDetected !== null && (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText} numberOfLines={1} ellipsizeMode="tail"> {VariableDetected}</Text>
        </View>
      )}
      </View>
    
  );
};


const Jobs = (props) => {


  const user = useSelector((state) => state.auth.user);
  const accessToken = user.access_token;
  //console.log('###################################', props.route.params)
  const { jobSelected = null, location = null, category = null, job_image = null, longitude=null,latitude=null, jobID =null, jobId=null } = props.route.params;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCameraModalVisible, setCameraModalVisible] = useState(false);
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [switchStates, setSwitchStates] = useState({});
  const [currentVariableDetected, setCurrentVariableDetected] = useState(null);
  const [shouldAutoRefresh, setShouldAutoRefresh] = useState(false);
  const [job_location, setLocation] = useState("");
  const [timerVisible, setTimerVisible] = useState(false);
  const [timer, setTimer] = useState(5); // Set the initial timer value in seconds

  //the part for hardware based angle testing

  const [data, setData] = useState({});
  const [angle, setAngle] = useState(null);
  const [capturedAngle, setCapturedAngle] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [showCapturedAngle, setShowCapturedAngle] = useState(false);
  const [capturedAngleText, setCapturedAngleText] = useState('');
  let subscription = null;

  const _subscribe = () => {
    subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      calculateAngle(accelerometerData);
    });
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
  };

  const calculateAngle = data => {
    const { x, y, z } = data;
    const tiltAngle = Math.atan2(y, Math.sqrt(x * x + z * z)) * (180 / Math.PI);
    setAngle(tiltAngle);
  };

  const round = number => {
    return Math.round(number * 100) / 100;
  };

  const captureAngle = () => {
    setCapturing(true);
    _subscribe();
    setTimeout(() => {
      const positiveAngle = Math.floor(angle);
      //console.log('||||||||||||||||||||||||||||||||||||||||||||||',positiveAngle);
      setCapturedAngle(round(positiveAngle));
      setCapturing(false);
      _unsubscribe();
    }, 5000);
  };

  const renderAngle = () => {
    if (angle !== null) {
      return <Text>Tilt Angle: {round(angle)} degrees</Text>;
    }
    return null;
  };

  const renderCapturedAngle = () => {
    if (capturedAngle !== null) {
      return <Text>Captured Angle: {round(capturedAngle)} degrees</Text>;
    }
    return null;
  };

  let { x, y, z } = data;

  const startTimer = () => {
    setTimerVisible(true);
  
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        const nextTimer = prevTimer - 1;
  
        if (nextTimer <= 0) {
          clearInterval(intervalId);
          //setTimerVisible(false);
          //captureAngle();
          
          return 5; // Ensure the timer stays at 0
          
        }
  
        return nextTimer;
      });
    }, 1000);
  };
  
  //part for the job location button
  
  const joblocation ={

    latitude:latitude,
    longitude:longitude
  }
  useEffect(() => {
    const fetchJobLocation = async () => {
        try {
            const response = await axios.get(
                `${JOBS}/${jobID}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            
            // Extracting the location value
            const locationValue = response.data.location;
            setLocation(locationValue);
            //console.log("-----------------------------------------------------------Location:", location); // Console the location value
        } catch (error) {
            console.error("Error fetching job details:", error);
        }
    };
    fetchJobLocation();
}, [accessToken, jobId]);

// for opening the location in google maps
const openGoogleMaps = () => {
  const latitude = joblocation.latitude;  
  const longitude = joblocation.longitude;
  
  const scheme = Platform.OS === 'ios' ? 'comgooglemaps://' : 'geo:';
  const url = `${scheme}?q=${latitude},${longitude}`;

  Linking.openURL(url);
}
//console.log('[[[]]]', jobID)

//the part for handling submit button

const handleSubmit = async () => {
  try {
    const response = await axios.put(
      `${COMPLETE}/${jobID}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    //console.log("Response from backend:", response.data);
    
  } catch (error) {
    console.error("Error sending data to the backend:", error);
  }
};

  //the part for toggle switch for accepted jobs

  const handleSwitchToggle = (state) => {
    setSwitchStates(prevState => ({ ...prevState, [jobSelected]: state }));
};

  const toggleToolTip = () => {
    setToolTipVisible(!toolTipVisible);
  };

  //part for navigation to imagepopup.js

  const navigation = useNavigation();
  const handleImagePress = (imageUrl, variableDetected) => {
    
    navigation.navigate('ImagePopup', {
      imageUrl,
      variableDetected,
      category: selectedCategory,
    });
};
const handleImageModalClose = () => {
  setCurrentImage(null);
  setCurrentVariableDetected(null); // Clear the variable here
  setImageViewVisible(false);
}

//the part for refresh control for the jobs page

const onRefresh = async (accessToken = user.access_token) => {
  //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6',accessToken)
  
    setRefreshing(true);
    
  
    try {
      const response = await axios.get(
        `${IMAGE_UPLOAD}?jobno=${encodeURIComponent(
          jobSelected
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            
          },
        }
      );
      setCategories(response.data);
      
    } catch (error) {
      
      console.error('**Error fetching categories:', error);
    } finally {
      setRefreshing(false);
    }
  };
  

  const [categories, setCategories] = useState([]);
  

  const fetchCategories = async (API_DOM,accessToken) => {
    
    try {
      const apiUrl = `${IMAGE_UPLOAD}?jobno=${encodeURIComponent(
        jobSelected
      )}`;
      const response = await axios.get(
        apiUrl,
        //`http://3.122.184.47:8040/sqvision/api/v1/image-upload?jobno=${encodeURIComponent(jobNumber)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // ////console.log(jobNumber);
      //////console.log(response.data)
      setCategories(response.data);
      //console.log(response.data)
    } catch (error) {
      ////console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories(API_DOM,accessToken);
    //console.log('*************', accessToken, shouldAutoRefresh)
    if (shouldAutoRefresh) {

      // Trigger your refresh logic here after 10 seconds
      setTimeout(() => {
        onRefresh(API_DOM,accessToken);
      }, 10000); // 10 seconds
    }
  }, [jobSelected, shouldAutoRefresh, API_DOM,accessToken]);

  
  //console.log("1 Uploading image for job:", jobSelected); // <-- Added this line
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        ////console.log("Permission denied for camera roll access.");
      }

      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        ////console.log("Permission denied for camera access.");
      }
    })();
  }, []);
  //console.log("2 Uploading image for job:", jobSelected); // <-- Added this line
  const handleOpenCameraModal = () => {
    setCameraModalVisible(true);
  };

  const handleCloseCameraModal = () => {
    setCameraModalVisible(false);
  };
  const setopenhardwareModal = () => {
    setTimerVisible(true);
  };
  const setclosehardwareModal = () => {
    setTimerVisible(false);
  };
  // alert(jobSelected) 
  const handleImageSelection = useCallback(async (image, category) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const currentJobSelected = jobSelected; 
      const imageName = `${currentDate}_${ 
        category.folder
      }_${location}_${currentJobSelected.replace("#", "")}.jpeg`;
      //console.log("3 Uploading image for job:--", currentJobSelected); // <-- Added this line
      const fileInfo = await FileSystem.getInfoAsync(image);

      //console.log(`Image size: ${fileInfo.size} bytes`);

      const url = `${IMAGE_UPLOAD}`;
      //console.log("4 Uploading image for job:--", jobSelected); // <-- Added this line
      const formData = new FormData();
      formData.append("name", imageName);
      formData.append("description", category.title);
      formData.append("category", category.title);
      ////console.log(category);
      formData.append("folder", category.folder);

      formData.append("jobno", jobSelected.replace("#", ""));
      formData.append("geo", jobSelected.replace("#", ""));
      formData.append("location", location);
      formData.append("image", {
        uri: image,
        name: imageName,
        type: "image/jpeg",
      },
      //console.log("5 Uploading image for job:--", jobSelected) // <-- Added this line
      );

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };
      //console.log("6 Uploading image for job:", jobSelected); // <-- Added this line
      const response = await axios.post(url, formData, { headers });
      console.log("Image uploaded successfully:", response);

      const filename = `${Date.now()}.jpg`;
      const destinationUri = `${FileSystem.documentDirectory}images/${filename}`;

      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}images/`,
        {
          intermediates: true,
        }
      );

      await FileSystem.moveAsync({
        from: image,
        to: destinationUri,
      });

      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.map((prevCategory) => {
          if (prevCategory.id === category.id) {
            return {
              ...prevCategory,
              images: [destinationUri, ...prevCategory.images],
            };
          }
          return prevCategory;
        });
        return updatedCategories;
      });
      
    } catch (error) {
      ////console.log("Error capturing image:", error.message);
    }
    finally{

      fetchCategories(API_DOM,accessToken);
      setShouldAutoRefresh(true);
      setTimeout(() => {
        setShouldAutoRefresh(false);
      }, 20000);
    }
  },  [jobSelected, location,API_DOM,IMAGE_UPLOAD,accessToken]);

  const openCategoryInfo = (category) => {
    setSelectedCategory(category);
    toggleToolTip();
  };

  const closeCategoryInfo = () => {
    setSelectedCategory(null);
  };

  const handleOtherUpload = async (category) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const currentJobSelected = jobSelected; 
    const imageName = `${currentDate}_${capturedAngle}_${category.folder}_${location}_${currentJobSelected.replace("#", "")}.jpeg`;
    let data = new FormData();
    data.append("name", imageName);
    data.append("description", category.title);
    data.append("category", category.title);
      ////console.log(category);
    data.append("folder", category.folder);

    data.append("jobno", jobSelected.replace("#", ""));
    data.append("geo", jobSelected.replace("#", ""));
    data.append("location", location);
    data.append('angle', capturedAngle);
  
    try {
      let response = await fetch(`${OTHER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: data
      });
      //console.log('||||||||||||||||||||', data);
      let jsonResponse = await response.json();
      //console.log(JSON.stringify(jsonResponse));
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <>
    
    <ImageBackground
      source={require('../../../assets/bg/bg2.png')}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.parentContainer}>
      <JobsHeader  switchState={switchStates[jobSelected]} onToggleSwitch={handleSwitchToggle} jobId={jobID} />
      

        <View style={styles.container}>

        {/* <View style={styles.jobNameCard}> */}
        {/* <Text style={styles.jobNameText}>{jobSelected}</Text>
          </View> */}
              <View style={styles.jobNameCard}>
  <ImageBackground
    source= {{uri : job_image}} // Use your image source here
    style={styles.backgroundImage}
  >
    {/* Empty View for overlay positioning */}
    <View style={styles.overlayContainer}>
      {/* Text Components */}
      <Text style={styles.jobNameText}>{jobSelected}</Text>
      {/* Add other text components here */}
    </View>
  </ImageBackground>
</View>
<TouchableOpacity style={styles.viewLocationButton} onPress={openGoogleMaps} hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Entypo name="location-pin" size={26} color= {COLORS.blue} />
        <Text style={[styles.viewLocationButtonText, { marginLeft: 3 }]}>{job_location}</Text>
    </View>
</TouchableOpacity>

        <ScrollView style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >

          
{categories.map((category) => (
  <View key={category.id} style={styles.categoryCard}>
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryTitle}>
        {category.title.includes("_hardware")
          ? `${category.title.split("_")[0]} (Hardware)`
          : `${category.title} (${category.folder.split("_")[1]})`}
      </Text>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {category.title.includes("_hardware") ? (
        <TouchableOpacity style={styles.imageCard} onPress={() => {
          setSelectedCategory(category);
          setopenhardwareModal();}}>
          <FontAwesome name="plus" size={40} color= "#fdb140" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.imageCard}
          onPress={() => {
            setSelectedCategory(category);
            handleOpenCameraModal();
          }}
        >
          <FontAwesome name="camera" size={20} color={COLORS.purple} />
        </TouchableOpacity>
      )}
                  {


                    category.images.map((imageUrl, index) => {

                    const inputString = imageUrl.split("/").pop().split(".")[0];
                    const parts = inputString.split("_");
                    const imageId = parts[parts.length - 1];
                    //console.log('%%%%%%%%%%%%%%%%%%%%%%', imageId);
                    //console.log('*******************----', category.stream_data);
                    const streamedDataItem = findStreamedDataItem(
                      imageId,
                      category.stream_data
                    );
                    //const ws = streamedDataItem ? streamedDataItem.Inference_Data?.ws : 0;

                    //console.log('---streamedDataItem__________________________________________________________________',streamedDataItem);
                    let VariableDetected = null;
                    if (streamedDataItem && streamedDataItem.Inference_Data) {
                      VariableDetected =
                        streamedDataItem.Inference_Data["Variable"];
                      // //////console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&")
                      //console.log('streamedDataItem',streamedDataItem);
                    }
                    return (
                      <ImageComponent
                        key={index}
                        imageUrl={imageUrl}
                        //ws={ws}
                        VariableDetected={VariableDetected}
                        category={category}
                        onImagepress={handleImagePress}
                        openCategoryInfo={openCategoryInfo}
                      />
                    );
                    })
                  }
                </ScrollView>
              </View>
            ))}
            {/* angle detection */}
        {/* <View style={styles.angleSwitchContainer}>
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        {/* <Text>Accelerometer:</Text>
        <Text>
          x: {round(x)} y: {round(y)} z: {round(z)}
        </Text> */}
        {/* {renderCapturedAngle()} */}
      {/* </View>

      <View style={{ marginTop: 20 }}>
        {capturing ? (
          <Text>Waiting 5 seconds for capture...</Text>
        ) : (
          <Button onPress={captureAngle} title="Capture Angle" />
        )}
      </View>

      {capturedAngle !== null && (
        <View style={{ marginTop: 20 }}>
          <Text>Captured Angle: {round(capturedAngle)} degrees</Text>
        </View>
      )}
    </View>
    </View> */} 
             {/* Submit button */}
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton}  onPress={() => {
      handleSubmit(); // Assuming handleSubmit is defined somewhere
      navigation.goBack(); // Navigates back to the previous screen
    }}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
          </ScrollView>
          <Modal
            visible={isCameraModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <CustomCamera
                  onCloseCamera={handleCloseCameraModal}
                  onCapture={(image) => handleImageSelection(image, selectedCategory)}
    category={selectedCategory}
    jobSelected={jobSelected} // Pass jobSelected here
                />
              </View>
            </View>
          </Modal>
          <Modal
    visible={isImageViewVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={handleImageModalClose}
>
    <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={handleImageModalClose}>
            <Image source={{ uri: currentImage }} style={styles.fullscreenImage} />
        </TouchableWithoutFeedback>

        {currentVariableDetected && (
            <View style={styles.variableDetectedContainer}>
                <Text style={styles.variableDetectedText}>
                    {currentVariableDetected}
                </Text>
            </View>
        )}

        <TouchableOpacity
            style={styles.closeModalButton}
            onPress={handleImageModalClose}
        >
            <FontAwesome name="close" size={30} color="white" />
        </TouchableOpacity>
    </View>
</Modal>
 {/* Timer Modal */}
      <Modal
        visible={timerVisible}
        animationType="slide"
        //transparent={true}
        
        onRequestClose={setclosehardwareModal}
      >
        <ImageBackground
      source={require('../../../assets/bg/bg2.png')}
      style={styles.hardbackgroundImage}
    >
        <View style={styles.timerModalContainer}>
          <Text style={styles.timerAngleText}>{timer}</Text>
          {capturedAngle !== null && (
        <View style={styles.capturedAngleContainer}>
          <Text style={styles.capturedAngleText}>
            Captured Angle: {round(capturedAngle)} degrees
          </Text>
        </View>
      )}
          <View style={styles.timerButtonsContainer}>
            <TouchableOpacity
              style={styles.timerButton}
              onPress={() => {
                startTimer();
                captureAngle();
              }}
            >
              <Text style={styles.buttonText}> Start </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hardwarecloseButton}
              onPress={() => {
                setTimerVisible(false);
              }}
            >    
          <MaterialIcons name="cancel" size={60} color= "purple"/>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timerButton}
              onPress={() => {
                setTimerVisible(false);
                
                handleOtherUpload(selectedCategory);
                
                
              }}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ImageBackground>
      </Modal>
        </View>
      </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },

  container: Platform.select({
    ios: {
      flex: .75,
      top: windowHeight * 0.15, // 15% of screen height
      borderTopLeftRadius: 18,
    },
    android: {
      flex: .8,
      top: windowHeight * 0.17, // 17% of screen height
      borderTopLeftRadius: 18,
    },
  }),

  scrollView: {
    flex: 1,
  },
  submitButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },

  capturedAngleContainer: {
    // position: 'absolute',
    // top: '10%',
    // left: '30%',
    // transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    marginTop: 10,
  },
  capturedAngleText: {
    fontSize: 28,
    color: COLORS.primary,
  },
  timerAngleText: {
    fontSize: 108,
    color: COLORS.warning,
    fontWeight: "bold",
  },
  categoryCard: {
    top: 10,
    marginVertical: windowHeight * 0.031, // 2% of screen height
    paddingHorizontal: windowWidth * 0.04, // 4% of screen width
  },

  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: windowWidth * 0.02, // 2% of screen width
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },

  imageCard: {
    width: windowWidth * 0.3,  // Using 30% of screen width
    height: 120,
    marginRight: 8,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A13C95",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  timerModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
 
  fullscreenImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },

 

  closeModalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional: give a slight background for better visibility
    borderRadius: 20,  // Optional: to make it circular
    padding: 10,  // Some padding to make it touch-friendly
  },

  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 8,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },

  modalCloseButton: {
    // backgroundColor: COLORS.purple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    bottom: 20,
  },

  modalCloseButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },

  overlay: {
    flex: -1,
    aspectRatio: 1,
    position: "relative",
    top: "25%",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },

  captureButton: {
    alignSelf: "center",
    position: "absolute",
    bottom: 22,
    backgroundColor: COLORS.purple,
    padding: 18,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fdb140",
    opacity:.8,
    
  },
  hardwarecloseButton: {
    //alignSelf: "flex-end",
    position: "absolute",
    top: -720,
    backgroundColor: "transparent",
    right: 10,
    
    zIndex: 2, // Ensure the button is above other elements if needed
    // padding: 18,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fdb140",
  },
  closeButton: {
    alignSelf: "flex-end",
    position: "absolute",
    top: 10,
    backgroundColor: "transparent",
    right: 10,

    // padding: 18,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fdb140",
  },
  captureButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  greenBorder: {
    borderWidth: 4,
    borderColor: "green",
  },
  dangerBorder: {
    borderWidth: 4,
    
    borderColor: "orange",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },

  retakeButton: {
    backgroundColor: COLORS.red,
    alignSelf: "flex-end",
    // position: "absolute",
    bottom: 20,
    right: 2,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    padding: 20,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    
  },
  timerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },

  button: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 50,
    opacity:.8,
    borderWidth: 3,
    borderColor: "#fdb140",
  },
  timerButton: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 50,
    opacity:.8,
    borderWidth: 3,
    borderColor: "#fdb140",
  },
  captionContainer: {
    position: "absolute",
    top: 110,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0)", // Adjust the background color and opacity as needed
    padding: 10,
    justifyContent:'center',
    textAlign: "center",

  },
  captionText: {
    color: "black", // Adjust the text color as needed
    fontSize: 12,
    top: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20, // Adjust as needed
  },

  imageLoaderContainer: {
    position: 'relative',
    width: "100%",
    height: "100%",
  },

  imageActivityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12.5 }, { translateY: -12.5 }],  // half of the ActivityIndicator size (25 by default)
  },
  loader: {
    position: 'absolute', // this will position the loader on top of the image
    height: 10,
    width: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderBallBefore: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: '#ffa55a',
    marginBottom: 10,
    shadowColor: "#ff3d00",
    shadowOffset: {

      width: 30,

      height: 0

    },

    shadowOpacity: 1,

    shadowRadius: 0,

  },

  loaderBallAfter: {

    height: 10,

    width: 10,

    borderRadius: 10,

    backgroundColor: '#a03c94',

    shadowColor: "#fff",

    shadowOffset: {

      width: 30,

      height: 0

    },

    shadowOpacity: 1,

    shadowRadius: 0,

  },

  imageWithLoader: {

    position: 'relative',

    justifyContent: 'center',

    alignItems: 'center',

    width: "100%",

    height: "100%",

  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Make the image cover the entire container
  },
  hardbackgroundImage: {
    flex: 1,
    backgroundColor : '#FFFFFF',
    resizeMode: 'cover', // Make the image cover the entire container
  },
  jobNameCard: {
    alignSelf: 'center',
    margin: 7,
    width: windowWidth * 0.9,  // Using 90% of screen width
    height: windowHeight * 0.25, // 25% of screen height
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

imgcontainer: {
  flex: 1,
  // width
},
backgroundImage: {
  flex: 1,
  resizeMode: 'cover',
  width: windowWidth,  // Using full screen width
  height: '100%',
},

overlayContainer: {
  position: 'absolute',
  // bottom: 20, // Adjust these values to position the text as desired
  // right: 20,
  marginLeft: 10,
  marginTop: 10
},
jobNameText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
  // Add any other text styles you need
},
variableDetectedContainer: {
  width: '90%', // Adjust this percentage based on how wide you want it
 
  paddingVertical: 5,
  paddingHorizontal: 5,
  backgroundColor: 'white',
  borderRadius: 5,
  alignItems: 'center',
},

variableDetectedText: {
  color: "black", 
  fontSize: 15,
  fontWeight: "bold",
},

viewLocationButton: {
  position: 'absolute',
  top: windowHeight * 0.25,  // Adjust position as needed
  left: 8,  // Adjust position as needed
 
  //backgroundColor: COLORS.purple,
  paddingHorizontal: 12,
  paddingVertical: 12,
  borderRadius: 4,
},


//location button text
viewLocationButtonText: {
  color: COLORS.blue,
  fontSize: 14,
  marginRight: 26,
  // color : 'red',
},

angleSwitchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 10,
},

text: {
  textAlign: 'center',
},
buttonContainer: {
  flexDirection: 'row',
  alignItems: 'stretch',
  marginTop: 15,
},
middleButton: {
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderColor: '#ccc',
},

previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },

});
const findStreamedDataItem = (imageId, streamedData) => {
  
  for (const item of streamedData) {
    
    if (item?.image === imageId) {
      return item;
    }
  }
  return null;
};
export default Jobs;