import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import filebase from '@react-native-firebase/app';

import AudRef from './AudRef';

const MockProb = ({ problem, choice, setChoice, index, setIndex, setDirection }) => {

    // 사용자 선택 저장
    const [click, setClick] = useState(choice);
    
    useEffect(() => {
      setClick(choice);
    }, [choice]);


    // GET 멀티미디어 파일 URL
    const [audRef, setAudRef] = useState(problem.AUD_REF); // 듣기 오디오 파일 URL
    const [imgRef, setImgRef] = useState(problem.IMG_REF); // 지문에 들어가는 이미지 파일 URL

    const [choice1, setChoice1] = useState(problem.PRB_CHOICE1); // 선택지 이미지 파일 URL
    const [choice2, setChoice2] = useState(problem.PRB_CHOICE2);
    const [choice3, setChoice3] = useState(problem.PRB_CHOICE3);
    const [choice4, setChoice4] = useState(problem.PRB_CHOICE4);


    // 멀티미디어 로드 useEffect
    useEffect(() => {
      getAudioUrl(audRef);
      getImageUrl(imgRef);
      getChoiceImageUrls([choice1, choice2, choice3, choice4])
    }, []);


    const getAudioUrl = async () => {
      try {       
        // const fileName = ref;
        // const fileExtension = ref.split(".")[1];

        // console.log(fileName, fileExtension);

        const url = await filebase.storage().ref(`audios/${audRef}`).getDownloadURL();
        console.log(`[${problem.PRB_ID}] ==> audio url: ${url}`);
        setAudRef(url);

      } catch (error) {
        // console.log(error)
        setAudRef('');
      }
    }

    const getImageUrl = async () => {
      try {       
        
        const url = await filebase.storage().ref(`images/${imgRef}`).getDownloadURL();
        console.log(`[${problem.PRB_ID}] ==> image url: ${url}`);
        setImgRef(url);

      } catch (error) {
        // console.log(error)
        setImgRef('');
      }
    }

    const getChoiceImageUrls = async (refs) => {
      try {       

        let url = await filebase.storage().ref(`images/${refs[0]}`).getDownloadURL();
        console.log(`[${problem.PRB_ID}] ==> choice1 url: ${url}`);
        setChoice1(url);
        
        url = await filebase.storage().ref(`images/${refs[1]}`).getDownloadURL();
        console.log(`[${problem.PRB_ID}] ==> choice2 url: ${url}`);
        setChoice2(url);

        url = await filebase.storage().ref(`images/${refs[2]}`).getDownloadURL();
        console.log(`[${problem.PRB_ID}] ==> choice3 url: ${url}`);
        setChoice3(url);

        url = await filebase.storage().ref(`images/${refs[3]}`).getDownloadURL();
        console.log(`[${problem.PRB_ID}] ==> choice4 url: ${url}`);
        setChoice4(url);

      } catch (error) {
        // console.log(error)
        setChoice1('');
        setChoice2('');
        setChoice3('');
        setChoice4('');
      }
    }

    // 멀티미디어 로드
    const loadFileFromFirebase = async (ref) => {
      try {       
        const fileName = ref;
        const fileExtension = ref.split(".")[1];

        console.log(fileName, fileExtension);

        if (fileExtension === 'png' || fileExtension === 'jpg') {
          const url = await filebase.storage().ref(`images/${fileName}`).getDownloadURL();
          console.log(`url: ${url}`);
        } else if (fileExtension === 'mp3') {
          const url = await filebase.storage().ref(`audios/${fileName}`).getDownloadURL();
          console.log(`url: ${url}`);
        }

        // setImageUrl(url);
      } catch (error) {
        // setImageUrl(defaultImageUrl);
        console.log(error)
      }
    };


    return (
        <View>
            {/* 오디오 */}
            {
              audRef !== ''
              ? <AudRef
                audRef={audRef}
              />
              : null
            }

            {/* ProbMain */}
            <View style={styles.probMain}>
                <Text>{ problem.PRB_NUM }</Text>
                <Text>{ problem.PRB_MAIN_CONT}</Text>
            </View>

            
            {/* 이미지 */}
            {
              imgRef !== ''
              ? <Image
                style={{
                  width: 132,
                  height: 132,
                  borderRadius: 100,
                  overflow: 'hidden',
                  borderWidth: 3,
                  borderColor: 'blue',
                }}
                source={imgRef}
              />
              : null
            }


            <Text>{ problem.PRB_TXT }</Text>
            <Text>{ problem.PRB_SUB_CONT }</Text> 
            <Text>{ problem.PRB_SCRPT }</Text>

            {
                problem.PRB_SECT === "듣기" || problem.PRB_SECT === "읽기"
                ? <View>
                    <TouchableOpacity onPress = {() => {setClick("1");}} style={[styles.choiceButton, {backgroundColor: click === "1" ? "#BBD6B8" : "#D9D9D9"}]}>
                      {
                        choice1 !== ''
                        ? <Image
                          style={{
                            width: 132,
                            height: 132,
                            borderRadius: 100,
                            overflow: 'hidden',
                            borderWidth: 3,
                            borderColor: 'blue',
                          }}
                          source={choice1}
                        />
                        : <Text>{ problem.PRB_CHOICE1 }</Text>
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {setClick("2");}} style={[styles.choiceButton, {backgroundColor: click === "2" ? "#BBD6B8" : "#D9D9D9"}]}>
                    {
                        choice2 !== ''
                        ? <Image
                          style={{
                            width: 132,
                            height: 132,
                            borderRadius: 100,
                            overflow: 'hidden',
                            borderWidth: 3,
                            borderColor: 'blue',
                          }}
                          source={choice2}
                        />
                        : <Text>{ problem.PRB_CHOICE1 }</Text>
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {setClick("3");}} style={[styles.choiceButton, {backgroundColor: click === "3" ? "#BBD6B8" : "#D9D9D9"}]}>
                      <Text>{ problem.PRB_CHOICE3 }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {setClick("4");}} style={[styles.choiceButton, {backgroundColor: click === "4" ? "#BBD6B8" : "#D9D9D9"}]}> 
                      <Text>{ problem.PRB_CHOICE4 }</Text>
                    </TouchableOpacity>
                </View>
                : <View>
                  {/* 쓰기 입력 칸 */}
                  <TextInput 
                    onChangeText = {(text) => {setClick(text)}}
                    placeholder='Enter your answer here'
                    value={click}
                  />
                </View>
            }

            <View style = {styles.probMain}>
              <Button disabled={index === 0} onPress = {() => {setChoice(click); setClick(undefined); setDirection(1); setIndex(index - 1); }} title={"PREV"} />
              <Button onPress = {() => {setChoice(click); setClick(undefined); setDirection(-1); setIndex(index + 1); }} title={"NEXT"} />
            </View>
        </View>
    )
}

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

export default MockProb;
