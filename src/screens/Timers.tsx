import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Keyboard,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../context/ThemeContext';

const Timers = () => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [entries, setEntries] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [completedTaskName, setCompletedTaskName] = useState('');
  const {darkMode, toggleTheme} = useContext(ThemeContext);

  useEffect(() => {
    const loadTimers = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem('storedTimers');
        if (storedTimers) {
          setEntries(JSON.parse(storedTimers));
        }
      } catch (error) {
        console.error('Error loading timers from AsyncStorage:', error);
      }
    };
    loadTimers();
  }, []);

  useEffect(() => {
    let intervals = [];
    entries.forEach((entry, index) => {
      if (entry.isSubmitted && entry.timer > 0 && !entry.isPaused) {
        const interval = setInterval(() => {
          setEntries(prevEntries => {
            const updatedEntries = [...prevEntries];
            updatedEntries[index].timer -= 1;
            if (updatedEntries[index].timer === 0) {
              clearInterval(interval);
              updatedEntries[index].status = 'Completed';
              updatedEntries[index].isPaused = true;
              setCompletedTaskName(updatedEntries[index].name);
              setIsModalVisible(true);
            }
            saveTimersToAsyncStorage(updatedEntries);
            return updatedEntries;
          });
        }, 1000);
        intervals.push(interval);
      }
    });
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [entries]);

  const saveTimersToAsyncStorage = async updatedEntries => {
    try {
      await AsyncStorage.setItem(
        'storedTimers',
        JSON.stringify(updatedEntries),
      );
    } catch (error) {
      console.error('Error saving timers to AsyncStorage:', error);
    }
  };

  const handleAddTimer = () => {
    if (!category || !time || !name) {
      Alert.alert('Error', 'Fill up the required fields');
      return;
    }

    const timeInSeconds = parseInt(time, 10);
    if (isNaN(timeInSeconds) || timeInSeconds <= 0 || time.includes('.')) {
      Alert.alert(
        'Error',
        'Time must be a valid positive integer (in seconds)',
      );
      return;
    }

    const timerNames = name.split(',').map(item => item.trim());

    timerNames.forEach(itemName => {
      const newEntry = {
        category,
        time: timeInSeconds,
        name: itemName,
        timer: timeInSeconds,
        isSubmitted: true,
        isPaused: false,
        status: 'Running',
      };

      setEntries(prevEntries => {
        const updatedEntries = [...prevEntries, newEntry];
        saveTimersToAsyncStorage(updatedEntries);
        return updatedEntries;
      });
    });

    setCategory('');
    setTime('');
    setName('');
    Keyboard.dismiss();
  };

  const handleTimerStart = globalIndex => {
    setEntries(prevEntries => {
      const updatedEntries = [...prevEntries];
      if (updatedEntries[globalIndex].isPaused) {
        updatedEntries[globalIndex].status = 'Running';
        updatedEntries[globalIndex].isPaused = false;
      }
      saveTimersToAsyncStorage(updatedEntries);
      return updatedEntries;
    });
  };

  const handleTimerPause = globalIndex => {
    setEntries(prevEntries => {
      const updatedEntries = [...prevEntries];
      updatedEntries[globalIndex].status = 'Paused';
      updatedEntries[globalIndex].isPaused = true;
      saveTimersToAsyncStorage(updatedEntries);
      return updatedEntries;
    });
  };

  const handleTimerReset = globalIndex => {
    setEntries(prevEntries => {
      const updatedEntries = [...prevEntries];
      updatedEntries[globalIndex].timer = updatedEntries[globalIndex].time;
      updatedEntries[globalIndex].status = 'Reset';
      updatedEntries[globalIndex].isPaused = true;
      saveTimersToAsyncStorage(updatedEntries);
      return updatedEntries;
    });
  };

  const handleTimerBulkStart = categoryName => {
    setEntries(prevEntries => {
      const updatedEntries = prevEntries.map(entry => {
        if (entry.category === categoryName && entry.isPaused) {
          entry.status = 'Running';
          entry.isPaused = false;
        }
        return entry;
      });
      saveTimersToAsyncStorage(updatedEntries);
      return updatedEntries;
    });
  };

  const handleTimerBulkPause = categoryName => {
    setEntries(prevEntries => {
      const updatedEntries = prevEntries.map(entry => {
        if (entry.category === categoryName && entry.status === 'Running') {
          entry.status = 'Paused';
          entry.isPaused = true;
        }
        return entry;
      });
      saveTimersToAsyncStorage(updatedEntries);
      return updatedEntries;
    });
  };

  const handleTimerBulkReset = categoryName => {
    setEntries(prevEntries => {
      const updatedEntries = prevEntries.map(entry => {
        if (entry.category === categoryName) {
          entry.timer = entry.time;
          entry.status = 'Reset';
          entry.isPaused = true;
        }
        return entry;
      });
      saveTimersToAsyncStorage(updatedEntries);
      return updatedEntries;
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        darkMode ? styles.darkContainer : styles.lightContainer,
      ]}>
      <View style={styles.activityContainer}>
        <Text
          style={darkMode ? styles.darkActivityText : styles.lightActivityText}>
          Add Your Activities
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            darkMode ? styles.darkInput : styles.lightInput,
          ]}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={darkMode ? '#fff' : '#333'}
        />
        <TextInput
          style={[
            styles.input,
            darkMode ? styles.darkInput : styles.lightInput,
          ]}
          placeholder="Duration(in seconds)"
          value={time}
          onChangeText={setTime}
          keyboardType="numeric"
          placeholderTextColor={darkMode ? '#fff' : '#333'}
        />
        <TextInput
          style={[
            styles.input,
            darkMode ? styles.darkInput : styles.lightInput,
          ]}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
          placeholderTextColor={darkMode ? '#fff' : '#333'}
        />
      </View>
      <TouchableOpacity style={[styles.startButton]} onPress={handleAddTimer}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>

      <View style={styles.yourActivityTextContainer}>
        <Text
          style={[
            styles.accText,
            darkMode ? styles.darkAccText : styles.lightAccText,
          ]}>
          Your Activities
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.keys(
          entries.reduce((acc, entry) => {
            if (!acc[entry.category]) {
              acc[entry.category] = [];
            }
            acc[entry.category].push(entry);
            return acc;
          }, {}),
        ).map(categoryName => {
          const timers = entries.reduce((acc, entry) => {
            if (!acc[entry.category]) {
              acc[entry.category] = [];
            }
            acc[entry.category].push(entry);
            return acc;
          }, {})[categoryName];

          const isExpanded = expandedCategories.includes(categoryName);
          let globalIndex = 0;

          return (
            <View key={categoryName}>
              <TouchableOpacity
                onPress={() =>
                  setExpandedCategories(prev =>
                    prev.includes(categoryName)
                      ? prev.filter(item => item !== categoryName)
                      : [...prev, categoryName],
                  )
                }
                style={styles.categoryHeaderContainer}>
                <Text style={styles.categoryHeaderText}>{categoryName}</Text>
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.timerContainer}>
                  <View style={styles.bulkBtnContainer}>
                    <Button
                      title="Bulk Start"
                      onPress={() => handleTimerBulkStart(categoryName)}
                    />
                    <Button
                      title="Bulk Pause"
                      onPress={() => handleTimerBulkPause(categoryName)}
                    />
                    <Button
                      title="Bulk Reset"
                      onPress={() => handleTimerBulkReset(categoryName)}
                    />
                  </View>
                  {timers.map((entry, localIndex) => {
                    const currIndex = globalIndex;
                    globalIndex++;
                    return (
                      <View key={localIndex} style={styles.card}>
                        <Text style={styles.cardText}>Name: {entry.name}</Text>
                        <Text style={styles.cardText}>
                          Time Left: {entry.timer} seconds
                        </Text>
                        <Text style={styles.cardText}>
                          Status: {entry.status}
                        </Text>
                        <View style={styles.progressBarContainer}>
                          <View
                            style={{
                              ...styles.progressBar,
                              width: `${(entry.timer / entry.time) * 100}%`,
                              backgroundColor:
                                entry.timer > 5 ? 'green' : 'red',
                            }}
                          />
                        </View>
                        <View style={styles.singleBtnContainer}>
                          <Button
                            title={'Start'}
                            onPress={() => handleTimerStart(currIndex)}
                            disabled={entry.status === 'Completed'}
                          />
                          <Button
                            title="Pause"
                            onPress={() => handleTimerPause(currIndex)}
                            disabled={
                              entry.isPaused || entry.status === 'Completed'
                            }
                          />
                          <Button
                            title="Reset"
                            onPress={() => handleTimerReset(currIndex)}
                            disabled={entry.status === 'Running'}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Congratulations🥳🎉</Text>
            <Text style={styles.modalText}>
              Your task "{completedTaskName}" is completed.
            </Text>
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
  },
  activityContainer: {
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  lightActivityText: {
    color: '#121212',
    fontSize: 20,
  },
  darkActivityText: {
    color: '#ffffff',
    fontSize: 20,
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  lightInput: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#333',
  },
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#333',
    color: '#eee',
  },
  startButton: {
    backgroundColor: '#007bff',
    padding: 15,
    width: '90%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
    alignSelf: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  yourActivityTextContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  accText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lightAccText: {
    color: '#333',
  },
  darkAccText: {
    color: '#fff',
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  categoryHeaderContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#007bff',
  },
  categoryHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerContainer: {
    padding: 5,
  },
  bulkBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  card: {
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e9ecef',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  singleBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Timers;
