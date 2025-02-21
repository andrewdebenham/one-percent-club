import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000';

/**
 * Add a new habit for a user.
 * @param {string} habit_name - The name of the habit.
 * @param {string} start_date - The date the habit commenced tracking
 * @param {string} cateogry - The habit category
 * @returns {Promise<Object>} - A promise that resolves to the newly created habit's ID.
 */
export const addHabit = async (habit_name, start_date, category) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/habits/`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                habit_name,
                start_date,
                category
            }),
        });

        if (!response.ok) {
            throw new Error(`Error adding habit: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in addHabit:', error);
        throw error;
    }
};

/**
 * Fetch the list of habits for a specific user.
 * @returns {Promise<Array>} - A promise that resolves to the list of the user's habits.
 */
export const getHabits = async (date) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/habits?date=${date}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching habits: ${response.status}`);
        }

        const data = await response.json();
        return data.habits; // returns the habits object from API response
    } catch (error) {
        console.error('Error in getHabits:', error);
        throw error;
    }
};