import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native'

import auth from "@react-native-firebase/auth";
import UserContext from "../lib/UserContext"



const SplashScreen = ({ navigation }) => {

    // 유저 존재 확인
    const user = auth().currentUser
    const USER = useContext(UserContext)


    const readUser = async() => {
        await USER.getUserInfo()
    }
    

    // 유저 객체 생성
    useEffect(()=>{
        if(user){
            // initialize uid, email
            USER.initUser(user)
            readUser().then(()=>{
                console.log(USER)
                
                navigation.replace("HomeStack")
            })
        }else{
            setTimeout(()=>{
                navigation.replace("AuthStack")
            }, 1000)
        }
    }, [])




    return (
        <View style={styles.container}>
            <View>
                <Text style = {styles.icon}>
                    TOPIK MATE
                </Text>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        fontSize: 40,
    }
})

export default SplashScreen