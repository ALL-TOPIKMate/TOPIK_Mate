import React, {useState, useEffect} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';


const WriteHistoryScreen = ({route, navigation}) =>{
    const [data, setData] = useState([]);


    const querySnapshot = route.params.querySnapshot
    const wrongCollection = querySnapshot.doc(route.params.userInfo.userId).collection(`wrong_lv${route.params.userInfo.myLevel}`).doc("WR_TAG").collection("PRB_TAG").doc(route.params.userTag.tag).collection("PRB_RSC_LIST")
    
    
    useEffect(()=>{
        async function dataLoading(){
            try{
                let problemList = []
                const data = await wrongCollection.get(); // 요청한 데이터가 반환되면 다음 줄 실행
                
                data.docs.forEach((doc) => {if(doc._data.PRB_RSC) problemList.push({PRB_RSC: doc._data.PRB_RSC, PRB_ID: doc.id})})
            
                setData(problemList)
            }catch(error){
                console.log(error.message);
            }    
        }

        dataLoading();
    }, [])


    return (
        <View style = {{flex: 1, padding: 20}}>
            <View style = {{flex: 1}}>
                <Text style = {{fontWeight: "bold", fontSize: 20}}>
                    {route.params.userTag.tagName}
                </Text>
            </View>
            <View style = {{flex: 0.5, paddingVertical: 10}}>
                <Text>
                    문제 회차를 선택하세요
                </Text>
            </View>
            <View style = {{flex: 8}}>
                <ScrollView>
                    {
                        data.map((data, index)=>{
                            return (
                                <TouchableOpacity key = {index} style = {styles.buttonList} onPress = {() => navigation.push("WriteHistoryList", {userTag: route.params.userTag, PRB_RSC: data.PRB_RSC, PRB_ID: data.PRB_ID, querySnapshot: wrongCollection})} >
                                    <Text>{data.PRB_RSC}</Text>
                                    <Text>{data.PRB_ID}번</Text> 
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
        padding: 32,
        marginVertical: 2,
    }
})


export default WriteHistoryScreen;