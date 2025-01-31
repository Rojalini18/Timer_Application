import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../context/ThemeContext';

const History = () => {
  const [timers, setTimers] = useState([]);
  const {darkMode, toggleTheme} = useContext(ThemeContext);

  useEffect(() => {
    const fetchTimers = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem('storedTimers');
        if (storedTimers) {
          setTimers(JSON.parse(storedTimers));
        }
      } catch (error) {
        console.error('Error loading timers from AsyncStorage:', error);
      }
    };
    fetchTimers();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        darkMode ? styles.darkContainer : styles.lightContainer,
      ]}>
      <Text
        style={[
          styles.header,
          darkMode ? styles.darkHeaderText : styles.lightHeaderText,
        ]}>
        History of Timers
      </Text>
      <ScrollView contentContainerStyle={styles.tableContainer}>
        <View
          style={[
            styles.tableHeader,
            darkMode ? styles.darkTableHeader : styles.lightTableHeader,
          ]}>
          <Text
            style={[
              styles.tableHeaderText,
              styles.tableCell,
              styles.tableCellLeft,
            ]}>
            Category
          </Text>
          <Text style={[styles.tableHeaderText, styles.tableCell]}>Name</Text>
          <Text style={[styles.tableHeaderText, styles.tableCell]}>Time</Text>
          <Text
            style={[
              styles.tableHeaderText,
              styles.tableCell,
              styles.tableCellRight,
            ]}>
            Status
          </Text>
        </View>
        {timers.map((entry, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              darkMode ? styles.darkTableRow : styles.lightTableRow,
            ]}>
            <Text
              style={[
                styles.tableText,
                styles.tableCell,
                styles.tableCellLeft,
              ]}>
              {entry.category}
            </Text>
            <Text style={[styles.tableText, styles.tableCell]}>
              {entry.name}
            </Text>
            <Text style={[styles.tableText, styles.tableCell]}>
              {entry.time} sec
            </Text>
            <Text
              style={[
                styles.tableText,
                styles.tableCell,
                styles.tableCellRight,
              ]}>
              {entry.status}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  lightContainer: {
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  darkHeaderText: {
    color: '#fff',
  },
  lightHeaderText: {
    color: '#333',
  },
  tableContainer: {
    paddingBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
  },
  darkTableHeader: {
    backgroundColor: '#444',
  },
  lightTableHeader: {
    backgroundColor: '#333',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  darkTableRow: {
    backgroundColor: '#444',
  },
  lightTableRow: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableText: {
    fontSize: 14,
    textAlign: 'center',
  },
  darkTableText: {
    color: '#eee',
  },
  lightTableText: {
    color: '#666',
  },
  tableCell: {
    flex: 1,
  },
  tableCellLeft: {
    paddingLeft: 10,
  },
  tableCellRight: {
    paddingRight: 10,
  },
});

export default History;
