import React from 'react';
import { StyleSheet, Modal, ScrollView, Image, View, Text, TouchableOpacity } from 'react-native';
import ProbMain from './ProbMain';
import ImgRef from './ImgRef';
import ProbTxt from './ProbTxt';

const MockProbWriteModal = ({ problem, index, setVisible, images }) => {
    
    return (
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={true}
            onRequestClose={() => {
                setVisible(false)
                console.log("modal appearance")
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
                            <Text>㉠</Text>
                            <Text>Your answer</Text>
                            <Text style={styles.inputBox}>{ problem[index].PRB_USER_ANSW }</Text>

                            <Text>Best answer</Text>
                            <Text style={styles.inputBox}>{ problem[index].PRB_CORRT_ANSW }</Text>


                            <Text>Result</Text>
                            {/* 임시 이미지. 채점 모델 개발 후 채점 결과 불러와서 표현할 예정 */}
                            <View style={styles.infoSection}>
                                <Image
                                    style={styles.infoImg}
                                    source={require('../../assets/topik-guide.webp')}
                                />
                            </View>
                        </View>

                        <View>
                            <Text>㉡</Text>
                            <Text>Your answer</Text>
                            <Text style={styles.inputBox}>{ problem[index].PRB_USER_ANSW2 }</Text>

                            <Text>Best answer</Text>
                            <Text style={styles.inputBox}>{ problem[index].PRB_CORRT_ANSW }</Text>


                            <Text>Result</Text>
                            {/* 임시 이미지. 채점 모델 개발 후 채점 결과 불러와서 표현할 예정 */}
                            <View style={styles.infoSection}>
                                <Image
                                    style={styles.infoImg}
                                    source={require('../../assets/topik-guide.webp')}
                                />
                            </View>
                        </View>
                    </View>
                    : <View>
                        <Text>Your answer</Text>
                        <Text style={styles.inputBox}>{ problem[index].PRB_USER_ANSW }</Text>

                        <Text>Best answer</Text>
                        <Text style={styles.inputBox}>{ problem[index].PRB_CORRT_ANSW }</Text>


                        <Text>Result</Text>
                        {/* 임시 이미지. 채점 모델 개발 후 채점 결과 불러와서 표현할 예정 */}
                        <View style={styles.infoSection}>
                            <Image
                                style={styles.infoImg}
                                source={require('../../assets/topik-guide.webp')}
                            />
                        </View>
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

    inputBox: {
        padding: 10,
        borderColor: '#C1C0B9',
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
  
        flexShrink: 1,
    },

    infoImg: {
        flex: 2,
        width: '100%',
        resizeMode: 'contain',
    },

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
});

export default MockProbWriteModal;
