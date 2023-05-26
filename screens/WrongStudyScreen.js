import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import WrongProb from './WrongProb';


// route.params.key = {"select", "random", "write"}
// route.params.userTag로 유형을 나눔

// write인 경우 userTag, order
// select, random인 경우 userTag 

const WrongStudyScreen = ({route, navigation}) =>{
    // 백엔드에서 불러온 json 문제
    const [loadedProblem, setLoadedProblem] = useState([]); // json
    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(route.params.order);
    const choiceRef = useRef(0);

    const answerRef = useRef([]);

    // 현재 유형의 인덱스를 가르킴
    const typeRef = useRef(0);
    // 현재 듣기, 읽기 영역을 가르킴
    const sectionRef = useRef(0);
    // 로드한 데이터의 마지막 문제를 가르킴
    const lastVisible = useRef(0);

    
    // 유저의 복습하기 콜렉션을 load
    const querySnapshot = route.params.querySnapshot
    const wrongCollection = querySnapshot.doc(route.params.userInfo.userId).collection(`wrong_lv${route.params.userInfo.myLevel}`);
    

    useEffect(()=>{
        if(route.params.key == "select" || route.params.key == "random"){ 
            loadProblem()
        }else if(route.params.key =="write"){
            allLoadProblem();
        }
    }, [])


    // 쓰기 영역 - 최대 10문제를 한번에 불러옴
    // const allLoadProblem = () =>{
        
    //     async function dataLoading(){
    //         try{
    //             const data = await problemCollection.get(); // 요청한 데이터가 반환되면 다음 줄 실행
    //             setLoadedProblem(data.docs.map(doc => ({...doc.data(), tag: route.params.userTag})))
    //         }catch(error){
    //             console.log(error.message);
    //         }    
    //     }

    //     dataLoading();
    // }


    // 듣기, 읽기 영역 - 한 유형에 대해 5문제씩 불러옴
    const loadProblem = () =>{
        async function dataLoading(){
            try{
                console.log(route.params.userTag)
                // 1. startAfter 사용시 orderBy와 함께 사용
                // 2. where절에서 지정한 column과 orderBy에서 지정한 column은 동일한 column을 가져야 함
                // 3. where에서는 범위를 지정해야 한다. (== 연산자 사용 불가)
                const data = await wrongCollection.doc(route.params.userTag[sectionRef.current].section).collection("PRB_TAG").doc(route.params.userTag[typeRef.current].tagName).collection("PRB_LIST")
                    .where("PRB_NUM", ">=", "1").orderBy("PRB_NUM").startAfter(lastVisible.current).limit(3).get();
                    


                const rawData = data.docs.map((doc, index)=> {return {...doc.data()}})
                
                console.log(rawData)
                // 한 유형 문제를 다 풀었을 경우 다음 유형 문제로 이동, 새로운 collection load
                if(rawData.length == 0){ // collection loading
                    typeRef.current++;

                    if(typeRef.current>=route.params.userTag.length){ // 이제 그만풀어라
                        console.log("선택한 모든 유형의 문제를 풀었습니다.")
                        sectionRef.current++;
                        
                        return ;
                    }

                    console.log(route.params.userTag[typeRef.current].tagName)
                    const data = await wrongCollection.doc(route.params.userTag[sectionRef.current].section).collection("PRB_TAG").doc(route.params.userTag[typeRef.current].tagName).collection("PRB_LIST")
                        .limit(3).get();
                
                    const rawData = data.docs.map((doc, index)=> {return {...doc.data()}})
                }

                lastVisible.current = rawData[rawData.length-1].PRB_NUM

                console.log(rawData)
                // console.log(lastVisible.current)
                setLoadedProblem([...loadedProblem, ...rawData])
            }catch(error){
                console.log(error.message);
            }    
        }

        dataLoading();
    }


    useEffect(()=>{
        if(nextBtn == loadedProblem.length && nextBtn > 0){
            loadProblem()
        }
        if(loadedProblem.length && nextBtn > 0 && loadedProblem[nextBtn-1].choice===undefined && choiceRef.current !== 0){ // 유저 답안을 기록
            answerRef.current.push(choiceRef.current)
            loadedProblem[nextBtn-1].choice = answerRef.current[nextBtn-1]

            console.log(loadedProblem[nextBtn-1].choice)
        }
        
        choiceRef.current = 0;


    }, [nextBtn])

    return (
        <View>
            {
                (loadedProblem.length && nextBtn < loadedProblem.length ? 
                    <WrongProb 
                        problem = {loadedProblem[nextBtn]}
                        nextBtn = {nextBtn}
                        setNextBtn = {setNextBtn}

                        choiceRef = {choiceRef}

                        key = {nextBtn}
                    />
                : null    
                )
            }
            
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        padding: 20,
    },
})



export default WrongStudyScreen;