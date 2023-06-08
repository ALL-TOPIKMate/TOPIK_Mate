import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button, Image} from 'react-native'




const ImgRef = ({IMG_REF}) => {
    return (
        <View>
            <Image
                style={{height: 250}}
                resizeMode = "contain"
                source={{uri: IMG_REF}}
            />
            <Text/>
        </View>
    )
}

export default ImgRef