import React, {useState, useEffect, useContext} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';
import UserContext from "../lib/UserContext";
import { typeName, getRoundedScore } from "../lib/utils";

function deleteWriteDoc(data, wrongColl){
    try{

         for(let i = 0; i < data.length; i++){
            wrongColl.doc(data[i].DATE).delete().then(() => {
                console.log(`${data[i].DATE} 삭제 완료`)
            })
        }
    
    }catch(err){
        console.log(err)
    }
   
}

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


    async function dataLoading(){
        try{
            let dataset = [] 
            await wrongCollection.get().then( querySnapshot => {
                dataset = querySnapshot.docs.map(doc => {
                    return {
                        DATE: doc.id,
                        ...doc.data()
                    }
                })
            })

            /*
                쓰기 유형의 문제는 10개 제한 (delete)
            */
     
            deleteWriteDoc(dataset.filter((data, index) => {return dataset.length - index > 10}), wrongCollection)
            setData(dataset.slice((dataset.length-10 < 0 ? 0:  dataset.length-10), dataset.length))

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
        hr = hr[0] == "0" ? hr[1]: hr
        min = min[0] == "0" ? min[1]: min

        return `${parseInt(hr) < 12 ? "오전": "오후"} ${hr}시 ${min}분`
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
                                    <View style = {{flex: 1}}>
                                        <Text style = {{fontSize: 16}}>
                                            {getDay(data.DATE)}
                                        </Text>
                                        <Text style = {{fontSize: 12}}>
                                            {getTime(data.DATE)}에 작성한 글입니다
                                        </Text>
                                    </View>
                                    <View style = {styles.scoreBox}>
                                        <Text>SCORE: {getRoundedScore(data.SCORE + (data.SCORE2 || 0))} / {data.PRB_POINT}</Text>
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

    buttonList: {
        backgroundColor: "#D9D9D9",
        // padding: 32,
        paddingLeft: 32,
        paddingVertical: 32,
        marginVertical: 2,

        flexDirection: "row",

        // justifyContent: "center",
        alignItems: "center"
    },

    scoreBox: {
        top: 32,
        flex: 0.5
    }

})


export default WriteHistoryListScreen;