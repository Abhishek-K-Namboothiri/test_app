import React, { useState, useEffect  } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ACCEPT } from "../constants/apiConf";
import axios from "axios";
import { useSelector } from "react-redux";


const HeaderBack = ({ onBackPress, switchState, onToggleSwitch, jobId }) => {
    const navigation = useNavigation();
    
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [jobDetails, setJobDetails] = useState({});
    const user = useSelector((state) => state.auth.user);
    const accessToken = user.access_token;
    //console.log(jobId, '-------------------------------------------------------------------------')
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(
                    `${ACCEPT}/${jobId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                //console.log('++++++++++++++++++++++++++++++++++', response.data)
                setJobDetails(response.data);
                const isAcceptedValue = response.data?.is_accepted === "Yes";
                setIsSwitchOn(isAcceptedValue);
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        };
        fetchJobDetails();
    }, [accessToken, jobId]);
    //console.log('*********************8', setJobDetails)
    const sendToBackend = async (value) => {
        const isAcceptedValue = value ? "Yes": "No";
        
        //console.log('$$$$$$$$$$$$$$$$$$$', isAcceptedValue)
        const updatedJobData = {
            
            'is_accepted': isAcceptedValue,

            
        };
        //console.log('[[[[[[[[[[[[[[[]]]]]]]]]]]]]', updatedJobData)
        // try {
            const response = await axios.put(
                `${ACCEPT}/${jobId}`,
                updatedJobData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                }
            );
            console.log("Response from backend:", response.data);
        // // } catch (error) {
        //     console.error("Error sending data to backend:", error);
        // }
    };
    
    const handleToggleSwitch = (value) => {
        setIsSwitchOn(value);
        sendToBackend(value);
        console.log('Payload value:', value);
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* Background Image */}
                <Image
                    style={styles.bgIcon}
                    resizeMode="cover"
                    source={require("../../assets/bg/bg.png")}
                />
                {/* Left Side (Back Button + Job Number) */}
                <View style={styles.leftHeaderContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                   </View>
                {/* Right Side (Profile Button + Toggle Switch) */}
                <View style={styles.rightHeaderContainer}>
                    
                    <View style={styles.switchContainer}>
                        <Text style={styles.toggleText}>{isSwitchOn ? "accepted" : "accept"}</Text>
                        <Switch
                            value={switchState}
                            onValueChange={handleToggleSwitch}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isSwitchOn ? "#f5dd4b" : "#f4f3f4"}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 150,
        width: "110%",
        position: "absolute",
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 50,
        paddingHorizontal: 16,
    },
    leftHeaderContainer: {
        flexDirection: 'row',
        alignItems: "center",
    },
    rightHeaderContainer: {
        flexDirection: 'row',
        alignItems: "center",
    },
    backButton: {
        paddingRight: 16,
    },
    profileButton: {
        padding: 8,
        borderRadius: 15,
        backgroundColor: "#ffffff",
        marginRight: 8,
    },
    bgIcon: {
        position: "absolute",
        top: 0,
        left: 0,
        height: 150,
        width: "100%",
    },
    jobNumberText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        right:16,
        paddingRight: 16,  // Add this line
    },
    toggleText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 10,
    },
});

export default HeaderBack;