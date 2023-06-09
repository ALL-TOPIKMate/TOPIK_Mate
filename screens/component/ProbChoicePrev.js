import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button, Image} from 'react-native'

export default ProbChoicePrev = ({ problem, nextBtn, setNextBtn, choiceRef}) =>{

    // 제출 여부를 확인하여 렌더링
    const [subBtn, setSubBtn] = useState(problem.choice ? true : false);

 
    // 유저가 누르는 버튼 
    const [click, setClick] = useState(0);


    // 4지선다 이미지 여부
    const isImage = problem.isImage





    function setBtnColor(btn){
        if(subBtn){ // 4지선다 비활성화 (사용자 정답 결과)
            if(btn == click){ // 유저가 고른 버튼
                if(btn == problem.PRB_CORRT_ANSW){ // 정답일경우
                    return "#BAD7E9"
                }
                
                return "#FFACAC" // 정답이 아닐 경우
            }else{ // 유저가 고른 버튼이 아닌 경우
                if(btn == problem.PRB_CORRT_ANSW){
                    return "#BAD7E9" // 정답을 표시
                }

                return "#D9D9D9"
            }
            
        }
        // 4지선다 활성화
        
        return (btn == click ? "#BBD6B8" : "#D9D9D9")
        
    }


    // Prev 버튼 클릭시 4시선다 
    function setBtnColorStop(btn){
        if(btn == problem.PRB_CORRT_ANSW){
            return "#BAD7E9"
        } else if(btn == problem.choice){
            return "#FFACAC"
        }else{
            return "#D9D9D9"
        }
    }


    return (
        <View>
        <Text /><Text />
        {
            isImage ? (   
                <TouchableOpacity onPress = {() => {setClick(1)}} disabled = {subBtn || problem.choice} style = {[{borderColor: problem.choice ? setBtnColorStop(1) : setBtnColor(1), borderWidth: 5}]}>
                    <Image
                    style={{height: 200}}
                    resizeMode = "stretch"
                    source={{uri: problem.PRB_CHOICE1}}
                    />
                </TouchableOpacity>
            ): (
                <TouchableOpacity onPress = {() => {setClick(1)}} disabled = {subBtn || problem.choice} style = {[styles.button, {backgroundColor: problem.choice ? setBtnColorStop(1) : setBtnColor(1)}]}>
                    <Text>
                        {problem.PRB_CHOICE1}
                    </Text>
                </TouchableOpacity>
            )

        }
       <Text/>
        {
            isImage ? (   
                <TouchableOpacity onPress = {() => {setClick(2)}} disabled = {subBtn || problem.choice} style = {[{borderColor: problem.choice ? setBtnColorStop(2) :setBtnColor(2), borderWidth: 5}]}>
                    <Image
                    style={{height: 200}}
                    resizeMode = "stretch"
                    source={{uri: problem.PRB_CHOICE2}}
                    />
                </TouchableOpacity>
            ):(
                <TouchableOpacity onPress = {() => {setClick(2)}} disabled = {subBtn || problem.choice} style = {[styles.button, {backgroundColor: problem.choice ? setBtnColorStop(2) :setBtnColor(2)}]}>
                    <Text>
                        {problem.PRB_CHOICE2}
                    </Text>
                </TouchableOpacity>
            )

        }
       <Text/>
       {
            isImage ? (   
                <TouchableOpacity onPress = {() => {setClick(3)}} disabled = {subBtn || problem.choice} style = {[{borderColor: problem.choice ? setBtnColorStop(3) :setBtnColor(3), borderWidth: 5}]}>
                    <Image
                    style={{height: 200}}
                    resizeMode = "stretch"
                    source={{uri: problem.PRB_CHOICE3}}
                    />
                </TouchableOpacity>
            ):(
                <TouchableOpacity onPress = {() => {setClick(3)}} disabled = {subBtn || problem.choice} style = {[styles.button, {backgroundColor: problem.choice ? setBtnColorStop(3) :setBtnColor(3)}]}>
                    <Text>
                        {problem.PRB_CHOICE3}
                    </Text>
                </TouchableOpacity>
            )
        }
       <Text/>
         {
            isImage ? (   
                <TouchableOpacity onPress = {() => {setClick(4)}} disabled = {subBtn || problem.choice} style = {[{borderColor: problem.choice ? setBtnColorStop(4) :setBtnColor(4), borderWidth: 5}]}>
                    <Image
                    style={{height: 200}}
                    resizeMode = "stretch"
                    source={{uri: problem.PRB_CHOICE4}}
                    />
                </TouchableOpacity>
            ):(
                <TouchableOpacity onPress = {() => {setClick(4)}} disabled = {subBtn || problem.choice} style = {[styles.button, {backgroundColor: problem.choice ? setBtnColorStop(4) :setBtnColor(4)}]}>
                    <Text>
                        {problem.PRB_CHOICE4}
                    </Text>
                </TouchableOpacity>
            )
        }
        <Text/>


        <View style = {{flexDirection: "row", justifyContent: "center"}}>
            <TouchableOpacity onPress={()=>{setNextBtn(nextBtn-1)}} disabled = {nextBtn == 0} style = {[styles.button, {backgroundColor: nextBtn == 0 ? "#D9D9D9" : "#94AF9F", width: 100, marginHorizontal: 10}]}>
                <Text>
                    PREV
                </Text>
            </TouchableOpacity>

            
            {!subBtn ? 
            (<TouchableOpacity onPress = {() => {setSubBtn(true)}} disabled = {click==0} style = {[styles.button, {backgroundColor: click == 0 ? "#D9D9D9" : "#94AF9F", width: 100, marginHorizontal: 10}]}>
                <Text>
                    SUBMIT
                </Text>
            </TouchableOpacity>): 
            (<TouchableOpacity onPress = {() => {choiceRef.current = click; setNextBtn(nextBtn+1);}}  style = {[styles.button, {backgroundColor: "#94AF9F", width: 100, marginHorizontal: 10}]}>
                <Text>
                    NEXT
                </Text>
            </TouchableOpacity>)}
        </View>
    </View>
    );
}


const styles = StyleSheet.create({
    button:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

        padding: 16
    }
})