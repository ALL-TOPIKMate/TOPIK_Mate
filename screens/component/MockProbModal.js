import React from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native'

const MockProbModal = ({ problem, modal, setModal }) => {
  
  console.log(`problem: ${problem}`);

  return (    
    <Modal
      animationType={"slide"}
      transparent={false}
      visible={modal.open}
      onRequestClose={() => {
          setModal({open: false})
          console.log("modal appearance")
      }}>
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
              <TouchableOpacity disabled={true} style={[styles.choiceButton, {backgroundColor: problem.USER_CHOICE === "1" ? "#BBD6B8" : "#D9D9D9"}]}>
                <Text>{ problem.PRB_CHOICE1 }</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={true} style={[styles.choiceButton, {backgroundColor: problem.USER_CHOICE === "2" ? "#BBD6B8" : "#D9D9D9"}]}>
                <Text>{ problem.PRB_CHOICE2 }</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={true} style={[styles.choiceButton, {backgroundColor: problem.USER_CHOICE === "3" ? "#BBD6B8" : "#D9D9D9"}]}>
                <Text>{ problem.PRB_CHOICE3 }</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={true} style={[styles.choiceButton, {backgroundColor: problem.USER_CHOICE === "4" ? "#BBD6B8" : "#D9D9D9"}]}> 
                <Text>{ problem.PRB_CHOICE4 }</Text>
              </TouchableOpacity>
          </View>
          : <View>
            <Text>{ problem.PRB_NUM }</Text>
            <Text>점수가 여기 표시됩니다.</Text>
            <Text>{ problem.USER_CHOICE }</Text>
            <Text>{ problem.PRB_CORRT_ANSW }</Text>
          </View>
        }

        <View style = {styles.probMain}>
          <Button onPress = {() => {setModal({open: false})}} title={"CLOSE"} />
        </View>

      </View>
    </Modal>
  );

};

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

export default MockProbModal;
