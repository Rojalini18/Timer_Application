import React, {useContext, useLayoutEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ThemeContext, ThemeProvider} from './src/context/ThemeContext';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Timers from './src/screens/Timers';
import History from './src/screens/History';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = ({navigation}) => {
  const {darkMode, toggleTheme} = useContext(ThemeContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Text style={[styles.headerLeft, {color: darkMode ? '#fff' : '#333'}]}>
          Welcome!
        </Text>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} style={styles.headerRight}>
          <Text style={[styles.themeText, {color: darkMode ? '#fff' : '#333'}]}>
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: [
        styles.headerStyle,
        {backgroundColor: darkMode ? '#121212' : '#fff'},
      ],
      headerShadowVisible: false,
      headerTitle: '',
    });
  }, [darkMode, navigation, toggleTheme]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Timers"
        component={Timers}
        options={{
          tabBarLabel: 'Timers',
          tabBarIcon: () => <Text>📋</Text>,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: () => <Text>📜</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    marginRight: 20,
  },
  themeText: {
    fontSize: 16,
  },
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
});
