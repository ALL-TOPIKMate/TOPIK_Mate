import React, {useState, useEffect} from "react";
import {View, Text} from "react-native";
import firestore from '@react-native-firebase/firestore';


const WriteHistoryScreen = ({route, navigation}) =>{
    // 유저가 고른 유형에 해당하는 쓰기 목록을 가져옴
    const [data, setData] = useState([]);
    const problemCollection = firestore().collection('problems');
    

    useEffect(()=>{
        // route.params.tag와 일치하는 쓰기 목록 불러오기
        async function dataLoading(){
            try{
                const data = await problemCollection.where("PRB_SECT", "==", "쓰기").get(); // 요청한 데이터가 반환되면 다음 줄 실행
                setData(data.docs.map(doc => ({...doc.data(), tag: route.params.userTag})))
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
        <View style = {{flex: 10}}>
            <Text style = {{fontWeight: "bold", fontSize: 20, flex: 2}}>
                쓰기 히스토리
            </Text>

            {
                data.map((data, index) => {
                    <Text>  </Text>
                })  
            }
        </View>
    )
}

export default WriteHistoryScreen;