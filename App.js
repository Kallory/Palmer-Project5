
import React, { Component } from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import {
    Dimensions,
    StyleSheet,
    Text, // These are not used yet, but will likely be useful later in the exercise
    TouchableOpacity,
    View,
    Alert,
    Animated,
    Easing,
} from "react-native";

const notificationHeight = 200;
const initialPosition = -50;
const finalPosition = notificationHeight;

export default class App extends Component {
    state = {
        location: null,
        poi1: { coords: { latitude: 33.307146, longitude: -111.681177 } },
        poi2: { coords: { latitude: 33.423204, longitude: -111.939612 } },
        selectedMarker: null,
        region: {
            latitude: 33.307146,
            longitude: -111.681177,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
        },
        notificationVisible: false,
        notificationPosition: new Animated.Value(initialPosition),
        locationChange: null,
    };




    handleMarkerPress = (marker) => {
        this.setState({ selectedMarker: marker });
    };

    // Initial entry for execution
    async componentDidMount() {
        try {
            // get permission to access location
            const permission = await Location.requestForegroundPermissionsAsync();
            if (permission.granted) {
                console.log("permission granted");
                this.getLocation();
            } else {
                Alert.alert("Permission Denied", "Please enable location access in your device settings.");
            }
        } catch (error) {
            console.log("Error: " + error);
            Alert.alert("Error in location.request", "" + error);
        }
    }

    showNotification(locationChange) {
        this.setState({ locationChange: locationChange });
        Animated.timing(this.state.notificationPosition, {
            toValue: finalPosition,
            duration: 1000, // animation duration in milliseconds
            easing: Easing.linear, // easing function
            delay: 500, // delay before animation starts
            useNativeDriver: true,
            notificationVisible: true,
        }).start(() => {
            Animated.timing(this.state.notificationPosition, {
                toValue: initialPosition,
                duration: 1000,
                easing: Easing.linear,
                delay: 2000, // wait for 2 seconds before animating back up
                useNativeDriver: true,
            }).start();
        });
    }

    async getLocation() {
        try {
            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low,
                timeout: 100000,
            });
            this.setState({ location: loc });
        } catch (error) {
            console.log("Error: " + error);
            // this.checkLocationSettings();
            Alert.alert(
                "Error in getLocation()",
                "" + error);
        }
    }

    async checkLocationSettings() {
        const providerStatus = await Location.getProviderStatusAsync();
        console.log(providerStatus);
        Alert.alert(
            'Location Provider Status',
            JSON.stringify(providerStatus),
            [{ text: 'OK' }]
        );
    }

    handleButtonPress = (marker) => {
        if (marker === "you") {
            this.setState({
                selectedMarker: marker,
                region: {
                    latitude: this.state.location.coords.latitude,
                    longitude: this.state.location.coords.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04,
                },
            });
            this.showNotification("You");
        } else if (marker === "POI 1") {
            this.setState({
                selectedMarker: marker,
                region: {
                    latitude: this.state.poi1.coords.latitude,
                    longitude: this.state.poi1.coords.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04,
                },
            });
            this.showNotification("POI 1");
        } else if (marker === "POI 2") {
            this.setState({
                selectedMarker: marker,
                region: {
                    latitude: this.state.poi2.coords.latitude,
                    longitude: this.state.poi2.coords.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04,
                },
            });
            this.showNotification("POI 2");
        }
    };

    render() {
        const { location, poi1, poi2, selectedMarker, locationChange } = this.state;
        return this.state.location ? (
            <View style={styles.container}>
                <Animated.View style={[styles.notification, { transform: [{ translateY: this.state.notificationPosition }], zIndex: 2 }]}>
                    <Text style={styles.notificationText}>Changed to {locationChange}</Text>
                </Animated.View>
                <MapView
                    style={styles.map}
                    region={this.state.region}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title={"User Location"}
                        description={"You are here!"}
                        image={require("./assets/you-are-here.png")}
                    />
                    {selectedMarker === "POI 1" && (
                        <Marker
                            coordinate={{
                                latitude: poi1.coords.latitude,
                                longitude: poi1.coords.longitude
                            }}
                            title={"POI 1"}
                            description={"POI 1 Description"}
                        />
                    )}
                    {selectedMarker === "POI 2" && (
                        <Marker
                            coordinate={{
                                latitude: poi2.coords.latitude,
                                longitude: poi2.coords.longitude
                            }}
                            title={"POI 2"}
                            description={"POI 2 Description"}
                        />
                    )}
                </MapView>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.handleButtonPress("you")}
                    >
                        <Text style={styles.buttonText}>You</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.handleButtonPress("POI 1")}
                    >
                        <Text style={styles.buttonText}>POI 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.handleButtonPress("POI 2")}
                    >
                        <Text style={styles.buttonText}>POI 2</Text>
                    </TouchableOpacity>
                </View>

            </View>
        ) : null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    map: {
        flex: 7,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 6,
    },
    notification: {
        backgroundColor: "#00000080",
    },
    notificationText: {
        color: "#fff",
        fontSize: 18,
    }
});
