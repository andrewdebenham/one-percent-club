import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressGrid = () => {
    const gridSize = 99; // Number of squares

    return (
        <View style={styles.gridContainer}>
            {Array.from({ length: gridSize }).map((_, index) => (
                <View key={index} style={styles.gridItem} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '95%',
        gap: 4,
    },
    gridItem: {
        width: 25,
        aspectRatio: 1,
        height: 25,
        backgroundColor: '#ddd',
        borderRadius: 6,
    },
});

export default ProgressGrid;