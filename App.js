
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
} from "react-native";

export default class App extends Component {
    state = {
        location: null,
        poi1: { coords: { latitude: 33.307146, longitude: -111.681177 } },
        poi2: { coords: { latitude: 33.423204, longitude: -111.939612 } },
        selectedMarker: null,
    };

    handleMarkerPress = (marker) => {
        this.setState({ selectedMarker: marker });
    };

    async componentDidMount() {
        try {
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

    async getLocation() {
        try {
            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low,
                timeout: 100000,
            });
            this.setState({ location: loc, currentLocation: loc });
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

    render() {
        return this.state.location ? (
            <MapView
                style={styles.map}
                region={{
                    latitude: this.state.location.coords.latitude,
                    longitude: this.state.location.coords.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04,
                }}
            >
                <Marker
                    coordinate={this.state.location.coords}
                    title={"User Location"}
                    description={"You are here!"}
                    image={require("./assets/you-are-here.png")}
                />
            </MapView>
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
    }
});
