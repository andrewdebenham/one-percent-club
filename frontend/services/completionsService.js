import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000';

/**
 * Updates the completion status of a habit.
 * @param {number} id - The ID of the habit_completion to update.
 * @returns {Promise<object>} - The response from the server.
 */
const toggleCompletionStatus = async (id) => {
    if (!id) {
        throw new Error('Invalid completion id.');
    }

    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/completions/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching / updating habit completion.');
        }

        const data = response.json();
        return data.is_complete;
    } catch (error) {
        console.error('Error in toggleCompletionStatus: ', error);
    }
}