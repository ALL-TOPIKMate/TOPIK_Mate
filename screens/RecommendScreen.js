import React, {useEffect, useState, useRef} from 'react';
import {Button, View ,Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'

import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth"

// import {subscribeAuth } from "../lib/auth";


import AppNameHeader from './component/AppNameHeader'


const RecommendScreen = ({route, navigation}) =>{


    // 유저의 uid, 토픽레벨, 추천 문제 인덱스, 추천 문제 맞춘 개수 setting 
    const [user, setUser] = useState(null)
    

    useEffect(() => {
        const loadUser = async () => {
            const user = auth().currentUser
            const userId = user.uid
            
            const USER = { userId: userId }
            

            // user의 토픽 레벨 field load
            const getUserLevel = async () => {
                const data = await firestore().collection("users").doc(userId).get()

                USER.userLevel = data._data.my_level
            }

            // user의 추천 문제 field load
            const getUserRecommend = async () => {
                const data = await firestore().collection("users").doc(userId).collection("recommend").doc("Recommend").get()


                USER.userIndex = data._data.userIndex
                USER.userCorrect = data._data.userCorrect
            }


            // await getUserLevel()
            await getUserRecommend()

            setUser(USER)
        }

        loadUser()
        
    }, []);




    return (
        <View style = {{flex: 1}}>
            <View style = {styles.container}>
                <View style = {styles.detail}>
                    <Text style = {{flex: 2, fontSize: 24, fontWeight: "bold"}}>WEAK POINT</Text>
                    <View style = {{flex: 4, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginLeft: 4}}/>
                    <TouchableOpacity onPress = { () => {navigation.navigate("Info")} } style = {{flex:1, marginLeft: 16}}>
                        <Text>Detail</Text>
                    </TouchableOpacity>
                </View>

                <Text />
                
                <View style = {styles.detail}>
                    <Text style = {{flex: 2, fontSize: 24, fontWeight: "bold"}}>STRONG POINT</Text>
                    <View style = {{flex: 4, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, marginLeft: 8}}/>
                    <TouchableOpacity onPress = { () => {navigation.navigate("Info")} } style = {{flex:1, marginLeft: 16}}>
                        <Text>Detail</Text>
                    </TouchableOpacity>
                </View>
                
                
                <View style = {[styles.recommend, {flex: 1.8,}]}>

                    <TouchableOpacity style = {styles.recommendBtn} disabled = {user==null} onPress={()=> (user.userIndex == 10) ? (Alert.alert("", "모든 문제를 풀었습니다 다음에 도전하세요.")): (navigation.navigate("RecommendStudy", {user: user, setUser: setUser})) }>
                        <Text style = {{color: "#F6F1F1", fontSize: 24, fontWeight: "bold", paddingVertical: 5}}>
                            추천 문제 풀기
                        </Text>
                        {
                            (user != null) ? (
                                <Text style = {{color: "#F6F1F1", fontSize: 20}}>                        
                                    {10 - Number(user.userIndex)} / 10
                                </Text>
                            ): (
                                <Text style = {{color: "#F6F1F1", fontSize: 20}}>                        
                                    ...
                                </Text>
                            )

                        }
                    </TouchableOpacity>
                    
                </View>

            </View>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    }, 
    detail: {
        flex: 0.5,
        flexDirection: "row",
        alignItems: "center"
    },
    recommend: {
        alignItems: "center",
        justifyContent: "center" 
    },
    recommendBtn: {
        backgroundColor: "#94AF9F",
        width: 250,
        height: 250,
        borderRadius: 125, // width / 2
        
        alignItems: "center",
        justifyContent: "center" 
    },

    modalcontainer:{
        marginBottom: 64,
    },

    modal:{
        padding: 16
    }
})

export default RecommendScreen;