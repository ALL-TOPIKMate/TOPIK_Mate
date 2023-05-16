import React, {useState, useEffect} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';


const WriteHistoryScreen = ({route, navigation}) =>{
    // 유저가 고른 유형에 해당하는 쓰기 목록을 가져옴
    const [data, setData] = useState([]);
    const problemCollection = firestore().collection('problems');
    
    
    useEffect(()=>{
        setData([
            {
                date: "20230510",
                score: "15/20",
                PRB_WRITED_ID: "aaaaaa", // 고유값, 유저가 쓴 답안을 저장하는 도큐먼트 네임
                PRB_RSC: "60회 TOPIK 2",   
            },
            {
                date: "20230510",
                score: "15/20",
                PRB_WRITED_ID: "aaaaab", // 고유값, 유저가 쓴 답안을 저장하는 도큐먼트 네임
                PRB_RSC: "60회 TOPIK 2",   
            },
            {
                date: "20230510",
                score: "15/20",
                PRB_WRITED_ID: "aaaaac", // 고유값, 유저가 쓴 답안을 저장하는 도큐먼트 네임
                PRB_RSC: "60회 TOPIK 2",   
            },
            {
                date: "20230510",
                score: "15/20",
                PRB_WRITED_ID: "aaaaaa", // 고유값, 유저가 쓴 답안을 저장하는 도큐먼트 네임
                PRB_RSC: "60회 TOPIK 2",   
            },
            {
                date: "20230510",
                score: "15/20",
                PRB_WRITED_ID: "aaaaab", // 고유값, 유저가 쓴 답안을 저장하는 도큐먼트 네임
                PRB_RSC: "60회 TOPIK 2",   
            },
            {
                date: "20230510",
                score: "15/20",
                PRB_WRITED_ID: "aaaaac", // 고유값, 유저가 쓴 답안을 저장하는 도큐먼트 네임
                PRB_RSC: "60회 TOPIK 2",   
            }
        ])



        // route.params.tag와 일치하는 쓰기 문제 불러오기
        async function dataLoading(){
            try{
                const data = await problemCollection.where("PRB_SECT", "==", "쓰기").get().limit(10); // 요청한 데이터가 반환되면 다음 줄 실행
                setData(data.docs.map(doc => ({...doc.data(), tag: route.params.userTag})))
            }catch(error){
                console.log(error.message);
            }    
        }

        // dataLoading();
    }, [])

    // useEffect(()=>{
    //     console.log(data)
    // }, [data])

    return (
        <View style = {{flex: 1, padding: 20}}>
            <View style = {{flex: 1}}>
                <Text style = {{fontWeight: "bold", fontSize: 20}}>
                    쓰기 히스토리
                </Text>
            </View>
            <View style = {{flex: 8}}>
                <ScrollView>
                    {
                        data.map((data, index)=>{
                            return (
                                <TouchableOpacity key = {index} style = {styles.buttonList} onPress = {() => navigation.push("WrongStudy", {key: "write", userTag: data.PRB_RSC, userSelect: data.PRB_WRITED_ID})}>
                                    <Text>{data.date}</Text>
                                    <Text>{data.score}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonList: {
        backgroundColor: "#D9D9D9",
        padding: 16,
        marginVertical: 2,
    }
})


export default WriteHistoryScreen;