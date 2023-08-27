import React, { useState, useEffect } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput} from 'react-native'
import { splitProblemAnswer } from '../../lib/utils';



// UserInputText
// Use before submit
const UserInputText = ({textInput, setTextInput}) => {
    return (
        <TextInput
            editable
            multiline
            numberOfLines={4}
            onChangeText={text => setTextInput(text)}
            value={textInput}

            // readOnly={submitted}
            style={styles.inputBox}
        />
    )
}

// Use after submit
const ProblemAnswerView = ({text}) => {
    return (
        <View style = {styles.inputBox}>
            <Text>
                {text}
            </Text>
        </View>
    )
}



export default TypeProbChoiceWrite = ({ problem, currentIndex , setCurrentIndex, submitted, setSubmitted, PRB_CORRT_ANSW, PRB_USER_ANSW, PRB_USER_ANSW2, TAG, POINT, SCORE, size}) => {

    // 유저 답안1
    const [textInput, setTextInput] = useState(PRB_USER_ANSW);
    // 유저 답안2
    const [textInput2, setTextInput2] = useState(PRB_USER_ANSW2);

    const [errorContents, setErrorContents] = useState("")
    
    
    const handleNextProblem = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);

        if(currentIndex + 1 < problem.length){    
            setSubmitted(true)
        }else{
            setSubmitted(false)
        }
    };

    const handlePrevProblem = () => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
        
        setSubmitted(true)
    }


    const handleSubmitProblem = () =>{
        const answer = {}

        if(TAG == "001" || TAG == "002"){
            answer.PRB_USER_ANSW = textInput
            answer.PRB_USER_ANSW2 = textInput2
        }else{
            answer.PRB_USER_ANSW = textInput
        }

        problem.push(answer)
        


        /*
            서술형 채점은 여기서
        */

        
        problem[currentIndex].SCORE = 0
        setErrorContents("")

        setSubmitted(true)
    }



    if (submitted) {
        return (
            <View style = {styles.container}>
                
                {
                    TAG == "001" || TAG == "002" ?
                        <View>
                            <View style = {styles.questionContainer}>
                                
                                <Text style = {styles.text}>㉠</Text>
                                <View style = {styles.alignRow}>
                                    <Text style = {[styles.textLeft, styles.text]}>Your answer</Text>
                                    <Text style = {[styles.textRight, styles.text]}>Score: {SCORE} / 5</Text>        
                                </View>
                                <ProblemAnswerView text = {PRB_USER_ANSW}/>
                                
                                <Text style = {[styles.textLeft, styles.text]}>Best answer</Text>
                                <ProblemAnswerView text = {splitProblemAnswer(PRB_CORRT_ANSW).text1}/>
                            
                            </View>

                            <View style = {styles.questionContainer}>

                                <Text style = {styles.text}>㉡</Text>
                                <View style = {styles.alignRow}>
                                    <Text style = {[styles.textLeft, styles.text]}>Your answer</Text>
                                    <Text style = {[styles.textRight, styles.text]}>Score: {SCORE} / 5</Text>        
                                </View>
                                <ProblemAnswerView text = {PRB_USER_ANSW2}/>
                                
                                <Text style = {[styles.textLeft, styles.text]}>Best answer</Text>
                                <ProblemAnswerView text = {splitProblemAnswer(PRB_CORRT_ANSW).text2}/>
                            
                            </View>
                        </View> :
                        <View style = {styles.questionContainer}>
                            <View style = {styles.alignRow}>
                                    <Text style = {[styles.textLeft, styles.text]}>Your answer</Text>
                                    <Text style = {[styles.textRight, styles.text]}>Score: {SCORE} / {POINT}</Text>        
                            </View>
                            <ProblemAnswerView text = {PRB_USER_ANSW} />

                            <Text style = {[styles.textLeft, styles.text]}>Best answer</Text>
                            <ProblemAnswerView text = {PRB_CORRT_ANSW}/>
                        </View>
                }



                <Text style = {styles.text}>감점요인 / 채점기준</Text>
                <ProblemAnswerView text = {errorContents} />
                    
                

                <Text />
                <Text />        
                <Text />
                <Text />


                <View style = {styles.buttonSubmitContainer}>
                    <TouchableOpacity style={[styles.button, {opacity: submitted ? 0.5 : 1}]} onPress={handleSubmitProblem} disabled={submitted}>
                        <Text style={styles.textalign}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>


                <Text />
                <Text />

                <View style = {styles.moveButtonContainer}>
                    <TouchableOpacity style={[styles.button, styles.moveButton, {opacity: currentIndex == 0 ? 0.5 : 1}]} onPress={handlePrevProblem} disabled={currentIndex == 0}>
                        <Text style={styles.textalign}>PREV</Text>
                    </TouchableOpacity>

                    <View style={styles.moveButtonSide}>
                        <Text> {currentIndex + 1} / {size} </Text>
                    </View>


                    <TouchableOpacity style={[styles.button, styles.moveButton, {opacity: submitted == false ? 0.5: 1}]} onPress={handleNextProblem} disabled={submitted == false}>
                        <Text style={styles.textalign}>NEXT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    } else {
        return (
            <View style = {styles.container}>
                {
                    TAG == "001" || TAG == "002" ?
                        <View>
                            <Text style = {styles.text}>㉠</Text>
                            <UserInputText textInput= {textInput} setTextInput={setTextInput}/>

                            <Text style = {styles.text}>㉡</Text>                            
                            <UserInputText textInput= {textInput2} setTextInput={setTextInput2}/>

                        </View> :

                        <View>
                            <UserInputText textInput= {textInput} setTextInput={setTextInput}/>
                        </View>
                }


                <Text />
                <Text />        
                <Text />
                <Text />


                <View style = {styles.buttonSubmitContainer}>
                    <TouchableOpacity style={[styles.button, {opacity: submitted ? 0.5 : 1}]} onPress={handleSubmitProblem} disabled={submitted}>
                        <Text style={styles.textalign}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>


                <Text />
                <Text />

                <View style = {styles.moveButtonContainer}>
                    <TouchableOpacity style={[styles.button, styles.moveButton, {opacity: currentIndex == 0 ? 0.5 : 1}]} onPress={handlePrevProblem} disabled={currentIndex == 0}>
                        <Text style={styles.textalign}>PREV</Text>
                    </TouchableOpacity>

                    <View style={styles.moveButtonSide}>
                        <Text> {currentIndex + 1} / {size} </Text>
                    </View>


                    <TouchableOpacity style={[styles.button, styles.moveButton, {opacity: submitted == false ? 0.5: 1}]} onPress={handleNextProblem} disabled={submitted == false}>
                        <Text style={styles.textalign}>NEXT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


}


const styles = StyleSheet.create({
    // 최상위 view 컨테이너
    container:{
        paddingHorizontal: 10
    },

    // 박스 묶는 컨테이너
    questionContainer: {
        marginVertical: 32
    },

    // 쓰기 영역
    inputBox: {
        padding: 10,
        borderColor: '#C1C0B9',
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderRadius: 5,

        flexShrink: 1,

        marginVertical: 14
    },
    
    // 제출 버튼 상위 컨테이너
    buttonSubmitContainer: {
        alignItems: "center",
        // justifyContents: "center"
    },
    // 버튼 컨테이너 (submit / next / prev)
    button: {
        backgroundColor: '#AFB9AE',
        borderRadius: 20,

        paddingVertical: 10,
        paddingHorizontal: 30
    },

    moveButtonContainer: {
        flexDirection: "row"
    },
    // prev next 버튼 
    moveButton: {
        backgroundColor: '#A4BAA1',
        flex: 1
    },
    // prev next 사이의 텍스트 컨테이너 (남은 문제 수 컨테이너)
    moveButtonSide: {
        flex: 0.7,
        alignItems: "center",
        justifyContent: "center"

    },

    textalign: {
        textAlign: "center"
    },

    // row정렬
    alignRow: {
        flexDirection: "row"
    },
    // text정렬
    textLeft: {
        flex: 1,
        textAlign: "left",
    },
    textRight: {
        flex: 1, 
        textAlign: "right"
    }, 
    text: {
        fontSize: 18
    }
});
