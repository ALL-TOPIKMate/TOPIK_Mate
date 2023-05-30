import React, {useState, useEffect} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';


const WriteHistoryScreen = ({route, navigation}) =>{
    const [data, setData] = useState([]);


    const querySnapshot = route.params.querySnapshot
    const wrongCollection = querySnapshot.doc(route.params.userInfo.userId).collection(`wrong_lv${route.params.userInfo.myLevel}`).doc("WR_TAG").collection("PRB_TAG").doc(route.params.userTag.tagName).collection("PRB_RSC_LIST")
    
    
    useEffect(()=>{
        async function dataLoading(){
            try{
                let problemList = []
                const data = await wrongCollection.get(); // 요청한 데이터가 반환되면 다음 줄 실행
                
                data.docs.forEach((doc) => {if(doc._data.PRB_ID) problemList.push(doc._data)})
            
                setData(problemList)
            }catch(error){
                console.log(error.message);
            }    
        }

        dataLoading();
    }, [])

    useEffect(()=>{
        console.log(data)
    }, [data])

    return (
        <View style = {{flex: 1, padding: 20}}>
            <View style = {{flex: 1}}>
                <Text style = {{fontWeight: "bold", fontSize: 20}}>
                    {route.params.userTag.tag}
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
                                <TouchableOpacity key = {index} style = {styles.buttonList} onPress = {() => navigation.push("WriteHistoryList", {userTag: route.params.userTag, userRsc: {PRB_NUM: data.PRB_NUM, PRB_RSC: data.PRB_RSC},PRB_ID: data.PRB_ID, querySnapshot: wrongCollection})} >
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