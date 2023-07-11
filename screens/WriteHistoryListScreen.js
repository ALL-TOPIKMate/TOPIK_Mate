import React, {useState, useEffect} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';


const WriteHistoryListScreen = ({route, navigation}) => {
    
    // 유저 정보
    const user = route.params.user

    const [data, setData] = useState([])


    // 최대 10문제까지만 저장 
    // 유저가 고른 회차의 문제 도큐먼트를 불러옴 route.params.userRsc+route.params.userPrbNum
    const wrongCollection = firestore().collection("users")
                            .doc(user.userId)
                            .collection("wrong_lv2")
                            .doc("WR_TAG")
                            .collection("PRB_TAG")
                            .doc(route.params.userTag.tag)
                            .collection("PRB_RSC_LIST")
                            .doc(route.params.PRB_ID)
                            .collection("PRB_LIST")
   
   
    useEffect(()=>{
        async function dataLoading(){
            try{
                let problemList = []
                const data = await wrongCollection.get(); // 요청한 데이터가 반환되면 다음 줄 실행
                
                data.docs.forEach((doc) => {problemList.push({...doc._data, DATE: doc.id})})
            
                // console.log(problemList)
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
                    {route.params.userTag.tagName}
                </Text>
            </View>
            <View style = {{flex: 1, paddingVertical: 10}}>
                <Text> 선택한 문제는 </Text>
                <Text> {route.params.PRB_RSC} </Text>
                <Text> {route.params.PRB_ID}번 입니다 </Text>
            </View> 

            <View style = {{flex: 8}}>
                <ScrollView>
                    {
                        data.map((data, index)=>{
                            return (
                                <TouchableOpacity key = {index} style = {styles.tagList} onPress = {()=>{navigation.push("WrongStudy", {key: "write", order: index, userTag: route.params.userTag, PRB_ID: route.params.PRB_ID, user: user})}}>
                                    <Text style = {{flex: 5}}>
                                        {data.DATE}
                                    </Text>
                                    <View style = {{flex: 1.5, flexDirection: "column"}}>
                                        <Text/>
                                        <Text style = {{fontSize: 10}}>
                                        score {data.SCORE}/{data.PRB_POINT}
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
        padding: 32,

        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#D9D9D9"
    },

})


export default WriteHistoryListScreen;