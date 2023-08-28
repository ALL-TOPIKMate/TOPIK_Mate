import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button, Image} from 'react-native'

export default WrongProbChoice = ({ problemsRef, images, PRB_CHOICE1, PRB_CHOICE2, PRB_CHOICE3, PRB_CHOICE4, PRB_CORRT_ANSW, PRB_USER_ANSW, nextBtn, setNextBtn, isSubmit, setIsSubmit}) =>{

    // 유저가 누르는 버튼 
    const [click, setClick] = useState(0);

    // 4지선다 이미지 여부
    const isImage = images[PRB_CHOICE1]





    // 버튼 배경색 활성화
    function setButtonColor(btn){
        if(isSubmit){
            // 유저가 답을 맞췄을 경우
            if(PRB_CORRT_ANSW == PRB_USER_ANSW){
                if(btn == PRB_USER_ANSW){
                    return "#BAD7E9"
                }else{
                    return "#D9D9D9"
                }
            }else{ // 답을 틀렸을 경우
                if(btn == PRB_USER_ANSW){
                    return "#FFACAC"
                }else if(btn == PRB_CORRT_ANSW){
                    return "#BAD7E9"
                }else{
                    return "#D9D9D9"
                }
            }
        }else{
            if(btn == click){
                return "#BBD6B8"
            }else{
                return "#D9D9D9"
            }
        }
    }




    // 제출 
    function submitHandler(){
        setIsSubmit(true)

        // 유저 답안 생성
        problemsRef.current.push({
            PRB_USER_ANSW: click
        })
    }

    // 이전
    function previousHandler(){
        setNextBtn(nextBtn-1)
        setIsSubmit(true)
    }

    // 다음
    function nextHandler(){
        setNextBtn(nextBtn+1)

        if( nextBtn+1 == problemsRef.current.length ){
            setIsSubmit(false)
        }else{
            setIsSubmit(true)
        }
    }



    return (
        <View>
        <Text /><Text />

        {
            isImage && (
                <View>
                    <TouchableOpacity onPress = {() => {setClick("1")}} disabled = { PRB_USER_ANSW } style = {[styles.imageButton, {borderColor: setButtonColor("1")}]}>
                        <Image
                        style={{height: 200}}
                        resizeMode = "stretch"
                        source={{uri: images[PRB_CHOICE1]}}
                        />
                    </TouchableOpacity>
                    <Text/>
                    <TouchableOpacity onPress = {() => {setClick("2")}} disabled = { PRB_USER_ANSW } style = {[styles.imageButton, {borderColor: setButtonColor("2")}]}>
                        <Image
                        style={{height: 200}}
                        resizeMode = "stretch"
                        source={{uri: images[PRB_CHOICE2]}}
                        />
                    </TouchableOpacity>
                    <Text/>
                    <TouchableOpacity onPress = {() => {setClick("3")}} disabled = { PRB_USER_ANSW } style = {[styles.imageButton, {borderColor: setButtonColor("3")}]}>
                        <Image
                        style={{height: 200}}
                        resizeMode = "stretch"
                        source={{uri: images[PRB_CHOICE3]}}
                        />
                    </TouchableOpacity>
                    <Text/>
                    <TouchableOpacity onPress = {() => {setClick("4")}} disabled = { PRB_USER_ANSW } style = {[styles.imageButton, {borderColor: setButtonColor("4")}]}>
                        <Image
                        style={{height: 200}}
                        resizeMode = "stretch"
                        source={{uri: images[PRB_CHOICE4]}}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
        
        {
            !isImage && (
                <View>
                    <TouchableOpacity onPress = {() => {setClick("1")}} disabled = { PRB_USER_ANSW } style = {[styles.button, {backgroundColor: setButtonColor("1")}]}>
                        <Text>
                            {PRB_CHOICE1}
                        </Text>
                    </TouchableOpacity>
                    <Text/>
                    <TouchableOpacity onPress = {() => {setClick("2")}} disabled = { PRB_USER_ANSW } style = {[styles.button, {backgroundColor: setButtonColor("2")}]}>
                        <Text>
                            {PRB_CHOICE2}
                        </Text>
                    </TouchableOpacity>
                    <Text/>
                    <TouchableOpacity onPress = {() => {setClick("3")}} disabled = { PRB_USER_ANSW } style = {[styles.button, {backgroundColor: setButtonColor("3")}]}>
                        <Text>
                            {PRB_CHOICE3}
                        </Text>
                    </TouchableOpacity>
                    <Text/>
                    <TouchableOpacity onPress = {() => {setClick("4")}} disabled = { PRB_USER_ANSW } style = {[styles.button, {backgroundColor: setButtonColor("4")}]}>
                        <Text>
                            {PRB_CHOICE4}
                        </Text>
                    </TouchableOpacity>
                </View>
            )

        }

        <Text /><Text />

        <View style = {{flexDirection: "row", justifyContent: "center"}}>
            <TouchableOpacity onPress={previousHandler} disabled = {nextBtn == 0} style = {[styles.button, styles.moveButton, nextBtn == 0 ? styles.buttonDisabled : styles.buttonAbled]}>
                <Text>
                    PREV
                </Text>
            </TouchableOpacity>

            
            {
                !isSubmit ? 
                    <TouchableOpacity onPress = {submitHandler} disabled = {click==0} style = {[styles.button, styles.moveButton, click == 0 ? styles.buttonDisabled : styles.buttonAbled]}>
                        <Text>
                            SUBMIT
                        </Text>
                    </TouchableOpacity>: 
                    <TouchableOpacity onPress = {nextHandler}  style = {[styles.button, styles.moveButton, styles.buttonAbled]}>
                        <Text>
                            NEXT
                        </Text>
                    </TouchableOpacity>
            }
        </View>

        <View style = {{height: 80}}/>
        
    </View>
    );
}


const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

        padding: 16
    },

    imageButton: {
        borderWidth: 5
    },

    // 4지선다 제외한 버튼 (제출, 이전, 다음)
    moveButton: {
        width: 100, 
        marginHorizontal: 10
    },

    // 버튼 활성화
    buttonAbled: {
        backgroundColor: "#94AF9F"
    },
    // 버튼 비활성화 
    buttonDisabled: {
        backgroundColor: "#D9D9D9"
    }
    
})