import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, useColorScheme } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();

  const [heartbeatHistory] = useState([
    { id: '1', value: 72, time: '10:00 AM' },
    { id: '2', value: 75, time: '10:05 AM' },
    { id: '3', value: 68, time: '10:10 AM' },
    { id: '4', value: 80, time: '10:15 AM' },
  ]);

  const [locationHistory] = useState([
    { id: '1', latitude: 37.7749, longitude: -122.4194, time: '10:00 AM' },
    { id: '2', latitude: 37.7755, longitude: -122.4199, time: '10:05 AM' },
    { id: '3', latitude: 37.7760, longitude: -122.4205, time: '10:10 AM' },
    { id: '4', latitude: 37.7765, longitude: -122.4210, time: '10:15 AM' },
  ]);

  const sections = [
    {
      id: 'heartbeat',
      title: 'Heartbeat History',
      data: heartbeatHistory,
      renderItem: ({ item }) => (
        <View style={styles.historyItem}>
          <Text
            style={[
              styles.historyText,
              { color: colorScheme === 'dark' ? '#FFF' : '#000' },
            ]}
          >
            Time: {item.time}, Heartbeat: {item.value} bpm
          </Text>
        </View>
      ),
    },
    {
      id: 'location',
      title: 'Location History',
      data: locationHistory,
      renderItem: ({ item }) => (
        <View style={styles.historyItem}>
          <Text
            style={[
              styles.historyText,
              { color: colorScheme === 'dark' ? '#FFF' : '#000' },
            ]}
          >
            Time: {item.time}, Latitude: {item.latitude.toFixed(4)}, Longitude: {item.longitude.toFixed(4)}
          </Text>
        </View>
      ),
    },
  ];

  return (
    <FlatList
      data={sections}
      keyExtractor={(section) => section.id}
      renderItem={({ item: section }) => (
        <Collapsible title={section.title}>
          <FlatList
            data={section.data}
            keyExtractor={(item) => item.id}
            renderItem={section.renderItem}
            nestedScrollEnabled
          />
        </Collapsible>
      )}
      ListHeaderComponent={() => (
        <ThemedView style={styles.titleContainer}>
          <IconSymbol
            size={310}
            color={colorScheme === 'dark' ? '#FFF' : '#000'} 
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
          <ThemedText
            type="title"
            style={{ color: colorScheme === 'dark' ? '#FFF' : '#000' }}
          >
            easy as that 
          </ThemedText>
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  headerImage: {
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    padding: 16,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 16,
  },
});
