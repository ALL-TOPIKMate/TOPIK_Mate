import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


import ProbMain from './ProbMain';
import ImgRef from './ImgRef';


const AudRef = (audio) =>{

    const finishTime = audio.getDuration()
    const [currentTime, setCurrenttime] = useState(5)
    const widthRef = useRef(null)
    const width = useRef(0)


    // useEffect(()=>{

    //     if(widthRef.current){
    //         console.log(widthRef.current.width)
    //         width.current = widthRef.current.width
    //         // console.log(width.current)
    //         // setTimeout(()=>{

    //         // }, 1000)
    //     }

    // }, [widthRef])



    const [isRunning, setIsRunning] = useState(false);

    function audioPlay(){
        if(audio){
            
            if(audio.isPlaying()){
                audio.pause()

                setIsRunning(false)
            }else{
                setIsRunning(true)
        
                // audio.play()

                audio.play((success) => {
                    if (success) {
                      setIsRunning(false);
                      console.log('successfully finished playing');
                    } else {
                      setIsRunning(false);
                      console.log('playback failed due to audio decoding errors');
                    }
                })
            }
        }
    }

    return (
        <View style = {styles.btnBox}>
            <TouchableOpacity onPress={()=>{audioPlay()}} style = {styles.btnPlay}>
                    {
                        isRunning
                        ? <Text style = {{color: "#F6F1F1", fontSize: 16}}>
                        Stop
                        </Text>
                        : <Text style = {{color: "#F6F1F1", fontSize: 16}}>
                        Start
                        </Text>
                    }
            </TouchableOpacity>
            <TouchableOpacity ref = {widthRef} disabled = {true} style = {styles.playlist} >
                    <Text style = {{backgroundColor: "black", height: 10, width: 5}}>
                        ▷
                    </Text>
                </TouchableOpacity>
            <Text>
                {audio.getDuration()}초
            </Text>
        </View>  
    )
}





const MockProb = ({ problem, choice, setChoice, choice2, setChoice2, index, setIndex, setIsEnd, probListLength, setDirection, images, audios }) => {

    // 사용자 선택 저장
    const [click, setClick] = useState(choice);
    const [click2, setClick2] = useState(choice2);

    useEffect(() => {
        setClick(choice);
    }, [choice]);

    useEffect(() => {
        setClick2(choice2);
    }, [choice2]);


    // 오디오 파일이 있으면 audio Object 가져오기
    let audio = undefined;
    if (problem.AUD_REF in audios.current) {
        audio = audios.current[problem.AUD_REF].URL;
    }



    // 언마운트 시 자원 삭제
    useEffect(() => {
        return () => {
            if (audio !== undefined) {
                console.log("오디오 멈춤")
                audio.stop() // 오디오 일시정지, release시 오디오 재생 불가능
            }
        };
    }, []);


    return (
        <View>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        setIsEnd(true);
                    }}
                    style={styles.exitBtn}>
                    <Text>Exit</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View>
                    {/* 오디오 */}
                    {
                        problem.AUD_REF in audios.current
                            ? AudRef(audio)
                            : null
                    }

                    {/* ProbMain */}
                    <ProbMain PRB_MAIN_CONT = {problem.PRB_MAIN_CONT} PRB_NUM = {problem.PRB_NUM}/>


                    {/* 이미지 */}
                    {
                        problem.IMG_REF in images.current
                            ? <ImgRef IMG_REF = {images.current[problem.IMG_REF].url} />
                            : null
                    }

                    {/* 문항, 지문 텍스트 */}
                    {
                        problem.PRB_TXT !== ''
                            ? <Text style={{ marginVertical: 16 }}>{problem.PRB_TXT}</Text>
                            : null
                    }
                    {
                        problem.PRB_SUB_CONT !== ''
                            ? <Text style={{ marginVertical: 16 }}>{problem.PRB_SUB_CONT}</Text>
                            : null
                    }
                    {
                        problem.PRB_SCRPT !== ''
                            ? <Text style={{ marginVertical: 16 }}>{problem.PRB_SCRPT}</Text>
                            : null
                    }
                </View>



                {
                    problem.PRB_SECT === "LS" || problem.PRB_SECT === "RD"
                        ? <View>
                            {
                                problem.PRB_CHOICE1 in images.current
                                    ? <TouchableOpacity onPress={() => { setClick("1"); }} style={[styles.choiceImgConainer]}>
                                        <Image
                                            style={[styles.choiceImg, { borderColor: click === "1" ? "#BBD6B8" : "#D9D9D9" }]}
                                            source={{ uri: images.current[problem.PRB_CHOICE1].url }} />
                                    </TouchableOpacity>
                                    : <TouchableOpacity onPress={() => { setClick("1"); }} style={[styles.choiceButton, { backgroundColor: click === "1" ? "#BBD6B8" : "#D9D9D9" }]}>
                                        <Text>{problem.PRB_CHOICE1}</Text>
                                    </TouchableOpacity>
                            }
                            {
                                problem.PRB_CHOICE2 in images.current
                                    ? <TouchableOpacity onPress={() => { setClick("2"); }} style={[styles.choiceImgConainer]}>
                                        <Image
                                            style={[styles.choiceImg, { borderColor: click === "2" ? "#BBD6B8" : "#D9D9D9" }]}
                                            source={{ uri: images.current[problem.PRB_CHOICE2].url }} />
                                    </TouchableOpacity>
                                    : <TouchableOpacity onPress={() => { setClick("2"); }} style={[styles.choiceButton, { backgroundColor: click === "2" ? "#BBD6B8" : "#D9D9D9" }]}>
                                        <Text>{problem.PRB_CHOICE2}</Text>
                                    </TouchableOpacity>
                            }
                            {
                                problem.PRB_CHOICE3 in images.current
                                    ? <TouchableOpacity onPress={() => { setClick("3"); }} style={[styles.choiceImgConainer]}>
                                        <Image
                                            style={[styles.choiceImg, { borderColor: click === "3" ? "#BBD6B8" : "#D9D9D9" }]}
                                            source={{ uri: images.current[problem.PRB_CHOICE3].url }} />
                                    </TouchableOpacity>
                                    : <TouchableOpacity onPress={() => { setClick("3"); }} style={[styles.choiceButton, { backgroundColor: click === "3" ? "#BBD6B8" : "#D9D9D9" }]}>
                                        <Text>{problem.PRB_CHOICE3}</Text>
                                    </TouchableOpacity>
                            }
                            {
                                problem.PRB_CHOICE4 in images.current
                                    ? <TouchableOpacity onPress={() => { setClick("4"); }} style={[styles.choiceImgConainer]}>
                                        <Image
                                            style={[styles.choiceImg, { borderColor: click === "4" ? "#BBD6B8" : "#D9D9D9" }]}
                                            source={{ uri: images.current[problem.PRB_CHOICE4].url }} />
                                    </TouchableOpacity>
                                    : <TouchableOpacity onPress={() => { setClick("4"); }} style={[styles.choiceButton, { backgroundColor: click === "4" ? "#BBD6B8" : "#D9D9D9" }]}>
                                        <Text>{problem.PRB_CHOICE4}</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                        : <View>
                            {/* 쓰기 입력 칸 */}
                            {
                                problem.TAG === '001' || problem.TAG === '002' // 입력창이 두 개 필요함
                                    ? <View>
                                        <Text>㉠</Text>
                                        <TextInput
                                            onChangeText={(text) => { setClick(text) }}
                                            placeholder='Enter your answer here'
                                            value={click}
                                            style={styles.inputBox}
                                            multiline={true}
                                        />
                                        <Text>㉡</Text>
                                        <TextInput
                                            onChangeText={(text) => { setClick2(text) }}
                                            placeholder='Enter your answer here'
                                            value={click2}
                                            style={styles.inputBox}
                                            multiline={true}
                                        />
                                    </View>
                                    : <View>
                                        <TextInput
                                            onChangeText={(text) => { setClick(text) }}
                                            placeholder='Enter your answer here'
                                            value={click}
                                            style={styles.inputBox}
                                            multiline={true}
                                        />
                                    </View>
                            }
                        </View>
                }



                <View style={[styles.controlButttonContainer]}>

                    {/* 이전 버튼 */}
                    <TouchableOpacity
                        disabled={index === 0}
                        onPress={() => {
                            // {
                            //     audio !== undefined
                            //         ? audio.stop() & setPlaying(false)
                            //         : null
                            // }
                            setChoice(click);
                            setChoice2(click2);
                            setClick(undefined);
                            setClick2(undefined);
                            setDirection(1);
                            setIndex(index - 1);
                        }}
                        style={[styles.controlButton, { backgroundColor: index == 0 ? '#D9D9D9' : '#94AF9F' }]}>
                        <Text>PREV</Text>
                    </TouchableOpacity>


                    {/* 다음 버튼 */}
                    <TouchableOpacity
                        onPress={() => {
                            // {
                            //     audio !== undefined
                            //         ? audio.stop() & setPlaying(false)
                            //         : null
                            // }
                            setChoice(click);
                            setChoice2(click2);
                            setClick(undefined);
                            setClick2(undefined);
                            setDirection(-1);
                            setIndex(index + 1);
                        }}
                        style={[styles.controlButton, { backgroundColor: '#94AF9F' }]}>
                        <Text>
                            {
                                index === probListLength - 1
                                    ? "SUBMIT"
                                    : "NEXT"
                            }
                        </Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

    probMainContainer: {
        flexDirection: 'row'
    },


    // 나가기 버튼
    exitBtn: {
        width: 50,
        left: 300,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        backgroundColor: '#D9D9D9',
    },

    probMainCnt: {
        fontSize: 17,
    },


    // 지문 이미지
    mainImg: {
        height: 300,
        resizeMode: "contain",
    },


    // 사지선다 버튼
    choiceButton: {
        alignItems: "center",
        borderRadius: 10,
        padding: 16,
        marginVertical: 10,
    },


    // 이미지 사지선다
    choiceImgConainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    choiceImg: {
        width: 250,
        height: 250,
        resizeMode: "contain",
        borderWidth: 5,
    },


    // 쓰기 영역
    inputBox: {
        padding: 10,
        borderColor: '#C1C0B9',
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,

        flexShrink: 1,
    },


    // 전후 이동 버튼
    controlButttonContainer: {
        marginTop: 20,
        marginBottom: 100,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    controlButton: {
        alignItems: "center",
        borderRadius: 10,
        padding: 16,
        width: 100,
        height: 50,
        marginHorizontal: 10
    },


    // mp3 재생 컴포넌트
    btnBox:{
        backgroundColor: "#D9D9D9", 
        flexDirection: "row", 
        justifyContent: "center",

        alignItems: "center",

        paddingVertical: 30,
        paddingHorizontal: 20
    }, 

    btnPlay:{
        backgroundColor: "#94AF9F",
        
        borderRadius: 20,

        width: 80,
        height: 80,

        justifyContent: "center",

        alignItems: "center",
    },

    playlist: {
        flex: 5,
        backgroundColor: "white",

        borderRadius: 5,

        height: 10,

        marginLeft: 10
    },
})

export default MockProb;
