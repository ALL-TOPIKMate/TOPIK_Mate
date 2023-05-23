import React, { useState, useEffect } from 'react'
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const MockProb = ({ problem, choice, setChoice, index, setIndex, setDirection }) => {

    console.log(`problem.PRB_NUM: ${problem.PRB_NUM}, problem.USER_CHOICE: ${problem.USER_CHOICE}, choice: ${choice}`); 
    
    // const click = 0;
    const [click, setClick] = useState(choice);
    
    useEffect(() => {
      setClick(choice);
    }, [choice]);


    console.log(`current click: ${click}`);

    return (
        <View>
            {/* ProbMain */}
            <View style={styles.probMain}>
                <Text>{ problem.PRB_NUM }</Text>
                <Text>{ problem.PRB_MAIN_CONT}</Text>
            </View>

            <Text>{ problem.PRB_TXT }</Text>
            <Text>{ problem.PRB_SUB_CONT }</Text> 

            {
                problem.PRB_SECT === "듣기" || problem.PRB_SECT === "읽기"
                ? <View>
                    <TouchableOpacity onPress = {() => {setClick("1");}} style={[styles.choiceButton, {backgroundColor: click === "1" ? "#BBD6B8" : "#D9D9D9"}]}>
                      <Text>{ problem.PRB_CHOICE1 }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {setClick("2");}} style={[styles.choiceButton, {backgroundColor: click === "2" ? "#BBD6B8" : "#D9D9D9"}]}>
                      <Text>{ problem.PRB_CHOICE2 }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {setClick("3");}} style={[styles.choiceButton, {backgroundColor: click === "3" ? "#BBD6B8" : "#D9D9D9"}]}>
                      <Text>{ problem.PRB_CHOICE3 }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {setClick("4");}} style={[styles.choiceButton, {backgroundColor: click === "4" ? "#BBD6B8" : "#D9D9D9"}]}> 
                      <Text>{ problem.PRB_CHOICE4 }</Text>
                    </TouchableOpacity>
                </View>
                : <View>
                  {/* 쓰기 입력 칸 */}
                  <TextInput 
                    onChangeText = {(text) => {setClick(text)}}
                    placeholder='Enter your answer here'
                    value={click}
                  />
                </View>
            }

            <View style = {styles.probMain}>
              <Button disabled={index === 0} onPress = {() => {setChoice(click); setClick(undefined); setDirection(1); setIndex(index - 1); }} title={"PREV"} />
              <Button onPress = {() => {setChoice(click); setClick(undefined); setDirection(-1); setIndex(index + 1); }} title={"NEXT"} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    probMain: {
        flexDirection: 'row'
    },
    choiceButton: {
      alignItems: "center",
      borderRadius: 10,
      padding: 16
    }
})

export default MockProb;
