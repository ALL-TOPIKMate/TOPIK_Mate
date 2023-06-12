import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native'

const MockProbModal = ({ problem, index, setVisible, images, audios }) => {

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

        {/* ProbMain */}
        <View style={styles.probMainContainer}>
            <Text style={styles.probMainCnt}>Q{ problem[index].PRB_NUM } { problem[index].PRB_MAIN_CONT}</Text>
        </View>

        {/* 이미지 */}
        {
          problem[index].IMG_REF in images.current
          ? <Image
            style={styles.mainImg}
            source={{ uri: images.current[problem[index].IMG_REF].url }}
          />
          : null
        }

        {/* 문항, 지문 텍스트 */}
        {
          problem[index].PRB_TXT !== ''
          ? <Text style={{marginVertical: 16}}>{ problem[index].PRB_TXT }</Text>
          : null
        }
        {
          problem[index].PRB_SUB_CONT !== ''
          ? <Text style={{marginVertical: 16}}>{ problem[index].PRB_SUB_CONT }</Text> 
          : null
        }
        {
          problem[index].PRB_SCRPT !== ''
          ? <Text style={{marginVertical: 16}}>{ problem[index].PRB_SCRPT }</Text>
          : null
        }



        {
          problem[index].PRB_SECT === "LS" || problem[index].PRB_SECT === "RD"
          ? <View>
              {/* CHOICE1 */}
              {
                problem[index].PRB_CHOICE1 in images.current
                ? <TouchableOpacity disabled={true} style={[styles.choiceImgConainer]}>
                  <Image
                    style={[styles.choiceImg, 
                      {borderColor: problem[index].PRB_CORRT_ANSW === "1" 
                      ? "#BAD7E9" 
                      : (
                        problem[index].USER_CHOICE === "1"
                        ? "#FFACAC"
                        : "#D9D9D9"
                        )}]}
                    source={{uri: images.current[problem[index].PRB_CHOICE1].url}}
                  />
                </TouchableOpacity>
                : <TouchableOpacity disabled={true} style={[styles.choiceButton, 
                    {
                      backgroundColor: problem[index].PRB_CORRT_ANSW === "1" 
                      ? "#BAD7E9" 
                      : (
                        problem[index].USER_CHOICE === "1"
                        ? "#FFACAC"
                        : "#D9D9D9"
                        )
                    }]}>
                    <Text>{ problem[index].PRB_CHOICE1 }</Text>
                </TouchableOpacity>
              }

              {/* CHOICE2 */}
              {
                problem[index].PRB_CHOICE2 in images.current
                ? <TouchableOpacity disabled={true} style={[styles.choiceImgConainer]}>
                  <Image
                    style={[styles.choiceImg, 
                      {borderColor: problem[index].PRB_CORRT_ANSW === "2" 
                      ? "#BAD7E9" 
                      : (
                        problem[index].USER_CHOICE === "2"
                        ? "#FFACAC"
                        : "#D9D9D9"
                        )}]}
                    source={{uri: images.current[problem[index].PRB_CHOICE2].url}}
                  />
                </TouchableOpacity>
                : <TouchableOpacity disabled={true} style={[styles.choiceButton, 
                    {
                      backgroundColor: problem[index].PRB_CORRT_ANSW === "2" 
                      ? "#BAD7E9" 
                      : (
                        problem[index].USER_CHOICE === "2"
                        ? "#FFACAC"
                        : "#D9D9D9"
                        )
                    }]}>
                    <Text>{ problem[index].PRB_CHOICE2 }</Text>
                </TouchableOpacity>
              }

              {/* CHOICE3 */}
              {
                problem[index].PRB_CHOICE3 in images.current
                ? <TouchableOpacity disabled={true} style={[styles.choiceImgConainer]}>
                  <Image
                    style={[styles.choiceImg, 
                      {borderColor: problem[index].PRB_CORRT_ANSW === "3" 
                      ? "#BAD7E9" 
                      : (
                        problem[index].USER_CHOICE === "3"
                        ? "#FFACAC"
                        : "#D9D9D9"
                        )}]}
                    source={{uri: images.current[problem[index].PRB_CHOICE3].url}}
                  />
                </TouchableOpacity>
                : <TouchableOpacity disabled={true} style={[styles.choiceButton, 
                    {
                      backgroundColor: problem[index].PRB_CORRT_ANSW === "3" 
                      ? "#BAD7E9" 
                      : (
                        problem[index].USER_CHOICE === "3"
                        ? "#FFACAC"
                        : "#D9D9D9"
                      )
                    }]}>
                    <Text>{ problem[index].PRB_CHOICE3 }</Text>
                </TouchableOpacity>
              }

              {/* CHOICE4 */}
              {
                problem[index].PRB_CHOICE4 in images.current
                ? <TouchableOpacity disabled={true} style={[styles.choiceImgConainer]}>
                  <Image
                    style={[styles.choiceImg, 
                      {borderColor: problem[index].PRB_CORRT_ANSW === "4" 
                      ? "#BAD7E9" 
                      : (
                        problem[index].USER_CHOICE === "4"
                        ? "#FFACAC"
                        : "#D9D9D9"
                        )}]}
                    source={{uri: images.current[problem[index].PRB_CHOICE4].url}}
                  />
                </TouchableOpacity>
                : <TouchableOpacity disabled={true} style={[styles.choiceButton, 
                    {
                      backgroundColor: problem[index].PRB_CORRT_ANSW === "4" 
                      ? "#BAD7E9" 
                      : (
                        problem[index].USER_CHOICE === "4"
                        ? "#FFACAC"
                        : "#D9D9D9"
                        )
                    }]}>
                    <Text>{ problem[index].PRB_CHOICE4 }</Text>
                </TouchableOpacity>
              }
              </View>
          : null
        }

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

    probMainContainer: {
        flexDirection: 'row'
    },

    probMainCnt: {
        fontSize: 17,
    },

    mainImg: {
      height: 300,
      resizeMode: "contain",
    },

    choiceButton: {
      alignItems: "center",
      borderRadius: 10,
      padding: 16,
      marginVertical: 10,
    },

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
})

export default MockProbModal;
