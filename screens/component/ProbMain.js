import React from 'react';

import {View, Text, StyleSheet, Button} from 'react-native'



const ProbMain = (props) =>{
    return (
        <Text style = {styles.title}>Q{props.PRB_NUM} {props.PRB_MAIN_CONT}</Text>
    );
}


const styles = StyleSheet.create({
    title:{
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',

    },
})


export default ProbMain