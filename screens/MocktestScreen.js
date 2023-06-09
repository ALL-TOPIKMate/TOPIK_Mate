import React from 'react';

import { View, Text, Button, StyleSheet, Pressable, Platform } from 'react-native'
import AppNameHeader from './component/AppNameHeader'


const MocktestScreen = ({navigation: {navigate}}) =>{
    return (
        <View style={styles.container}>
            <View style={styles.titleSection}>
                <Text style={styles.tabNaviTitle}>
                    모의고사
                </Text>
            </View>

            <View style={styles.infoSection}>
                <Text>Exam Schedule</Text>
                <Text style={{fontSize: 20}}>
                    ㅇㅇㅇㅇ
                </Text>
                <Text style={{fontSize: 20}}>
                    ㅇㅇㅇㅇ
                </Text>
                <Text style={{fontSize: 20}}>
                    ㅇㅇㅇㅇ
                </Text>
                <Text style={{fontSize: 20}}>
                    ㅇㅇㅇㅇ
                </Text>    
            </View>
            
            <View style={styles.mockLevelSelectContainer}>
                <Pressable onPress={() => navigate('MockList', {level: 'LV1'})} style={styles.mockLevelBtn}>
                    <Text style={{fontSize:16,}}>TOPIK 1</Text>
                    <Text>for beginner</Text>
                </Pressable>
                <Pressable onPress={() => navigate('MockList', {level: 'LV2'})} style={styles.mockLevelBtn}>
                    <Text style={{fontSize: 16,}}>TOPIK 2</Text>
                    <Text>for intermediate-advanced</Text>
                </Pressable>
            </View>
            {/* {navigation}으로만 했을 때 아래 코드를 통해 화면 이동 시 route 사용이 안 됐음.  */}
            {/* <Button title = "TOPIK 1" onPress={() => {navigation.push("MockList"), {level: 1}}}/> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    titleSection: {
        flex: 1,
    },
    tabNaviTitle: {
        fontSize: 32,
    },


    infoSection: {
        flex: 3,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#d9d9d9',
        marginBottom: 30,
    },


    shadow: {
        backgroundColor: "#fff",
        width: 200,
        height: 200,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {
                width: 10,
                height: 10,
                },
                shadowOpacity: 0.5,
                shadowRadius: 10,
            },
            android: {
                elevation: 20,
            }
        })
    },

    mockLevelSelectContainer: {
        flex: 3,
        justifyContent: 'center',
        flexDirection: 'row'
    },

    mockLevelBtn: {
        flex: 1,
        alignItems: 'baseline',
        borderRadius: 10,
        padding: 16,
        marginHorizontal: 10,
        backgroundColor: '#94AF9F',

        // 그림자 효과
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },


        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    }
});

export default MocktestScreen;