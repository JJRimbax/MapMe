import { Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [position, setPosition] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    let subscriber = null;

    const getLocationUpdates = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission de localisation non accordée');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude, heading } = location.coords;
      setPosition({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setRouteCoordinates(prevCoords => [...prevCoords, { latitude, longitude }]);
      setHeading(heading);

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5, // Met à jour tous les 5 mètres
        },
        (location) => {
          const { latitude, longitude, heading } = location.coords;
          setPosition({
            ...position,
            latitude,
            longitude,
          });
          setRouteCoordinates(prevCoords => [...prevCoords, { latitude, longitude }]);
          setHeading(heading);
        }
      );
    };

    getLocationUpdates();

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, []);

  if (!position) {
    return null;
  }

  const sendSOSAlert = () => {
    Alert.alert("SOS", "Alerte envoyée avec votre position actuelle !");
    // Logique pour envoyer la localisation via un SMS ou une API tierce
    // Par exemple, tu peux utiliser un service d'envoi d'email ou d'API de SMS
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false}
        followsUserLocation={false}
      >
        <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
        <Marker
          coordinate={position}
          anchor={{ x: 0.5, y: 0.5 }}
          rotation={heading}
          flat={true}
        >
          <View style={styles.marker} />
        </Marker>
      </MapView>
      {/* Ajout du bouton SOS en overlay sur la carte */}
      <Button
        title="SOS"
        color="red"
        onPress={sendSOSAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    transform: [{ rotate: '45deg' }],
  },
});
