import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView} from 'react-native'

import UserContext from '../lib/UserContext';


const LevelScreen = ({navigation, route}) => {

    const USER = useContext(UserContext)

    const [level, setLevel] = useState(undefined)

    

    // click next button
    function submitLevelHandler(){
        
        // setting user's level
        USER.level = level

        
        // push path (stack)
        navigation.navigate("LevelTest")
    }

    return (
        <View style = {styles.container}>
            <View style = {styles.titleContainer}>
                <Text style = {[styles.bigTitle, {marginBottom: 20,}]}>
                    please choose your topik level
                </Text>
                <Text style = {styles.smallTitle}>
                    (cannot be modefined)
                </Text>
            </View>

            <View style = {styles.scrollContainer}>
                <ScrollView horizontal = {true} contentContainerStyle = {{alignItems: "center", }}>
                    <TouchableOpacity style = {[styles.topikBox, {backgroundColor: level == 1 ? "#E7FFE4" : "#F6F1F1"}]} onPress = {() => setLevel(1)}>
                        <View style = {styles.topikTopBox}>
                            <Text style = {styles.bigTitle}>
                                TOPIK Ⅰ
                            </Text>
                        </View>
                        <View style = {styles.topikBottomBox}>
                            <Text>
                                for beginner
                            </Text>
                            <Text>
                                Listening / Reading
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.topikBox, {backgroundColor: level == 2 ? "#E7FFE4" : "#F6F1F1"}]} onPress = {() => setLevel(2)}>
                        <View style = {styles.topikTopBox}>
                            <Text style = {styles.bigTitle}>
                                TOPIK ⅠⅠ
                            </Text>
                        </View>
                        <View style = {styles.topikBottomBox}>
                            <Text>
                                for intermediate-advanced
                            </Text>
                            <Text>
                                Listening / Reading / Writing
                            </Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style = {styles.buttonContainer}>
                <TouchableOpacity style = {[styles.button, {backgroundColor: level? "#A4BAA1": "#FFFFFF"}]} disabled = {level==undefined} onPress = {() => submitLevelHandler()}>
                    <Text style = {{color: "#000000", fontSize: 16}}>
                        next
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BBD6B8', // 원하는 배경색으로 변경
    },

    titleContainer: {
        flex: 2.5,

        justifyContent: "center",
        marginLeft: 20,
    },

    scrollContainer: {
        flex: 5,

        borderWidth: 1,
        borderColor: "#94AF9F",

        // flexDirection: "row",
        // alignItems: "center",
    },

    buttonContainer: {
        flex: 2,

        justifyContent: "center",
    },

    topikBox: {
        width: 300,
        height: 250,

        borderRadius: 10,

        backgroundColor: "#F6F1F1",
        marginHorizontal: 20
    },

    topikTopBox: {
        height: 125,
        justifyContent: "center",

        paddingLeft: 14,

        borderBottomWidth: 1,
        borderBottomColor: "#BBD6B8"
    },
    topikBottomBox: {
        height: 125,

        paddingTop: 60,
        paddingLeft: 14
    },


    bigTitle: {
        color: "#000000",
        fontSize: 22,
    },
    smallTitle: {
        color: "#DE0000",
        fontWeight: "bold"
    },

    button: {
        backgroundColor: "#F6F1F1",
        
        borderWidth: 1,
        
        alignItems: "center",
        padding: 16,
        marginHorizontal: 20
    }
})
export default LevelScreen