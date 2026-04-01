import { createContext, useState, useContext, useEffect } from 'react';
// import storage to store key with user's set color mode
import AsyncStorage from '@react-native-async-storage/async-storage';
// color related import
import { Colors } from '../constants/colors';

// creating theme context
const ThemeContext = createContext();

// theme related key
const THEME_KEY = 'APP_THEME';

// the provider
export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const [loaded, setLoaded] = useState(false); // wait until theme is loaded

    // Load theme from AsyncStorage on first render
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_KEY);
                if (savedTheme !== null) {
                    setIsDark(savedTheme === 'dark');
                }
            }
            catch (err) {
                console.error('Failed to load theme', err);
            }
            finally {
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
            await AsyncStorage.setItem(
                THEME_KEY,
                newValue ? 'dark' : 'light'
            );
        } catch (err) {
            console.error('Failed to save theme', err);
        }
    };

    const theme = isDark ? Colors.dark : Colors.light;

    // Optionally show nothing until theme is loaded
    if (!loaded) return null;

    return (
        <ThemeContext.Provider
            value={{
                theme,
                isDark,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook
export const useTheme = () => useContext(ThemeContext);