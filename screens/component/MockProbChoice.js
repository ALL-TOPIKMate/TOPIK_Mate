import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native'

export default MockProbChoice = (props) =>{

    // 제출 여부를 확인하여 렌더링
    // const [subBtn, setSubBtn] = useState(false);
    // 유저가 누르는 버튼 
    const [click, setClick] = useState(0);

    // console.log(`props.targetRef: ${props.targetRef.current}`);
    // console.log(`props.userChoice: ${props.userChoice}`);


    function setBtnColor(btn){

        // if(props.targetRef !== -1){
        //     // 재확인
        //     return (props.userChoice == btn ? "#BBD6B8" : "#D9D9D9")            
        // } else if (props.userChoice !== undefined) {
        //     // 이전으로 돌아와서 다시 풀기
        //     return (props.userChoice == click ? "#BBD6B8" : "#D9D9D9")
        // }

        // 4지선다 활성화
        return (btn == click ? "#BBD6B8" : "#D9D9D9")
        
    }

    return (
      <View>
        
        <TouchableOpacity onPress = {() => {props.choiceRef.current = 1; setClick(1)}} disabled = {props.targetRef.current !== -1} style = {[styles.button, {backgroundColor: click == 1 ? "#BBD6B8" : "#D9D9D9"}]}>
            <Text>
                {props.PRB_CHOICE1}
            </Text>
        </TouchableOpacity>
        <Text/>
        <TouchableOpacity onPress = {() => {props.choiceRef.current = 2; setClick(2)}} disabled = {props.targetRef.current !== -1} style = {[styles.button, {backgroundColor: click == 2 ? "#BBD6B8" : "#D9D9D9"}]}>
                <Text>
                    {props.PRB_CHOICE2}
                </Text>
        </TouchableOpacity>
        <Text/>
        <TouchableOpacity onPress = {() => {props.choiceRef.current = 3; setClick(3)}} disabled = {props.targetRef.current !== -1} style = {[styles.button, {backgroundColor: click == 3 ? "#BBD6B8" : "#D9D9D9"}]}>
                <Text>
                    {props.PRB_CHOICE3}
                </Text>
        </TouchableOpacity>
        <Text/>
        <TouchableOpacity onPress = {() => {props.choiceRef.current = 4; setClick(4)}} disabled = {props.targetRef.current !== -1} style = {[styles.button, {backgroundColor: click == 4 ? "#BBD6B8" : "#D9D9D9"}]}>
                <Text>
                    {props.PRB_CHOICE4}
                </Text>
        </TouchableOpacity>

        <Text/>
        {
            props.targetRef.current !== -1 
            ? (
                <TouchableOpacity onPress = {() => {props.targetRef.current = -1}} style = {[styles.button, {backgroundColor: "#94AF9F"}]}>
                    <Text>
                        CLOSE
                    </Text>
                </TouchableOpacity>
            )
            : (
                <TouchableOpacity onPress = {() => {props.choiceRef.current = click; props.setNextBtn(props.nextBtn + 1);}} style = {[styles.button, {backgroundColor: "#94AF9F"}]}>
                    <Text>
                        NEXT TO
                    </Text>
                </TouchableOpacity>
            )

        }
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