import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
    const [loadingText, setLoadingText] = useState('Please wait');

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText((prevText) => {
                if (prevText === 'Please wait...') {
                    return 'Please wait';
                } else {
                    return prevText + '.';
                }
            });
        }, 1000);

        return () => clearInterval(interval); // Limpar o intervalo quando o componente for desmontado
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Loading</Text>
            <View style={styles.content}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.label}>{loadingText}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent', // No background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    content: {
        alignItems: 'center',
    },
    label: {
        marginTop: 20,
        fontSize: 16,
    },
});

export default LoadingScreen;
