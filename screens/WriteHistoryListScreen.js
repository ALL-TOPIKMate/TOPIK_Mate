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


    function getDay(date){
        return date.split(" ")[0]
    }

    function getTime(date){
        const time = date.split(" ")[1]

        let [hr, min, mill] = time.split(":")
        // console.log(hr, min, mill)
        hr = hr.replace("0" , "")
        min = min.replace("0", "")

        return `${hr.length == 1 ? "오전": "오후"} ${hr}시 ${min}분`
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
                <Text> {route.params.PRB_RSC} {route.params.PRB_NUM}번입니다</Text>
            </View> 

            <View style = {{flex: 8}}>
                <ScrollView>
                    {
                        data.map((data, index)=>{
                            return (
                                <TouchableOpacity key = {index} style = {styles.buttonList} onPress = {()=>{navigation.push("WrongStudy", {key: "write", order: index, userTag: route.params.tag, PRB_ID: route.params.PRB_ID})}}>
                                    <Text style = {{fontSize: 16}}>
                                        {getDay(data.DATE)}
                                    </Text>
                                    <Text style = {{fontSize: 14}}>
                                        {getTime(data.DATE)}에 작성한 글입니다
                                    </Text>
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


export default WriteHistoryListScreen;