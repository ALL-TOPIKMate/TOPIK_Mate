import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const ResultScreen = ({ route, navigation }) => {

    const CORRT_CNT = route.params.CORRT_CNT
    const ALL_CNT = route.params.ALL_CNT
    const PATH = route.params.PATH

    // 정답비율
    const rate = [0, 0.25, 0.5, 0.75, 1]
    const circleList = [styles.circle0, styles.circle1, styles.circle2, styles.circle3, styles.circle4]


    
    const endButtonPress = () => {
        navigation.pop()
    }

    const findUserRate = () => {
        const userRate = CORRT_CNT / ALL_CNT
        
        for(var i=0; i<4; i++){
            if(userRate > rate[i + 1]){
                continue
            }

            // 간격이 작은 구간으로 반올림
            if( userRate - rate[i] > rate[i+1] - userRate){
                return circleList[i+1]
            }else{
                return circleList[i]
            }
        }
    }



    return (
        <View style={{ flex: 1, padding: 14, alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ marginTop: 32 }}>
                <Text style={[styles.text, { fontSize: 20 }]}>
                    이번 학습에서 문제 {CORRT_CNT}개를 맞췄습니다
                </Text>
            </View>
            <View style = {styles.outCircle}>
                <View style = {[findUserRate() ,styles.rotateRight]}>
                    <Text style={[styles.text, styles.rotateLeft, { fontSize: 32, }]}>
                        {CORRT_CNT} / {ALL_CNT}
                    </Text>
                </View>
            </View>

            <Text style={[styles.text, { fontSize: 20 }]}>
                잘하고 있어요!
            </Text>

            <TouchableOpacity onPress={() => { endButtonPress() }} style={{ backgroundColor: "#94AF9F", padding: 20, borderRadius: 20, width: 300 }}>
                <Text style={[styles.text, { color: "white" }]}>
                    END LEARNING
                </Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        fontWeight: "bold",

    },

    outCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderColor: "#BBD6B8",
        borderWidth: 4,
        alignItems: "center",
        justifyContent: "center"
    },
    
    circle0: {
        width: 240,
        height: 240,
        borderRadius: 120,
        // backgroundColor: "black",
        

        borderTopWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 10,


        borderTopColor: "white",
        borderRightColor: "white",
        borderBottomColor: "white",
        borderLeftColor: "white",

        alignItems: "center",
        justifyContent: "center"
    },
    circle1: {
        width: 250,
        height: 250,
        borderRadius: 125,
        // backgroundColor: "black",
        

        borderTopWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 10,


        borderTopColor: "#94AF9F",
        borderRightColor: "white",
        borderBottomColor: "white",
        borderLeftColor: "white",

        alignItems: "center",
        justifyContent: "center"
    },
    circle2: {
        width: 250,
        height: 250,
        borderRadius: 125,
        // backgroundColor: "black",
        

        borderTopWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 10,


        borderTopColor: "#94AF9F",
        borderRightColor: "#94AF9F",
        borderBottomColor: "white",
        borderLeftColor: "white",

        alignItems: "center",
        justifyContent: "center"
    },
    circle3: {
        width: 250,
        height: 250,
        borderRadius: 125,
        // backgroundColor: "black",
        

        borderTopWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 10,


        borderTopColor: "#94AF9F",
        borderRightColor: "#94AF9F",
        borderBottomColor: "#94AF9F",
        borderLeftColor: "white",

        alignItems: "center",
        justifyContent: "center"
    },
    circle4: {
        width: 250,
        height: 250,
        borderRadius: 125,
        // backgroundColor: "black",
        

        borderTopWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftWidth: 10,


        borderTopColor: "#94AF9F",
        borderRightColor: "#94AF9F",
        borderBottomColor: "#94AF9F",
        borderLeftColor: "#94AF9F",

        alignItems: "center",
        justifyContent: "center"
    },

    rotateRight:{
        transform: [{rotateZ: "45deg" }],
    },
    rotateLeft: {
        transform: [{rotateZ: "-45deg" }],
    }
})

export default ResultScreen;