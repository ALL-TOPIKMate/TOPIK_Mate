import React from 'react';
import {Text,View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
const Inquiry = () => {
  const [value, onChangeText] = React.useState();
  const handleButtonPress = () => {
    console.log(value); // 전체 내용 출력
  };
    return (
      <View>
        <Text>문의하기</Text>
        <View style={styles.inquiryText}>
          <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={text => onChangeText(text)}
          value={value}
          style={{padding: 10}}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>보내기</Text>
        </TouchableOpacity>
        <Text style={styles.ps}>   추가 문의는 users@topikmate.com으로 주세요.</Text>
      </View>
    );
  };
  const styles = StyleSheet.create({
    inquiryText:{
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 1,
        position: 'absolute',
        top: 30,
        left: 10,
        width: 370,
        height: 200,
    },
    button:{
      alignItems:'center',
      backgroundColor: "#669900",
      padding: 10,
      top: 250,
      width: 100,
      alignSelf: 'center',
    },
    buttonText:{
      color: '#FFFFFF',
    },
    ps:{
      top: 180,
    },
  });
export default Inquiry;