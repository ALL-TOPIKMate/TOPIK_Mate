import React, {useState, useEffect, useContext} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';
import UserContext from "../lib/UserContext";
import { typeName } from "../lib/utils";


// route.params = {section, tag}
const WriteHistoryScreen = ({route, navigation}) =>{

    // 유저 정보
    const USER = useContext(UserContext)


    // 불러온 데이터
    const [data, setData] = useState([]);


    const wrongCollection = firestore().collection("users")
                            .doc(USER.uid).collection("wrong_lv2")
                            .doc("WR_TAG").collection("PRB_TAG")
                            .doc(route.params.tag).collection("PRB_RSC_LIST")
    

    const PRB_NUM = route.params.tag == "001" ? "51":
        route.params.tag == "002" ? "52": 
        route.params.tag == "003" ? "53": "54"

    
    useEffect(()=>{

        dataLoading();

    }, [])


    function dataLoading(){
        try{

            wrongCollection.get().then((querySnapshot) => {
                setData(querySnapshot.docs.map(doc => {
                    return {
                        PRB_ID: doc.id,
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
                <Text>
                    {PRB_NUM}번 문제입니다
                </Text>
                <Text>
                    문제 회차를 선택하세요
                </Text>
            </View>
            <View style = {{flex: 8}}>
                <ScrollView>
                    {
                        data.map((data, index)=>{
                            return (
                                <TouchableOpacity key = {index} style = {styles.buttonList} onPress = {() => navigation.push("WriteHistoryList", {tag: route.params.tag, PRB_RSC: data.PRB_RSC, PRB_ID: data.PRB_ID, PRB_NUM: PRB_NUM})} >
                                    <Text style = {{fontSize: 16}}>{data.PRB_RSC}</Text>
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

    buttonList: {
        backgroundColor: "#D9D9D9",
        padding: 32,
        marginVertical: 2,
    }
})


export default WriteHistoryScreen;