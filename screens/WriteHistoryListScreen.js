import React, {useState, useEffect, useContext} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';
import UserContext from "../lib/UserContext";
import { typeName } from "../lib/utils";



const WriteHistoryListScreen = ({route, navigation}) => {
    
    // 유저 정보
    const USER = useContext(UserContext)


    // 불러온 데이터
    const [data, setData] = useState([])



    // 최대 10문제까지만 저장 
    const wrongCollection = firestore().collection("users")
                            .doc(USER.uid)
                            .collection("wrong_lv2")
                            .doc("WR_TAG")
                            .collection("PRB_TAG")
                            .doc(route.params.tag)
                            .collection("PRB_RSC_LIST")
                            .doc(route.params.PRB_ID)
                            .collection("PRB_LIST")
   
   
    useEffect(()=>{

        dataLoading();

    }, []);


    function dataLoading(){
        try{

            wrongCollection.get().then( querySnapshot => {
                setData(querySnapshot.docs.map(doc => {
                    return {
                        DATE: doc.id,
                        ...doc.data()
                    }
                }))
            })

        }catch(error){
            console.log(error.message);
        }    
    }


    return (
        <View style = {styles.container}>
            <View style = {{flex: 1}}>
                <Text style = {{fontWeight: "bold", fontSize: 20}}>
                    {typeName(2, "WR", route.params.tag)}
                </Text>
            </View>
            <View style = {{flex: 1}}>
                <Text> 선택한 문제는 </Text>
                <Text> {route.params.PRB_RSC} </Text>
                <Text> {route.params.PRB_ID}번 입니다 </Text>
            </View> 

            <View style = {{flex: 8}}>
                <ScrollView>
                    {
                        data.map((data, index)=>{
                            return (
                                <TouchableOpacity key = {index} style = {styles.tagList} onPress = {()=>{navigation.push("WrongStudy", {key: "write", order: index, userTag: route.params.tag, PRB_ID: route.params.PRB_ID})}}>
                                    
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
    container: {
        flex: 1, 
        padding: 20
    },

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