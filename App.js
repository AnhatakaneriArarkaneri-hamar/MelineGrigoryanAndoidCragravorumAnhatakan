import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Checklist = () => {
  const [items, setItems] = useState([
    { id: '1', text: 'Buy groceries', completed: false },
    { id: '2', text: 'Read a book', completed: false },
    { id: '3', text: 'Go for a walk', completed: false },
  ]);

  // Load saved checklist state
  useEffect(() => {
    const loadItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem('checklist');
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        }
      } catch (error) {
        console.error('Error loading checklist:', error);
      }
    };
    loadItems();
  }, []);

  // Save checklist state
  useEffect(() => {
    const saveItems = async () => {
      try {
        await AsyncStorage.setItem('checklist', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving checklist:', error);
      }
    };
    saveItems();
  }, [items]);

  const toggleItem = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => toggleItem(item.id)}
    >
      <View style={[styles.checkbox, item.completed && styles.checked]} />
      <Text style={[styles.itemText, item.completed && styles.completedText]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checklist</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 15,
    borderRadius: 4,
  },
  checked: {
    backgroundColor: '#4caf50',
  },
  itemText: {
    fontSize: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
});

export default Checklist;
