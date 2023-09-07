import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native'

const ProbMain = ({ PRB_NUM, PRB_MAIN_CONT }) =>{
    
    return (
        <View>
            <View style = {styles.titleBox}>
                <Text style = {styles.number}>Q{PRB_NUM}</Text>
                <Text style = {styles.title}> {PRB_MAIN_CONT} </Text>
            </View>

            <Text />
        </View>
    );          
}


const styles = StyleSheet.create({
    titleBox: {
        flexDirection: "row",
        alignItems: "center",

        marginVertical: 32,
    },
    number:{
        fontSize: 24,
        fontWeight: 'bold',
        color: "#000000",

        // transform: [{rotate: "45deg"}],
    },
    title: {
        fontSize: 15,
        paddingHorizontal: 10,
        color: "#000000",

        flexShrink: 1
    },
})


export default ProbMain