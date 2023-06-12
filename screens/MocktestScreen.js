import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Platform } from 'react-native'
import { Table, TableWrapper, Row, Col, Cell } from 'react-native-table-component'

const MocktestScreen = ({navigation: {navigate}}) =>{

    return (
        <View style={styles.container}>
            <View style={styles.titleSection}>
                <Text style={styles.tabNaviTitle}>
                    모의고사
                </Text>
            </View>

            <Text style={styles.infoText}>Mock Informations</Text>
            <View style={styles.infoSection}>
                <Image
                    style={styles.infoImg}
                    source={require('../assets/topik-guide.webp')}
                />
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
        flex: 2,

        flexDirection: 'column',
        marginBottom: 30,
        alignContent: 'center',
    },

    infoText: {
        fontSize: 20,
    },

    infoImg: {
        flex: 2,
        width: '100%',
        resizeMode: 'contain',
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
    },

});

export default MocktestScreen;