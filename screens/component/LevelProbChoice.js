import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'

export default LevelProbChoice = ({ PRB_CHOICE1, PRB_CHOICE2, PRB_CHOICE3, PRB_CHOICE4, images, setIndex, size, userData }) => {

    // 유저가 누르는 버튼 
    const [click, setClick] = useState(0);

    // 4지선다 이미지 여부
    const isImage = images[PRB_CHOICE1]


    function nextButtonHandler(){
        // 유저 답안 기록
        userData.PRB_USER_ANSW = click

        setIndex(currentIndex => currentIndex+1)
    }



    return (
        <View>
            <Text /><Text />

            {
                isImage && (
                    <View>
                        <TouchableOpacity onPress={() => { setClick(1) }} style={[styles.imageButton, { borderColor: click == 1 ? "#BBD6B8" : "#D9D9D9" }]}>
                            <Image
                                style={{ height: 200 }}
                                resizeMode="stretch"
                                source={{ uri: images[PRB_CHOICE1] }}
                            />
                        </TouchableOpacity>
                        <Text />
                        <TouchableOpacity onPress={() => { setClick(2) }} style={[styles.imageButton, { borderColor: click == 2 ? "#BBD6B8" : "#D9D9D9" }]}>
                            <Image
                                style={{ height: 200 }}
                                resizeMode="stretch"
                                source={{ uri: images[PRB_CHOICE2] }}
                            />
                        </TouchableOpacity>
                        <Text />
                        <TouchableOpacity onPress={() => { setClick(3) }} style={[styles.imageButton, { borderColor: click == 3 ? "#BBD6B8" : "#D9D9D9" }]}>
                            <Image
                                style={{ height: 200 }}
                                resizeMode="stretch"
                                source={{ uri: images[PRB_CHOICE3] }}
                            />
                        </TouchableOpacity>
                        <Text />
                        <TouchableOpacity onPress={() => { setClick(4) }} style={[styles.imageButton, { borderColor: click == 4 ? "#BBD6B8" : "#D9D9D9" }]}>
                            <Image
                                style={{ height: 200 }}
                                resizeMode="stretch"
                                source={{ uri: images[PRB_CHOICE4] }}
                            />
                        </TouchableOpacity>
                    </View>
                )
            }

            {
                !isImage && (
                    <View>
                        <TouchableOpacity onPress={() => { setClick(1) }} style={[styles.button, { backgroundColor: click == 1 ? "#BBD6B8" : "#D9D9D9" }]}>
                            <Text>
                                {PRB_CHOICE1}
                            </Text>
                        </TouchableOpacity>
                        <Text />
                        <TouchableOpacity onPress={() => { setClick(2) }} style={[styles.button, { backgroundColor: click == 2 ? "#BBD6B8" : "#D9D9D9" }]}>
                            <Text>
                                {PRB_CHOICE2}
                            </Text>
                        </TouchableOpacity>
                        <Text />
                        <TouchableOpacity onPress={() => { setClick(3) }} style={[styles.button, { backgroundColor: click == 3 ? "#BBD6B8" : "#D9D9D9" }]}>
                            <Text>
                                {PRB_CHOICE3}
                            </Text>
                        </TouchableOpacity>
                        <Text />
                        <TouchableOpacity onPress={() => { setClick(4) }} style={[styles.button, { backgroundColor: click == 4 ? "#BBD6B8" : "#D9D9D9" }]}>
                            <Text>
                                {PRB_CHOICE4}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )

            }

            <Text /><Text />

            <TouchableOpacity onPress = {() => nextButtonHandler() } disabled = {click == 0} style = {[styles.moveButton, styles.button, click == 0 ? styles.buttonDisabled: styles.buttonAbled]}>
                <Text style = {{fontSize: 16}}>
                    next
                </Text>
            </TouchableOpacity>

            <View style={{ height: 80 }} />

        </View>
    );
}


const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

        padding: 16
    },

    imageButton: {
        borderWidth: 5
    },

    // 4지선다 제외한 버튼 (제출, 이전, 다음)
    moveButton: {
        width: "100%",
        // marginHorizontal: 10
    },

    // 버튼 활성화
    buttonAbled: {
        backgroundColor: "#94AF9F"
    },
    // 버튼 비활성화 
    buttonDisabled: {
        backgroundColor: "#D9D9D9"
    }

})