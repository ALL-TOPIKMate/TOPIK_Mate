import React, {useState, useEffect} from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';


const WriteHistoryListScreen = ({route, navigation}) => {
    const [data, setData] = useState([]);

    useEffect(()=>{
        setData([
            {
                date: "20230519", 
                score: "5/10",
                PRB_NUM: "51",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
            {
                date: "20230516", 
                score: "5/10",
                PRB_NUM: "51",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
            {
                date: "20230514", 
                score: "8/10",
                PRB_NUM: "52",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
            {
                date: "20230511", 
                score: "5/10",
                PRB_NUM: "51",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
            {
                date: "20230512", 
                score: "5/10",
                PRB_NUM: "51",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
            {
                date: "20230519", 
                score: "5/10",
                PRB_NUM: "51",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
            {
                date: "20230516", 
                score: "5/10",
                PRB_NUM: "51",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
            {
                date: "20230514", 
                score: "8/10",
                PRB_NUM: "52",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
            {
                date: "20230511", 
                score: "5/10",
                PRB_NUM: "51",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
            {
                date: "20230512", 
                score: "5/10",
                PRB_NUM: "51",
                tag: "빈칸에 들어갈 문장 쓰기"
            },
        ])

    }, []);

    return (
        <View style = {{flex: 1, padding: 20}}>
            <View style = {{flex: 1}}>
                <Text style = {{fontWeight: "bold", fontSize: 20}}>
                    {route.params.userTag}
                </Text>
            </View>
            <View style = {{flex: 0.5}}>
                <Text>
                    선택한 문제는 {route.params.userRsc} {route.params.userPrbNum}번 입니다
                </Text>
            </View> 

            <View style = {{flex: 8}}>
                <ScrollView>
                    {
                        data.map((data, index)=>{
                            return (
                                <TouchableOpacity key = {index} style = {styles.tagList} onPress = {()=>{navigation.push("WrongStudy", {key: "write", userTag: route.params.userTag, userPrbNum: route.params.userPrbNum, userRsc: route.params.userRsc, order: index})}}>
                                    <Text style = {{flex: 5}}>
                                        {data.date}
                                    </Text>
                                    <View style = {{flex: 1, flexDirection: "column"}}>
                                        <Text style = {{flex: 1}}/>
                                        <Text style = {{fontSize: 10}}>
                                        score {data.score}
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