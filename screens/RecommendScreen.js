import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, View ,Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useIsFocused } from "@react-navigation/native";

import UserContext from "../lib/UserContext"
import { checkUserSession } from '../lib/auth';
import { getNow2 } from '../lib/utils';
// import {subscribeAuth } from "../lib/auth";

const getUserStudyTime = async () => {
    try{

        const user = await checkUserSession()

        const time = getNow2()

        // user.studyTime.2011-10-10

        if(user["studyTime"]){
            if(user["studyTime"][time]){

                return user["studyTime"][time]

            }
        }


        return 0
    }catch(err){
        console.log(err)
    }
}


const RecommendScreen = ({route, navigation}) =>{

    const USER = useContext(UserContext)
    
    
    // 화면 포커싱 감지하여 재렌더링
    const isFocused = useIsFocused()
    const [render, reRender] = useState(false)

    // 유저 학습시간
    const [time, setTime] = useState(0)


    useEffect(()=>{
        const unsubscribe = () =>{
            // console.log("포커싱 감지!! 홈화면")
            reRender(!render)
        }


        getUserStudyTime().then((data) => {

            console.log(`유저의 학습시간: ${data}`)
            setTime(data)

        })

        return () => unsubscribe
    }, [isFocused])


    return (
        <View style = {{flex: 1}}>
            <View style = {styles.container}>
                <View style = {styles.detail}>
                    <Text style = {styles.mainText}>Today's</Text>
                    <Text style = {styles.mainText}>Running Time</Text>
                    <Text style = {styles.mainText}>: {time}ms</Text>
                </View>
                
                
                <View style = {[styles.recommend, {flex: 1.8,}]}>

                    {
                        // 레벨테스트 문제를 다 풀지 않았을 경우 (진단 고사)
                        (USER.level == 1 && USER.levelIdx < 10) || (USER.level == 2 && USER.levelIdx < 10)?
                        <TouchableOpacity style = {styles.recommendBtn} onPress={()=> navigation.navigate("LevelStudy") }>
                            <Text style = {{color: "#F6F1F1", fontSize: 24, fontWeight: "bold", paddingVertical: 5}}>
                                진단고사 풀기
                            </Text>

                            <Text style = {{color: "#F6F1F1", fontSize: 20}}>                        
                                {10 - Number(USER.levelIdx)} / 10
                            </Text>
                        </TouchableOpacity>:

                        // 다 풀었을 경우 (추천 문제)
                        <TouchableOpacity style = {[styles.recommendBtn, {opacity: USER.recIndex == 10? 0.5: 1}]} onPress={() => navigation.navigate("RecommendStudy")} disabled = {USER.recIndex}>
                        <Text style = {{color: "#F6F1F1", fontSize: 24, fontWeight: "bold", paddingVertical: 5}}>
                            추천문제 풀기
                        </Text>

                        <Text style = {{color: "#F6F1F1", fontSize: 20}}>                        
                            {10 - Number(USER.recIndex)} / 10
                        </Text>
                        </TouchableOpacity>
                    }
                    
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
        flex: 1.2,
        marginTop: 20,
        marginLeft: 10
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

    mainText: {
        fontSize: 28,
        fontWeight: "bold"
    }
})

export default RecommendScreen;