import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { format, startOfMonth, endOfMonth, addDays, subMonths, addMonths, isSameDay } from 'date-fns';

const DatePicker = ({ onDateChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const flatListRef = useRef(null);
    const itemWidth = useRef(0); // Store the measured width

    // Generate all dates for the current month
    const generateDates = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const dates = [];
        for (let date = start; date <= end; date = addDays(date, 1)) {
            dates.push(date);
        }
        return dates;
    };

    const dates = generateDates();

    const goToPreviousMonth = () => {
        setCurrentDate((prev) => subMonths(prev, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate((prev) => addMonths(prev, 1));
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        if (onDateChange) {
            onDateChange(date);
        }
    };

    // Measure the width of one date item dynamically
    const measureItem = (event) => {
        if (itemWidth.current === 0) {
            itemWidth.current = event.nativeEvent.layout.width;
        }
    };

    // Scroll to the selected date when component mounts or `selectedDate` changes
    useEffect(() => {
        const index = dates.findIndex((date) => isSameDay(date, selectedDate));
        if (index !== -1 && flatListRef.current && itemWidth.current > 0) {
            setTimeout(() => {
                flatListRef.current.scrollToIndex({ index, animated: true });
            }, 100);
        }
        console.log('Selected Date (Local):', format(selectedDate, 'yyyy-MM-dd'))
    }, [dates, selectedDate]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goToPreviousMonth}>
                    <Text style={styles.arrow}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>{format(currentDate, 'MMMM yyyy')}</Text>
                <TouchableOpacity onPress={goToNextMonth}>
                    <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            {/* Dates List */}
            <FlatList
                ref={flatListRef}
                data={dates}
                horizontal
                keyExtractor={(item) => item.toISOString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.dateContainer,
                            isSameDay(item, selectedDate) && styles.selectedDateContainer,
                        ]}
                        onPress={() => handleDateSelect(item)}
                        onLayout={measureItem} // Capture the width dynamically
                    >
                        <Text
                            style={[
                                styles.dayText,
                                isSameDay(item, selectedDate) && styles.selectedDateText,
                            ]}
                        >
                            {format(item, 'EEE')[0]}
                        </Text>
                        <Text
                            style={[
                                styles.dateText,
                                isSameDay(item, selectedDate) && styles.selectedDateText,
                            ]}
                        >
                            {format(item, 'dd')}
                        </Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.datesList}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={31}
                getItemLayout={(data, index) => ({
                    length: itemWidth.current || 60, // Use the dynamically measured width
                    offset: (itemWidth.current || 60) * index,
                    index,
                })}
                onScrollToIndexFailed={(info) => {
                    const closestIndex = info.highestMeasuredFrameIndex || 0;
                    flatListRef.current?.scrollToIndex({ index: closestIndex, animated: true });
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#f9f9f9',
        alignSelf: 'center',
        width: '90%',
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    arrow: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    datesList: {
        alignItems: 'center',
    },
    dateContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    selectedDateContainer: {
        backgroundColor: '#d8b4fe',
    },
    dateText: {
        fontSize: 16,
        color: '#000',
    },
    dayText: {
        fontSize: 14,
        color: '#888',
    },
    selectedDateText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default DatePicker;
