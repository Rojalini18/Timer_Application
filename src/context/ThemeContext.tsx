import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('appTheme');
      if (savedTheme !== null) {
        setDarkMode(savedTheme === 'dark');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    await AsyncStorage.setItem('appTheme', newTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{darkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
