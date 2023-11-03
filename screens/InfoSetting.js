import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
//import firestore from '@react-native-firebase/firestore';



const InfoSetting = ({ navigation }) => {

    const [isButton1Visible, setButton1Visible] = useState(false);
    const [isButton2Visible, setButton2Visible] = useState(false);
    const [isButton3Visible, setButton3Visible] = useState(false);
    const [isButton4Visible, setButton4Visible] = useState(false);

    const handleButton1Press = () => {
        setButton1Visible(!isButton1Visible);
        navigation.navigate("Myaccount");
    };
    const handleButton2Press = () => {
        setButton2Visible(!isButton2Visible);
        navigation.navigate("Notice");
    };
    const handleButton3Press = () => {
        setButton3Visible(!isButton3Visible);
        navigation.navigate("Inquiry");
    };
    const handleButton4Press = () => {
        setButton4Visible(!isButton4Visible);
        navigation.navigate("InfoApp");
    };

    return (
        <View style={styles.container}>
            <FlatList data={[
                { key: 'Account', onPress: handleButton1Press },
                { key: 'Notice', onPress: handleButton2Press },
                { key: 'Inquiry', onPress: handleButton3Press },
                { key: 'App info', onPress: handleButton4Press },
            ]}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.button} onPress={item.onPress}>
                        <Text style={styles.buttonText}>{item.key}</Text>
                    </TouchableOpacity>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        marginHorizontal: 10
    },
    button: {
        padding: 10,
        marginBottom: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',

        borderBottomWidth: 1,
        borderBottomColor: "#D9D9D9"
    },
    buttonText: {
        fontSize: 18,
    },
});
export default InfoSetting;