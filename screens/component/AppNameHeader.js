import React from 'react';

import {Text, View, StyleSheet} from 'react-native'

const AppNameHeader = ({navigator}) =>{
    return (
        <View>
            <Text style = {styles.AppName}> TOPIK MATE</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    AppName:{
        fontWeight: 'bold',
        color: 'black',
        fontSize: 20,
    }
})

export default AppNameHeader;