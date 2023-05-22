import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const MockWriteResult = (props) => {

    return (
        <View style={styles.container}>
            {
                props.results.map((result, index) => (
                    <View key={index} style={styles.answer}>
                        <Text style={styles.problemNum}>{result.PRB_NUM}</Text>
                        <Text style={styles.userInput}>{result.USER_INPUT}</Text>
                    </View>
                ))
            }
        </View>
    )

}

const styles = StyleSheet.create({
    
    container: {
        margin: 10,
        paddig: 20,
        flex: 20
    },

    answer: {
        marginBottom: 25,
        flexDirection: 'column'
    },

    problemNum: {
        fontSize: 15,
        marginBottom: 8
    },
    userInput: {
        borderWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#e7e7e7',
        padding: 6,
        paddingLeft: 8,
    },

});

export default MockWriteResult;