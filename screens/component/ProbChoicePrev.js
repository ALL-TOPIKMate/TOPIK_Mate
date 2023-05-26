import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native'

export default ProbChoicePrev = (props) =>{
    // 제출 여부를 확인하여 렌더링
    const [subBtn, setSubBtn] = useState(false);
    // 유저가 누르는 버튼 
    const [click, setClick] = useState(0);

    function setBtnColor(btn){
        if(subBtn){ // 4지선다 비활성화 (사용자 정답 결과)
            if(btn == click){ // 유저가 고른 버튼
                if(btn == props.PRB_CORRT_ANSW){ // 정답일경우
                    return "#BAD7E9"
                }
                
                return "#FFACAC" // 정답이 아닐 경우
            }else{ // 유저가 고른 버튼이 아닌 경우
                if(btn == props.PRB_CORRT_ANSW){
                    return "#BAD7E9" // 정답을 표시
                }

                return "#D9D9D9"
            }
            
        }
        // 4지선다 활성화
        
        return (btn == click ? "#BBD6B8" : "#D9D9D9")
        
    }

    return (
      <View>
        <Text /><Text />
        
        <TouchableOpacity onPress = {() => {setClick(1)}} disabled = {subBtn} style = {[styles.button, {backgroundColor: setBtnColor(1)}]}>
            <Text>
                {props.PRB_CHOICE1 ? props.PRB_CHOICE1 : "그림1"}
            </Text>
       </TouchableOpacity>
       <Text/>
       <TouchableOpacity onPress = {() => {setClick(2)}} disabled = {subBtn} style = {[styles.button, {backgroundColor: setBtnColor(2)}]}>
            <Text>
                {props.PRB_CHOICE2? props.PRB_CHOICE2 : "그림2"}
            </Text>
       </TouchableOpacity>
       <Text/>
       <TouchableOpacity onPress = {() => {setClick(3)}} disabled = {subBtn} style = {[styles.button, {backgroundColor: setBtnColor(3)}]}>
            <Text>
                {props.PRB_CHOICE3? props.PRB_CHOICE3 : "그림3"}
            </Text>
       </TouchableOpacity>
       <Text/>
       <TouchableOpacity onPress = {() => {setClick(4)}} disabled = {subBtn} style = {[styles.button, {backgroundColor: setBtnColor(4)}]}>
            <Text>
                {props.PRB_CHOICE4 ? props.PRB_CHOICE4 : "그림4"}
            </Text>
       </TouchableOpacity>

        <Text/>

        <View style = {{flexDirection: "row"}}>
            <TouchableOpacity style = {[styles.button, {backgroundColor: props.nextBtn == 0 ? "#D9D9D9" : "#94AF9F"}]} onPress={()=>{props.setNextBtn(props.nextBtn-1)}}>
                <Text>
                    PREV
                </Text>
            </TouchableOpacity>

            {!subBtn ? 
            (<TouchableOpacity onPress = {() => {props.choiceRef.current = click; setSubBtn(true)}} disabled = {click==0} style = {[styles.button, {backgroundColor: click == 0 ? "#D9D9D9" : "#94AF9F"}]}>
                <Text>
                    SUBMIT
                </Text>
            </TouchableOpacity>): 
            (<TouchableOpacity onPress = {() => {props.setNextBtn(props.nextBtn+1)}} style = {[styles.button, {backgroundColor: "#94AF9F"}]}>
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