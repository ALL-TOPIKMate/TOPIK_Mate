import React from 'react';
import { StyleSheet, Modal, ScrollView, Image, View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import RenderHTML from "react-native-render-html";

import { splitProblemAnswer } from '../../lib/utils';
import ProbMain from './ProbMain';
import ImgRef from './ImgRef';
import ProbTxt from './ProbTxt';


function ViewBox({text, width}){
    if(width != undefined){
        return (
            <View style = {styles.viewBox}>
                <RenderHTML
                    source = {text}
                    contentWidth={width}
                />
            </View>
        )
    }else{
        return (
            <View style = {styles.viewBox}>
                <Text>
                    {text}
                </Text>
            </View>
        )
    }
    
}

const MockProbWriteModal = ({ problem, index, setVisible, images }) => {

    const {width} = useWindowDimensions() // window's width


    // html code
    const source = {
        html: `
            <p style = "
                padding: 0px;
                margin: 0px;
                font-size: 15px;
                // color: #000000;
            ">
            ${problem[index].ERROR_CONT} 
            </p>
        `
    }

    const source2 = {
        html: `
            <p style = "
                padding: 0px;
                margin: 0px;
                font-size: 15px;
                // color: #000000;
            ">
            ${problem[index].ERROR_CONT2} 
            </p>
        `
    }

    

    return (
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={true}
            onRequestClose={() => {
                setVisible(false)
                // console.log("modal appearance")
            }
        }>
            <ScrollView style={styles.container}>

                {/*  문제 영역 */}
                <View>

                    {/* ProbMain */}
                    <ProbMain PRB_NUM = {problem[index].PRB_NUM} PRB_MAIN_CONT = {problem[index].PRB_MAIN_CONT}/>

                    {/* 이미지 */}
                    {
                    problem[index].IMG_REF in images.current
                    ? <ImgRef IMG_REF = {images.current[problem[index].IMG_REF].url}/>
                    : null
                    }

                    {/* 문항, 지문 텍스트 */}
                    {
                    problem[index].PRB_TXT !== ''
                    ? <ProbTxt PRB_TXT = {problem[index].PRB_TXT} />
                    : null
                    }

                </View>


                {/* 문제 풀이 영역 */}
                {
                    problem[index].TAG === '001' || problem[index].TAG === '002'
                    ? <View>
                        <View>
                            <Text style = {styles.text}>㉠</Text>
                            <Text style = {styles.text}>Your answer</Text>
                            <ViewBox text = {problem[index].PRB_USER_ANSW} />

                            <Text style = {styles.text}>Best answer</Text>
                            <ViewBox text = {splitProblemAnswer(problem[index].PRB_CORRT_ANSW).text1} />

                            <View style = {styles.alignRow}>
                                <Text style = {[styles.textLeft, styles.text]}>Result</Text>
                                <Text style = {[styles.textRight, styles.text]}>Score: {problem[index].SCORE} / 5</Text>
                            </View>
                            
                            <ViewBox text = {source} width = {width}/>
                            
                        </View>

                        <Text />

                        <View>
                            <Text style = {styles.text}>㉡</Text>
                            <Text style = {styles.text}>Your answer</Text>
                            <ViewBox text = {problem[index].PRB_USER_ANSW2} />


                            <Text style = {styles.text}>Best answer</Text>
                            <ViewBox text = {splitProblemAnswer(problem[index].PRB_CORRT_ANSW).text2} />


                            <View style = {styles.alignRow}>
                                <Text style = {[styles.textLeft, styles.text]}>Result</Text>
                                <Text style = {[styles.textRight, styles.text]}>Score: {problem[index].SCORE2} / 5</Text>
                            </View>
                            
                            <ViewBox text = {source2} width = {width}/>

                        </View>
                    </View>
                    : <View>
                        <Text style = {styles.text}>Your answer</Text>
                        <ViewBox text = {problem[index].PRB_USER_ANSW} />

                        <Text style = {styles.text}>Best answer</Text>
                        <ViewBox text = {problem[index].PRB_CORRT_ANSW} />


                        <View style = {styles.alignRow}>
                            <Text style = {[styles.textLeft, styles.text]}>Result</Text>
                            <Text style = {[styles.textRight, styles.text]}>Score: {problem[index].SCORE} / {problem[index].PRB_POINT}</Text>
                        </View>
                        
                        <ViewBox text = {source} width = {width} />

                    </View>
                }
                <View>
                </View>


                {/* 하단 버튼 영역 */}
                <View style = {styles.controlButttonContainer}>
                    <TouchableOpacity 
                        onPress = {() => {setVisible(false)}} 
                        style = {[styles.controlButton, 
                        {
                            backgroundColor: '#94AF9F',
                            width: 200
                        }]}>
                        <Text>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </Modal>
    );

};

const styles = StyleSheet.create({
    container:{
        padding: 20,
    },

    viewBox: {
        backgroundColor: "#D9D9D9",
        padding: 10,
        minHeight: 128,

        borderWidth: 1,
        borderColor: "black",
        flexShrink: 1,
        marginVertical: 14
    },

    infoImg: {
        flex: 2,
        width: '100%',
        resizeMode: 'contain',
    },

    controlButttonContainer: {
        marginTop: 50,
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

export default MockProbWriteModal;
