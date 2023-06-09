import React, { useState, useEffect } from 'react'
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, ViewBase } from 'react-native';

import Sound from 'react-native-sound';

Sound.setCategory('Playback');


const MockProb = ({ problem, choice, setChoice, index, setIndex, probListLength, setDirection, images, audios }) => {
  
    // 사용자 선택 저장
    const [click, setClick] = useState(choice);
      
    useEffect(() => {
      setClick(choice);
    }, [choice]);
    

    // 오디오 파일이 있으면 download URL 가져오기
    let audioRef = undefined;
    if (problem.AUD_REF in audios.current) {
      audioRef = audios.current[problem.AUD_REF].url;
    }

    // 로컬적으로 사용될 오디오 state
    const [audio, setAudio] = useState(undefined);


    useEffect(() => {
      if (audioRef === undefined) {
        setAudio(undefined);
      } else {
        // 오디오 URL이 있으면 새로운 Sound 객체 생성. -> 로컬적으로 사용
        setAudio(new Sound(audios.current[problem.AUD_REF].url, null, err => {
      
          if (err) {
            console.log('Failed to load the sound', err);
            return undefined;
          }
          
          // 로드 성공
          console.log(`오디오 로드 성공. ${problem.AUD_REF}`);
          
        }));
      }
    }, [audioRef]);


    // 오디오 재생 상태 state
    const [playing, setPlaying] = useState(false);
    
    
    // 오디오 재생 제어
    const playPause = (audio) => {
      if (audio !== undefined) {

        if (audio.isPlaying()) {
          // 재생 중 -> 일시 정지
          audio.pause();
          setPlaying(false);

        } else {
          // 일시 정지 -> 재생
          setPlaying(true);

          audio.play(success => {
            if (success) {
              setPlaying(false);
              console.log('successfully finished playing');
            } else {
              setPlaying(false);
              console.log('playback failed due to audio decoding errors');
            }
          });

        }
      }
    };


    // 언마운트 시 자원 삭제
    useEffect(() => {
      return () => {
        if (audio !== undefined) {
          audio.release();
        }
      };
    }, []);
    

    return (
      <ScrollView>
          <View>
            {/* 오디오 */}
            {
              problem.AUD_REF in audios.current
              ? <TouchableOpacity onPress={() => playPause(audio)}>
                <Text>
                  {
                    playing
                    ? '멈추기'
                    : '재생하기'
                  }
                </Text>
              </TouchableOpacity>
              : null
            }

            {/* ProbMain */}
            <View style={styles.probMainContainer}>
                <Text style={styles.probMainCnt}>Q{ problem.PRB_NUM } { problem.PRB_MAIN_CONT} </Text>
            </View>

            
            {/* 이미지 */}
            {
              problem.IMG_REF in images.current
              ? <View style={{alignContent: 'center'}}> 
                <Image 
                  style={styles.mainImg}
                  source={{ uri: images.current[problem.IMG_REF].url }}
                />
              </View>
              : null
            }

            {/* 문항, 지문 텍스트 */}
            {
              problem.PRB_TXT !== ''
              ? <Text style={{marginVertical: 16}}>{ problem.PRB_TXT }</Text>
              : null
            }
            {
              problem.PRB_SUB_CONT !== ''
              ? <Text style={{marginVertical: 16}}>{ problem.PRB_SUB_CONT }</Text> 
              : null
            }
            {
              problem.PRB_SCRPT !== ''
              ? <Text style={{marginVertical: 16}}>{ problem.PRB_SCRPT }</Text>
              : null
            }
          
          
          </View>



          <View>
            {
                problem.PRB_SECT === "LS" || problem.PRB_SECT === "RD"
                ? <View>
                    {
                      problem.PRB_CHOICE1 in images.current
                      ? <TouchableOpacity onPress = {() => {setClick("1");}} style={[styles.choiceImgConainer]}>
                        <Image
                          style={[styles.choiceImg, {borderColor: click === "1" ? "#BBD6B8" : "#D9D9D9"}]}
                          source={{uri: images.current[problem.PRB_CHOICE1].url}} />
                      </TouchableOpacity>
                      : <TouchableOpacity onPress = {() => {setClick("1");}} style={[styles.choiceButton, {backgroundColor: click === "1" ? "#BBD6B8" : "#D9D9D9"}]}>
                        <Text>{ problem.PRB_CHOICE1 }</Text>
                      </TouchableOpacity>
                    }
                    {
                      problem.PRB_CHOICE2 in images.current
                      ? <TouchableOpacity onPress = {() => {setClick("2");}} style={[styles.choiceImgConainer]}>
                        <Image
                          style={[styles.choiceImg, {borderColor: click === "2" ? "#BBD6B8" : "#D9D9D9"}]}
                          source={{uri: images.current[problem.PRB_CHOICE2].url}} />
                      </TouchableOpacity>
                      : <TouchableOpacity onPress = {() => {setClick("2");}} style={[styles.choiceButton, {backgroundColor: click === "2" ? "#BBD6B8" : "#D9D9D9"}]}>
                        <Text>{ problem.PRB_CHOICE2 }</Text>
                      </TouchableOpacity>
                    }
                    {
                      problem.PRB_CHOICE3 in images.current
                      ? <TouchableOpacity onPress = {() => {setClick("3");}} style={[styles.choiceImgConainer]}>
                        <Image
                          style={[styles.choiceImg, {borderColor: click === "3" ? "#BBD6B8" : "#D9D9D9"}]}
                          source={{uri: images.current[problem.PRB_CHOICE3].url}} />
                      </TouchableOpacity>
                      : <TouchableOpacity onPress = {() => {setClick("3");}} style={[styles.choiceButton, {backgroundColor: click === "3" ? "#BBD6B8" : "#D9D9D9"}]}>
                        <Text>{ problem.PRB_CHOICE3 }</Text>
                      </TouchableOpacity>
                    }
                    {
                      problem.PRB_CHOICE4 in images.current
                      ? <TouchableOpacity onPress = {() => {setClick("4");}} style={[styles.choiceImgConainer]}>
                        <Image
                          style={[styles.choiceImg, {borderColor: click === "4" ? "#BBD6B8" : "#D9D9D9"}]}
                          source={{uri: images.current[problem.PRB_CHOICE4].url}} />
                      </TouchableOpacity>
                      : <TouchableOpacity onPress = {() => {setClick("4");}} style={[styles.choiceButton, {backgroundColor: click === "4" ? "#BBD6B8" : "#D9D9D9"}]}>
                        <Text>{ problem.PRB_CHOICE4 }</Text>
                      </TouchableOpacity>
                    }
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
          </View>

          <View style = {[styles.controlButttonContainer]}>
            <TouchableOpacity 
              disabled = {index === 0} 
              onPress = {() => {
                {
                  audio !== undefined
                  ? audio.stop() & setPlaying(false)
                  : null
                }
                setChoice(click); 
                setClick(undefined); 
                setDirection(1); 
                setIndex(index - 1); }} 
              style={[styles.controlButton, {backgroundColor: index == 0 ? '#D9D9D9' : '#94AF9F'}]}>
              <Text>PREV</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress = {() => {
                {
                  audio !== undefined
                  ? audio.stop() & setPlaying(false)
                  : null
                }
                setChoice(click); 
                setClick(undefined); 
                setDirection(-1); 
                setIndex(index + 1); }} 
              style={[styles.controlButton, {backgroundColor: '#94AF9F'}]}>
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
    )
}

const styles = StyleSheet.create({
    
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
        width: 250,
        height: 250,
        resizeMode: "contain",
        borderStyle: 'solid',
        borderWidth: 5,
    },


    controlButttonContainer: {
        marginTop: 20,
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
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

export default MockProb;
