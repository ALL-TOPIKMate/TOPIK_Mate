import React, { useState } from 'react';
import { View, Text, Image, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native'

const MockProbModal = ({ problem, index, setVisible, images, audios }) => {

  

  return (    
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={true}
        onRequestClose={() => {
            setVisible(false)
            console.log("modal appearance")
      }}>
      <View style={styles.container}>

        {/* ProbMain */}
        <View style={styles.probMain}>
            <Text style={styles.probMainCnt}>Q{ problem[index].PRB_NUM } { problem[index].PRB_MAIN_CONT}</Text>
        </View>

        {/* 이미지 */}
        {
          problem[index].IMG_REF in images
          ? <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: images[problem[index].IMG_REF].url }}
          />
          : null
        }

        <Text>{ problem[index].PRB_TXT }</Text>
        <Text>{ problem[index].PRB_SUB_CONT }</Text>

        {
          problem[index].PRB_SECT === "LS" || problem[index].PRB_SECT === "RD"
          ? <View>
              {
                problem[index].PRB_CHOICE1 in images
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
                    source={{uri: images[problem[index].PRB_CHOICE1].url}}
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
              <TouchableOpacity disabled={true} style={[styles.choiceButton, 
                {
                  backgroundColor: problem[index].PRB_CORRT_ANSW === "2" 
                  ? "#BAD7E9" 
                  : (
                    problem.USER_CHOICE === "2"
                    ? "#FFACAC"
                    : "#D9D9D9"
                    )
                }]}>
              {
                problem[index].PRB_CHOICE2 in images
                ? <Image
                  style={{width: 50, height: 50}}
                  source={{uri: images[problem[index].PRB_CHOICE2].url}}
                />
                : <Text>{ problem[index].PRB_CHOICE2 }</Text>
              }
              </TouchableOpacity>
              <TouchableOpacity disabled={true} style={[styles.choiceButton, {
                  backgroundColor: problem[index].PRB_CORRT_ANSW === "3" 
                  ? "#BAD7E9" 
                  : (
                    problem[index].USER_CHOICE === "3"
                    ? "#FFACAC"
                    : "#D9D9D9"
                    )
                }]}>
              {
                problem[index].PRB_CHOICE3 in images
                ? <Image
                  style={{width: 50, height: 50}}
                  source={{uri: images[problem[index].PRB_CHOICE3].url}}
                />
                : <Text>{ problem[index].PRB_CHOICE3 }</Text>
              }
              </TouchableOpacity>
              <TouchableOpacity disabled={true} style={[styles.choiceButton, {
                  backgroundColor: problem[index].PRB_CORRT_ANSW === "4" 
                  ? "#BAD7E9" 
                  : (
                    problem[index].USER_CHOICE === "4"
                    ? "#FFACAC"
                    : "#D9D9D9"
                    )
                }]}> 
              {
                problem[index].PRB_CHOICE4 in images
                ? <Image
                  style={{width: 50, height: 50}}
                  source={{uri: images[problem[index].PRB_CHOICE4].url}}
                />
                : <Text>{ problem[index].PRB_CHOICE4 }</Text>
              }
              </TouchableOpacity>
          </View>
          : <View>
            <Text>{ problem[index].PRB_NUM }</Text>
            <Text>점수가 여기 표시됩니다.</Text>
            <Text>{ problem[index].USER_CHOICE }</Text>
            <Text>{ problem[index].PRB_CORRT_ANSW }</Text>
          </View>
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
      </View>
    </Modal>
  );

};

const styles = StyleSheet.create({
    
    container:{
        padding: 20,
    },

    containerPos: {
        flex: 20
    },

    probMainCnt: {
        fontSize: 17,
    },

    controlButtonprobMain: {
        flexDirection: 'row'
    },
    choiceButton: {
      alignItems: "center",
      borderRadius: 10,
      padding: 16
    },


    probMainContainer: {
        flexDirection: 'row'
    },

    selectSection: {
        flex: 1,
        justifyContent: 'space-between'
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
        width: 100,
        height: 100,
        borderStyle: 'solid',
        borderWidth: 5,
    },


    controlButttonContainer: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    controlButton: {
        alignItems: "center",
        borderRadius: 10,
        padding: 16,
        width: 100, 
        marginHorizontal: 10
    },
})

export default MockProbModal;
