import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const HabitsList = ({ habits }) => {

    const renderHabit = ({ item }) => (
        <View style={styles.habitContainer}>
            <Text>{item.habit_name}</Text>
        </View>
    )

    return (
        <FlatList
            data={habits}
            renderItem={renderHabit}
            keyExtractor={(item) => item.habit_id.toString()}
            contentContainerStyle={styles.habitsList}
        />
    )
}

const styles = StyleSheet.create({
    habitsList: {
        marginVertical: 20,
        backgroundColor: '#f9f9f9',
        gap: 10,
        padding: 20,
        width: '90%',
        borderRadius: 15,
    },
    habitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },

})

export default HabitsList;