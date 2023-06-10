import React, {useEffect, useState} from 'react';

import {Button, View ,Text, StyleSheet, TouchableOpacity, Touchable} from 'react-native'
import firestore from '@react-native-firebase/firestore';

import {subscribeAuth } from "../lib/auth";


import AppNameHeader from './component/AppNameHeader'


const RecommendScreen = ({navigation}) =>{
    // 유저 정보 setting
    const [userEmail, setUserEmail] = useState("")
    const [userInfo, setUserInfo] = useState(null)
    const [userRecommendInfo, setUserRecommendInfo] = useState({userIndex: "0"})

    const querySnapshot = firestore().collection('users');


    useEffect(() => {
        // 유저 이메일 setting
        const handleAuthStateChanged = (user) => {
          if (user) {
            setUserEmail(user.email)
        }
        }
        // 유저 찾기
        const unsubscribe = subscribeAuth(handleAuthStateChanged);
        

        // 컴포넌트 언마운트 시 구독 해제
        return () => unsubscribe();
    }, []);


    // 유저 정보 setting (my_level, u_uid)
    useEffect(()=>{
        const getMyInfo = async (email) => {
            try {
                const userInfoQuery = await querySnapshot
                    .where('email', '==', email)
                    .get();
        
                if (!userInfoQuery.empty) {
                    const userData = userInfoQuery.docs[0].data();
                    
                    setUserInfo({myLevel: userData.my_level, userId: userData.u_uid})
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
            
        };
        if(userEmail !== ""){
            // console.log(`email 변경: ${userEmail}`)
            
            getMyInfo(userEmail)  
        }
    }, [userEmail])


    // 추천 문제 풀이 갯수 load
    useEffect(()=>{
        getRecommendIndex()
    }, [userInfo])

    

    const getRecommendIndex = async () =>{
        try{
            // userIndex, userCorrect
            const data = await querySnapshot.doc(userInfo.userId).collection("recommend").doc("Recommend").get()

            console.log(data._data) 

            setUserRecommendInfo(data._data)
        }catch(e){
            console.log(e)
        }
    }



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
                    <TouchableOpacity style = {styles.recommendBtn} onPress={()=> (userRecommendInfo.userIndex == 10) ? (alert("모든 문제를 풀었습니다 다음에 도전하세요.")): (navigation.push("RecommendStudy", {userRecommendInfo: userRecommendInfo, setUserRecommendInfo: setUserRecommendInfo, querySnapshot: querySnapshot, userInfo: userInfo})) }>
                        <Text style = {{color: "#F6F1F1", fontSize: 24, fontWeight: "bold", paddingVertical: 5}}>
                            추천 문제 풀기
                        </Text>
                        <Text style = {{color: "#F6F1F1", fontSize: 20}}>
                            {10 - Number(userRecommendInfo.userIndex)} / 10
                        </Text>
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
    }
})

export default RecommendScreen;