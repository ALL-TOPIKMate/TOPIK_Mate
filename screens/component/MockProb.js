import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import filebase from '@react-native-firebase/app';

import AudRef from './AudRef';

const MockProb = ({ problem, choice, setChoice, index, setIndex, setDirection, images }) => {

    // 사용자 선택 저장
    const [click, setClick] = useState(choice);
    
    useEffect(() => {
      setClick(choice);
    }, [choice]);

    return (
        <View>
            {/* 오디오 */}


            {/* ProbMain */}
            <View style={styles.probMain}>
                <Text>{ problem.PRB_NUM }</Text>
                <Text>{ problem.PRB_MAIN_CONT}</Text>
            </View>

            
            {/* 이미지 */}
            {
              problem.IMG_REF in images
              ? <Image
                style={{ width: 100, height: 100 }}
                source={{ uri: images[problem.IMG_REF].url }}
              />
              : null
            }



            <Text>{ problem.PRB_TXT }</Text>
            <Text>{ problem.PRB_SUB_CONT }</Text> 
            <Text>{ problem.PRB_SCRPT }</Text>

            {
                problem.PRB_SECT === "듣기" || problem.PRB_SECT === "읽기"
                ? <View>
                    <TouchableOpacity onPress = {() => {setClick("1");}} style={[styles.choiceButton, {backgroundColor: click === "1" ? "#BBD6B8" : "#D9D9D9"}]}>
                      {
                        problem.PRB_CHOICE1 in images
                        ? <Image
                          style={{width: 50, height: 50}}
                          source={{uri: images[problem.PRB_CHOICE1].url}}
                        />
                        : <Text>{ problem.PRB_CHOICE1 }</Text>
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {setClick("2");}} style={[styles.choiceButton, {backgroundColor: click === "2" ? "#BBD6B8" : "#D9D9D9"}]}>
                      {
                        problem.PRB_CHOICE2 in images
                        ? <Image
                          style={{width: 50, height: 50}}
                          source={{uri: images[problem.PRB_CHOICE2].url}}
                        />
                        : <Text>{ problem.PRB_CHOICE2 }</Text>
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {setClick("3");}} style={[styles.choiceButton, {backgroundColor: click === "3" ? "#BBD6B8" : "#D9D9D9"}]}>
                      {
                        problem.PRB_CHOICE3 in images
                        ? <Image
                          style={{width: 50, height: 50}}
                          source={{uri: images[problem.PRB_CHOICE3].url}}
                        />
                        : <Text>{ problem.PRB_CHOICE3 }</Text>
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {setClick("4");}} style={[styles.choiceButton, {backgroundColor: click === "4" ? "#BBD6B8" : "#D9D9D9"}]}> 
                      {
                        problem.PRB_CHOICE4 in images
                        ? <Image
                          style={{width: 50, height: 50}}
                          source={{uri: images[problem.PRB_CHOICE4].url}}
                        />
                        : <Text>{ problem.PRB_CHOICE4 }</Text>
                      }
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
