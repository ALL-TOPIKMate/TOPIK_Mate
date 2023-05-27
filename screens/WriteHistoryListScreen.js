import React, {useState, useEffect} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';


const WriteHistoryListScreen = ({route, navigation}) => {
    const [data, setData] = useState([]);

    // 최대 10문제까지만 저장 
    // 유저가 고른 회차의 문제 도큐먼트를 불러옴 route.params.userRsc+route.params.userPrbNum
    const querySnapshot = route.params.querySnapshot
    const wrongCollection = querySnapshot.doc(route.params.PRB_ID).collection("PRB_LIST")
   
   
    useEffect(()=>{
        async function dataLoading(){
            try{
                let problemList = []
                const data = await wrongCollection.get(); // 요청한 데이터가 반환되면 다음 줄 실행
                
                data.docs.forEach((doc) => {if(doc._data.date) problemList.push(doc._data)})
            
                setData(problemList)
            }catch(error){
                console.log(error.message);
            }    
        }

        dataLoading();
    }, []);

    return (
        <View style = {{flex: 1, padding: 20}}>
            <View style = {{flex: 1}}>
                <Text style = {{fontWeight: "bold", fontSize: 20}}>
                    {route.params.userTag.tag}
                </Text>
            </View>
            <View style = {{flex: 0.5}}>
                <Text>
                    선택한 문제는 {route.params.userRsc.PRB_RSC} {route.params.userRsc.PRB_NUM}번 입니다
                </Text>
            </View> 

            <View style = {{flex: 8}}>
                <ScrollView>
                    {
                        data.map((data, index)=>{
                            return (
                                <TouchableOpacity key = {index} style = {styles.tagList} onPress = {()=>{navigation.push("WrongStudy", {key: "write", order: index, querySnapshot: wrongCollection})}}>
                                    <Text style = {{flex: 5}}>
                                        {data.date}
                                    </Text>
                                    <View style = {{flex: 1, flexDirection: "column"}}>
                                        <Text style = {{flex: 1}}/>
                                        <Text style = {{fontSize: 10}}>
                                        score {data.score}/{data.PRB_POINT}
                                    </Text>
                                    </View>

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
    tagList:{
        flex: 1,
        marginVertical: 2,
        padding: 16,

        flexDirection: "row",
        backgroundColor: "#D9D9D9"
    },
})


export default WriteHistoryListScreen;