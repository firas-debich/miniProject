import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen() {
  const [heartbeat, setHeartbeat] = useState(72);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeat((prev) => Math.max(60, Math.min(100, prev + (Math.random() * 4 - 2)))); 
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const location = {
    latitude: 37.7749,
    longitude: -122.4194,
  };

  return (
    <View style={styles.container}>

      <View style={styles.heartbeatContainer}>
        <Text style={styles.heartbeatText}>Heartbeat: {heartbeat.toFixed(0)} bpm</Text>
      </View>


      <MapView
        style={styles.map}
        initialRegion={{
          ...location,
          latitudeDelta: 0.0922, 
          longitudeDelta: 0.0421, 
        }}
      >
        <Marker coordinate={location} title="My Location" description="This is my location" />
      </MapView>
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
});
