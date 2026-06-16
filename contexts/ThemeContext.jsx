import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import i18n from '../i18next/i18n'; // Your i18n configuration file

// Creating the context
const ThemeContext = createContext();

// AsyncStorage Keys
const THEME_KEY = 'APP_THEME';
const LANG_KEY = 'APP_LANGUAGE';

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const [locale, setLocale] = useState('en'); // Defaults to English
    const [loaded, setLoaded] = useState(false); // Waits until all preferences load

    // Load preferences from AsyncStorage on first render
    useEffect(() => {
        const loadPreferences = async () => {
            try {
                // Fetch theme and language concurrently to speed up app boot
                const [savedTheme, savedLang] = await Promise.all([
                    AsyncStorage.getItem(THEME_KEY),
                    AsyncStorage.getItem(LANG_KEY),
                ]);

                if (savedTheme !== null) {
                    setIsDark(savedTheme === 'dark');
                }

                if (savedLang !== null) {
                    setLocale(savedLang);
                    await i18n.changeLanguage(savedLang); // Ensure i18n matches stored setting
                }
            } catch (err) {
                console.error('Failed to load user preferences', err);
            } finally {
                setLoaded(true);
            }
        };
        loadPreferences();
    }, []);

    // Toggle theme and save to AsyncStorage
    const toggleTheme = async () => {
        try {
            const newValue = !isDark;
            setIsDark(newValue);
            await AsyncStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light');
        } catch (err) {
            console.error('Failed to save theme', err);
        }
    };

    // Change language, update i18n runtime, and save to AsyncStorage
    const changeLanguage = async (newLang) => {
        try {
            await i18n.changeLanguage(newLang); // Update active translations instantly
            setLocale(newLang); // Sync context state
            await AsyncStorage.setItem(LANG_KEY, newLang);
        } catch (err) {
            console.error('Failed to save language preference', err);
        }
    };

    const theme = isDark ? Colors.dark : Colors.light;

    // Prevents app rendering before settings are loaded (prevents flash of wrong theme/lang)
    if (!loaded) return null;

    return (
        <ThemeContext.Provider
            value={{
                theme,
                isDark,
                toggleTheme,
                locale,
                changeLanguage,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook
export const useTheme = () => useContext(ThemeContext);