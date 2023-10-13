import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput} from 'react-native'
import { splitProblemAnswer, dataParsing, dataParsing2 } from '../../lib/utils';



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



export default TypeProbChoiceWrite = ({ problem, userProblem, currentIndex , setCurrentIndex, submitted, setSubmitted, PRB_CORRT_ANSW, PRB_USER_ANSW, PRB_USER_ANSW2, TAG, PRB_POINT, SCORE, SCORE2, ERROR_CONT, ERROR_CONT2, size}) => {

    // 유저 답안1
    const [textInput, setTextInput] = useState(PRB_USER_ANSW);
    // 유저 답안2
    const [textInput2, setTextInput2] = useState(PRB_USER_ANSW2);

    // 감점 요인
    const [errorContents, setErrorContents] = useState(ERROR_CONT)
    const [errorContents2, setErrorContents2] = useState(ERROR_CONT2)

    // 점수
    const [score, setScore] = useState(SCORE)
    const [score2, setScore2] = useState(SCORE2)

    

    useEffect(() => {
        if(submitted){
            
            setScore(SCORE)
            setScore2(SCORE2)
            
            setErrorContents(ERROR_CONT)
            setErrorContents2(ERROR_CONT2)

            // const data = ERROR_CONT.split("/")
            // console.log(data[0], data[1])
            // console.log(ERROR_CONT2)
        }
    }, [submitted])

    const handleNextProblem = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);

        if(currentIndex + 1 < userProblem.length){    
            setSubmitted(true)
        }else{
            setSubmitted(false)
        }
    };

    const handlePrevProblem = () => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
        
        setSubmitted(true)
    }


    const handleSubmitProblem = async() =>{
        const answer = {}

        /*
            서술형 채점은 여기서
        */

        if(TAG == "001" || TAG == "002"){
            answer.PRB_USER_ANSW = textInput
            answer.PRB_USER_ANSW2 = textInput2

            const data1 = dataParsing({...problem, text: splitProblemAnswer(PRB_CORRT_ANSW).text1}, textInput)
            const data2 = dataParsing({...problem, text: splitProblemAnswer(PRB_CORRT_ANSW).text2}, textInput2)


            // ㄱ 문제
            await axios.post("https://port-0-docker-essay-score-jvvy2blm7ipnj3.sel5.cloudtype.app/main", data1).then(res => {
                console.log("ㄱ 문제")
                const data = res.data
                
                answer.SCORE = data.result_score
                answer.ERROR_CONT = `${data.s_message}<br/>`
                
                // 맞춤법 검사기 출력
                answer.ERROR_CONT += "맞춤법 검사<br/>"
                for(let i in data.sp_message){
                    for(let key in data.sp_message[i]){
                        answer.ERROR_CONT+=`${key} ${data.sp_message[i][key]}<br/>`
                    }
                }

            }).catch(err => {
                console.log(err)
            })
            
            // ㄴ 문제
            await axios.post("https://port-0-docker-essay-score-jvvy2blm7ipnj3.sel5.cloudtype.app/main", data2).then(res => {
                console.log("ㄴ 문제")
                const data = res.data

                answer.SCORE2 = data.result_score
                answer.ERROR_CONT2 = `${data.s_message}<br/>`

                // 맞춤법 검사기 출력
                answer.ERROR_CONT2 += "맞춤법 검사<br/>"
                for(let i in data.sp_message){
                    for(let key in data.sp_message[i]){
                        answer.ERROR_CONT2+=`${key} ${data.sp_message[i][key]}<br/>`
                    }
                }

            }).catch(err => {
                console.log(err)
            })

          
        }else if(TAG == "003"){
            answer.PRB_USER_ANSW = textInput

            const data = dataParsing({...problem, text: PRB_CORRT_ANSW}, textInput)

            // console.log(data)
            await axios.post("https://port-0-docker-essay-score-jvvy2blm7ipnj3.sel5.cloudtype.app/main", data).then(res => {
                const data = res.data

                answer.SCORE = data.result_score
                answer.ERROR_CONT = `${data.s_message}<br/>`

                // 글자수 출력
                answer.ERROR_CONT += `글자 수: ${data.len_message}<br/>`

                // 맞춤법 검사기 출력
                answer.ERROR_CONT += "맞춤법 검사<br/>"
                for(let i in data.sp_message){
                    for(let key in data.sp_message[i]){
                        answer.ERROR_CONT+=`${key} ${data.sp_message[i][key]}<br/>`
                    }
                }

            }).catch(err => {
                console.log(err)
            })
            
        }else if(TAG == "004"){
            
            const time = Date.now()
            answer.PRB_USER_ANSW = textInput

            const data = dataParsing2(problem, textInput)


            // console.log(data)
            await axios.post("https://port-0-docker-essay-score-jvvy2blm7ipnj3.sel5.cloudtype.app/main", data).then(res => {
                const data = res.data

                // answer.SCORE = data.result_score
                answer.SCORE = 0
                
                console.log(Date.now() - time)
                
                // 글자수 출력
                answer.ERROR_CONT = `글자 수: ${data["글자 수 검사"]}<br/>`
                
                // 채점 결과
                answer.ERROR_CONT += data["채점결과"]
            }).catch(err => {
                console.log(err)
            })
            
        }

        userProblem.push(answer)
        
        
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
                                    <Text style = {[styles.textRight, styles.text]}>Score: {score} / 5</Text>        
                                </View>
                                <ProblemAnswerView text = {PRB_USER_ANSW}/>
                                
                                <Text style = {[styles.textLeft, styles.text]}>Best answer</Text>
                                <ProblemAnswerView text = {splitProblemAnswer(PRB_CORRT_ANSW).text1}/>
                            
                            </View>

                            <View style = {styles.questionContainer}>

                                <Text style = {styles.text}>㉡</Text>
                                <View style = {styles.alignRow}>
                                    <Text style = {[styles.textLeft, styles.text]}>Your answer</Text>
                                    <Text style = {[styles.textRight, styles.text]}>Score: {score2} / 5</Text>        
                                </View>
                                <ProblemAnswerView text = {PRB_USER_ANSW2}/>
                                
                                <Text style = {[styles.textLeft, styles.text]}>Best answer</Text>
                                <ProblemAnswerView text = {splitProblemAnswer(PRB_CORRT_ANSW).text2}/>
                            
                            </View>
                        </View> :
                        <View style = {styles.questionContainer}>
                            <View style = {styles.alignRow}>
                                    <Text style = {[styles.textLeft, styles.text]}>Your answer</Text>
                                    <Text style = {[styles.textRight, styles.text]}>Score: {score} / {PRB_POINT}</Text>        
                            </View>
                            <ProblemAnswerView text = {PRB_USER_ANSW} />

                            <Text style = {[styles.textLeft, styles.text]}>Best answer</Text>
                            <ProblemAnswerView text = {PRB_CORRT_ANSW}/>
                        </View>
                }



                <Text style = {styles.text}>감점요인 / 채점기준</Text>
                <ProblemAnswerView text = {errorContents} />
                { (TAG == "001" || TAG == "002") && <ProblemAnswerView text = {errorContents2} /> }  
                

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
        minHeight: 128,

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
