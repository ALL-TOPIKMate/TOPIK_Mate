import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Loading = () => {
    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Loading...</Text> */}
            <ActivityIndicator size = "large" />
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,         
        justifyContent:'center',         
        alignItems:'center',         
        // backgroundColor: '#fdc453',   
    },
    title: {
        fontSize: 20, 
        fontWeight: '700',
    }
});

export default Loading;