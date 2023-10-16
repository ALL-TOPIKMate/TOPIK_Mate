import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component'

import firestore from '@react-native-firebase/firestore';
import UserContext from '../../lib/UserContext';
import MockProbModal from './MockProbModal';
import MockProbWriteModal from './MockProbWriteModal';

const headers = ['No.', 'Selected', 'Answer', 'Result', 'Review'];



const MockResult = ({ level, listen, write, read, prevImages, prevAudios, problems }) => {

    const USER = useContext(UserContext)

    /* 푼 문제 재확인(결과화면 모달) */
    const [modal, setModal] = useState(<MockProbModal />); // 모달 컴포넌트 state
    const [visible, setVisible] = useState(false); // 모달 비저블
    
    // 영역별 점수
    const [scoreLc, setScoreLc] = useState(0)
    const [scoreRc, setScoreRc] = useState(0)
    const [scoreWr, setScoreWr] = useState(0)



    useEffect(() => {

        let [lc, rc, wr] = [0, 0, 0]

        listen.forEach((problem) => {
            if(problem.PRB_USER_ANSW == problem.PRB_CORRT_ANSW){
                lc += 2
            }
        })

        read.forEach((problem) => {
            if(problem.PRB_USER_ANSW == problem.PRB_CORRT_ANSW){
                rc += 2
            }
        })
    
        write.forEach((problem) => {
            wr += problem.SCORE 
            wr += problem.SCORE2 || 0
        })

        setScoreLc(lc)
        setScoreRc(rc)
        setScoreWr(wr)


    }, [problems])



    // 푼 문제 재확인 버튼 요소
    const element = (data, index) => (
        // 버튼을 클릭하면 해당 문제를 풀었던 화면을 보여줌(problemStructure[data])
        <TouchableOpacity 
            onPress={() => {
                setModal(<MockProbModal 
                    problem={
                        data == 'LS'
                        ? listen
                        : read
                    }
                    index={index}
                    setVisible={setVisible}
                    images={prevImages}
                    audios={prevAudios}/>);
                setVisible(true);}
            }
            style={styles.reviewButton}
        >
            <Text style={styles.text}>Review</Text>
        </TouchableOpacity>
    );
    
            

    return (
        <ScrollView style={styles.container}>
            <View style = {[styles.titleContainer, {alignItems: "center"}]}>
                <Text style={{fontSize: 26}}>Mock Result</Text>
                {/* <Text style = {{fontSize: 20}}>Total {scoreLc + scoreRc + scoreWr} score</Text> */}
            </View>
            
            {/* 모달 창 */}
            {visible && modal}
            
            <View style = {{height: 50}} />


            {/* 듣기 */}
            <View>
                <View style = {styles.titleContainer}>
                    <Text style={styles.sectionTitle}>듣기</Text>
                    <Text style = {[styles.sectionTitle]}>{scoreLc} score</Text>    
                </View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={headers} style={styles.row} textStyle={styles.text}/>
                {
                listen.map((rowData, rowIndex) => {
                    return (
                    <TableWrapper key={rowIndex} style={styles.itemRow} >
                        <Cell key={0} data={rowData['PRB_NUM']} textStyle={styles.text} />
                        <Cell key={1} data={rowData['PRB_USER_ANSW']} textStyle={styles.text} />
                        <Cell key={2} data={rowData['PRB_CORRT_ANSW']} textStyle={styles.text} />
                        <Cell key={3} data={rowData['PRB_USER_ANSW'] === rowData['PRB_CORRT_ANSW'] ? '정답' : '오답'} textStyle={styles.text} />
                        <Cell key={4} data={element('LS', rowIndex)} />
                    </TableWrapper>
                    )
                })
                }
            </Table>
            </View>
            
            {/* 쓰기 */}
            {
                level === 'LV2'
                ? <View>
                    <View style = {{height: 50}} />
                    <View style = {{borderBottomColor: '#C1C0B9', borderBottomWidth: StyleSheet.hairlineWidth, marginLeft: 4}}/>
                    <View style = {styles.titleContainer}>
                        <Text style={styles.sectionTitle}>쓰기</Text>
                        <Text style = {styles.sectionTitle}>{scoreWr >= 0 ? scoreWr + " score" :  "54번 채점중..."} </Text>    
                    </View>
                <View>
                    {
                        write.map((rowData, rowIndex) => {
                            return (
                            <View key={rowIndex}>
                                <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
                                    <Text style={styles.prbNumText}>{rowData['PRB_NUM']}</Text>
                                    <View style = {{flexDirection: "row"}}>
                                        <TouchableOpacity 
                                            onPress={() => {
                                                setModal(<MockProbWriteModal 
                                                    problem={write}
                                                    index={rowIndex}
                                                    setVisible={setVisible}
                                                    images={prevImages}/>);
                                                setVisible(true);}}
                                            style={styles.reviewButton}
                                        >
                                        <Text style={styles.text}>Review</Text>
                                        </TouchableOpacity>
                                        {
                                            rowData.SCORE >= 0 ?
                                            <Text style = {{fontSize: 16, marginLeft: 6}}>{rowData.SCORE + (rowData.SCORE2 || 0)} / {rowData.PRB_POINT}</Text>:
                                            <Text style = {{fontSize: 16, marginLeft: 6}}>채점중...</Text>
                                        }
                                    </View>
                                </View>                                    
                            
                                {
                                rowData['TAG'] === '001' || rowData['TAG'] === '002'
                                
                                ? <View>
                                    <Text>㉠</Text>
                                    <Text style={styles.inputBox}>{rowData['PRB_USER_ANSW']}</Text>
                                    <Text>㉡</Text>
                                    <Text style={styles.inputBox}>{rowData['PRB_USER_ANSW2']}</Text>
                                </View>
                                : <View>
                                    <Text style={styles.inputBox}>{rowData['PRB_USER_ANSW']}</Text>
                                </View>
                                }
                            </View>
                            )
                        })
                    }
                </View>
                </View>
                : null
            }
            
            <View style = {{height: 50}} />
            <View style = {{borderBottomColor: '#C1C0B9', borderBottomWidth: StyleSheet.hairlineWidth, marginLeft: 4}}/>


            {/* 읽기 */}
            <View>
            <View style = {styles.titleContainer}>
                <Text style={styles.sectionTitle}>읽기</Text>
                <Text style = {styles.sectionTitle}>{scoreRc} score</Text>    
            </View>
            <Table style={{marginBottom: 50}} borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={headers} style={styles.row} textStyle={styles.text} />
                {
                read.map((rowData, rowIndex) => {
                    return (
                    <TableWrapper key={rowIndex} style={styles.itemRow} >
                        <Cell key={0} data={rowData['PRB_NUM']} textStyle={styles.text} />
                        <Cell key={1} data={rowData['PRB_USER_ANSW']} textStyle={styles.text} />
                        <Cell key={2} data={rowData['PRB_CORRT_ANSW']} textStyle={styles.text} />
                        <Cell key={3} data={rowData['PRB_USER_ANSW'] === rowData['PRB_CORRT_ANSW'] ? '정답' : '오답'} textStyle={styles.text} />
                        <Cell key={4} data={element('RD', rowIndex)} textStyle={styles.text} />
                    </TableWrapper>
                    )
                })
                }
            </Table>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container:{
        padding: 20,
    },

    sectionTitle: {
        marginBottom: 10,
        marginTop: 20,
        fontSize: 20,
    },

    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },  

    row: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#C1C0B9'
    },

    itemRow: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#F6F8FA',
    },

    text: { textAlign: 'center' },

    // 쓰기 영역
    prbNumText: {
        fontSize: 20,
        marginVertical: 10,
    },

    inputBox: {
        padding: 10,
        borderColor: '#C1C0B9',
        borderWidth: 2,
        // borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
    },

    reviewButton: {
        alignSelf: 'center',
        backgroundColor: '#94AF9F',
        borderRadius: 6,
        padding: 4,
    },
});

export default MockResult;
