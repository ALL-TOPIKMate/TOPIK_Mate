import React, {useState, useEffect} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';


const WriteHistoryScreen = ({route, navigation}) =>{
    const [data, setData] = useState([]);
    // 유저가 고른 유형의 도큐먼트를 가져옴 route.params.userTag
    const problemCollection = route.params.problemCollection.doc("oKtSOMagB4yv7oG25RDS").collection("problem-rsc");
    
    
    useEffect(()=>{
        // setData([
        //     {
        //         PRB_RSC: "60회 TOPIK 2",
        //         PRB_NUM: "51"  
        //     },
        //     {
        //         PRB_RSC: "60회 TOPIK 2",   
        //         PRB_NUM: "52"
        //     },
        //     {
        //         PRB_RSC: "60회 TOPIK 2",   
        //         PRB_NUM: "51"
        //     },
        //     {
        //         PRB_RSC: "60회 TOPIK 2",   
        //         PRB_NUM: "52"
        //     },
        //     {
        //         PRB_RSC: "60회 TOPIK 2",   
        //         PRB_NUM: "51"   
        //     },
        //     {
        //         PRB_RSC: "60회 TOPIK 2",   
        //         PRB_NUM: "52"   
        //     },{
        //         PRB_RSC: "60회 TOPIK 2",   
        //         PRB_NUM: "51"
        //     },
        //     {
        //         PRB_RSC: "60회 TOPIK 2",   
        //         PRB_NUM: "52"
        //     },
        //     {
        //         PRB_RSC: "60회 TOPIK 2",   
        //         PRB_NUM: "51"
        //     },
        //     {
        //         PRB_RSC: "60회 TOPIK 2",   
        //         PRB_NUM: "52"
        //     }
        // ])



        // route.params.userTag와 일치하는 쓰기 문제 불러오기
        async function dataLoading(){
            try{
                const data = await problemCollection.get(); // 요청한 데이터가 반환되면 다음 줄 실행
                setData(data.docs.map(doc => ({...doc.data(), tag: route.params.userTag})))
            }catch(error){
                console.log(error.message);
            }    
        }

        dataLoading();
    }, [])

    // useEffect(()=>{
    //     console.log(data)
    // }, [data])

    return (
        <View style = {{flex: 1, padding: 20}}>
            <View style = {{flex: 1}}>
                <Text style = {{fontWeight: "bold", fontSize: 20}}>
                    {route.params.userTag}
                </Text>
            </View>
            <View style = {{flex: 0.5}}>
                <Text>
                    문제 회차를 선택하세요
                </Text>
            </View>
            <View style = {{flex: 8}}>
                <ScrollView>
                    {
                        data.map((data, index)=>{
                            return (
                                <TouchableOpacity key = {index} style = {styles.buttonList} onPress = {() => navigation.push("WriteHistoryList", {userTag: route.params.userTag, userRsc: data.PRB_RSC, userPrbNum: data.PRB_NUM, problemCollection: problemCollection})} >
                                    <Text>{data.PRB_RSC} {data.PRB_NUM}번</Text>
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
        padding: 28,
        marginVertical: 2,
    }
})


export default WriteHistoryScreen;