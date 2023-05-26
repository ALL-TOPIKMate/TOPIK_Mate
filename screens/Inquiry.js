import React,{useState} from 'react';
import {Text,View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Inquiry = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [items, setItems] = useState([
    { label: '개선 사항', value: '개선 사항' },
    { label: '기능 추가 요청', value: '기능 추가 요청' },
    { label: '버그 신고', value: '버그 신고' },
    { label: '계정 관련', value: '계정 관련' },
    { label: '광고 제의', value: '광고 제의' },
    { label: '기타 피드백', value: '기타 피드백' },
  ]);

  const [textInputValue, setTextInputValue] = useState('');

  const handleButtonPress = () => {
    console.log(value, textInputValue); // 선택한 값과 TextInput의 내용 출력
  };
  const isButtonDisabled = value === null || textInputValue.trim() === ''; // 버튼 비활성화 조건
  return (
    <View>
      <Text>문의하기</Text>
      <DropDownPicker style = {styles.category}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="카테고리 선택"
            listMode="FLATLIST"
            modalProps={{
            animationType: 'fade',
            }}
            modalTitle="카테고리 선택"
      />
      <View style={styles.inquiryText}>
        <TextInput
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        onChangeText={text => setTextInputValue(text)}
        value={textInputValue}
        style={{padding: 10}}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.disabledButton]} // 버튼 스타일 조건부 적용
        onPress={handleButtonPress}
        disabled={isButtonDisabled} // 버튼 비활성화 설정
      >
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
      top: 100,
      left: 10,
      width: 370,
      height: 200,
  },
  button:{
    alignItems:'center',
    backgroundColor: "#669900",
    padding: 10,
    top: 280,
    width: 100,
    alignSelf: 'center',
  },
  disabledButton: {
    opacity: 0.5, // 비활성화된 버튼 스타일
  },
  buttonText:{
    color: '#FFFFFF',
  },
  ps:{
    top: 200,
  },
  category:{
    top: 15,
    width: 350,
    alignSelf: 'center',
  }
});
export default Inquiry;