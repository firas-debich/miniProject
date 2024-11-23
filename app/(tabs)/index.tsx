import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebaseConfig';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [heartbeat, setHeartbeat] = useState(null);
  const [deviceLocation, setDeviceLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [error, setError] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const mapRef = useRef(null);

  const OPENROUTESERVICE_APIKEY = '5b3ce3597851110001cf6248369c837777f4492fafff3dddbe8fd939'; 


  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        let userLoc = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          const userCoord = {
            latitude: userLoc.coords.latitude,
            longitude: userLoc.coords.longitude,
          };
          setUserLocation(userCoord);

          setInitialRegion({
            ...userCoord,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (err) {
        console.error('Error fetching user location:', err);
        setError('Error fetching user location');
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const heartRateRef = ref(database, '/sensorData/heartRate');
    const latitudeRef = ref(database, '/sensorData/localisation/latitude');
    const longitudeRef = ref(database, '/sensorData/localisation/longitude');

    const unsubscribeHeartRate = onValue(
      heartRateRef,
      (snapshot) => {
        const value = snapshot.val();
        console.log('Heartbeat value from Firebase:', value);
        setHeartbeat(value);
        setError(null);
      },
      (err) => {
        console.error('Error fetching heart rate:', err);
        setError('Error fetching heart rate');
      }
    );

    const unsubscribeLatitude = onValue(
      latitudeRef,
      (snapshot) => {
        const value = snapshot.val();
        console.log('Latitude value from Firebase:', value);
        if (value != null) {
          setDeviceLocation((prevDeviceLocation) => ({
            ...prevDeviceLocation,
            latitude: value,
          }));
          setError(null);
        }
      },
      (err) => {
        console.error('Error fetching latitude:', err);
        setError('Error fetching location');
      }
    );

    const unsubscribeLongitude = onValue(
      longitudeRef,
      (snapshot) => {
        const value = snapshot.val();
        console.log('Longitude value from Firebase:', value);
        if (value != null) {
          setDeviceLocation((prevDeviceLocation) => ({
            ...prevDeviceLocation,
            longitude: value,
          }));
          setError(null);
        }
      },
      (err) => {
        console.error('Error fetching longitude:', err);
        setError('Error fetching location');
      }
    );

    return () => {
      unsubscribeHeartRate();
      unsubscribeLatitude();
      unsubscribeLongitude();
    };
  }, []);


  useEffect(() => {
    if (
      userLocation &&
      deviceLocation &&
      deviceLocation.latitude != null &&
      deviceLocation.longitude != null
    ) {
      fetchRoute(userLocation, deviceLocation);
    }
  }, [userLocation, deviceLocation]);

  const fetchRoute = async (startLoc, endLoc) => {
    try {
      const response = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: OPENROUTESERVICE_APIKEY,
          },
          body: JSON.stringify({
            coordinates: [
              [startLoc.longitude, startLoc.latitude],
              [endLoc.longitude, endLoc.latitude],
            ],
          }),
        }
      );

      const data = await response.json();

      if (data && data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setRouteCoordinates(coords);
      } else {
        Alert.alert('Error', 'No route found');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      Alert.alert('Error', 'Unable to fetch route');
    }
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.heartbeatContainer}>
        <Text style={styles.heartbeatText}>
          Heartbeat: {heartbeat !== null ? `${heartbeat} bpm` : 'Loading...'}
        </Text>
      </View>

      {initialRegion && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          {userLocation && (
            <Marker coordinate={userLocation} title="Your Location" pinColor="blue" />
          )}

          {deviceLocation &&
            deviceLocation.latitude != null &&
            deviceLocation.longitude != null && (
              <Marker
                coordinate={deviceLocation}
                title="Device Location"
                description={`Heartbeat: ${
                  heartbeat !== null ? `${heartbeat} bpm` : 'N/A'
                }`}
                pinColor="red"
              />
            )}

          {routeCoordinates.length > 0 && (
            <Polyline coordinates={routeCoordinates} strokeColor="hotpink" strokeWidth={3} />
          )}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heartbeatContainer: {
    position: 'absolute',
    top: 20,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  heartbeatText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorContainer: {
    position: 'absolute',
    top: 70,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
});
