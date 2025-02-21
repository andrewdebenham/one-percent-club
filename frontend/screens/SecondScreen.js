import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import DatePicker from '../components/DatePicker';
import { addHabit, getHabits } from '../services/habitsService';
import HabitsList from '../components/HabitsList';

function SecondScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [habits, setHabits] = useState([]);

    // useCallback ensures fetchHabits does not change unless selectedDate changes
    const fetchHabits = useCallback(async () => {
        const fetchedHabits = await getHabits(format(selectedDate, 'yyyy-MM-dd'));
        setHabits(fetchedHabits);
    }, [selectedDate]);

    useEffect(() => {
        fetchHabits();
    }, [fetchHabits]); // Only runs when selectedDate changes

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // When a new habit is added, update the habits list immediately
    const handleHabitAdded = async (newHabit) => {
        await addHabit(newHabit);
        fetchHabits(); // Fetch new habits after adding one
    };

    return (
        <View style={styles.container}>
            <DatePicker onDateChange={handleDateChange} />
            <HabitsList habits={habits} />
            {/* Pass handleHabitAdded to a button or form to add habits */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'start',
        alignItems: 'center',
    }
});

export default SecondScreen;
