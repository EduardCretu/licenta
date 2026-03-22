// ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

const ThemeContext = createContext();

const THEME_KEY = 'APP_THEME';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false); // wait until theme is loaded

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      } finally {
        setLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Toggle theme and save to AsyncStorage
  const toggleTheme = async () => {
    try {
      const newValue = !isDark;
      setIsDark(newValue);
      await AsyncStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const theme = isDark ? Colors.dark : Colors.light;

  // Optionally show nothing until theme is loaded
  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = () => useContext(ThemeContext);
