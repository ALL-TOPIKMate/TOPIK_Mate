import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component'

import MockProbModal from './MockProbModal';
import MockProbWriteModal from './MockProbWriteModal';

const headers = ['No.', 'Your answer', 'Correct Answer', 'Result', 'Review'];

const MockResult = ({ level, listen, write, read, prevImages, prevAudios }) => {
    /* 푼 문제 재확인(결과화면 모달) */
    const [modal, setModal] = useState(<MockProbModal />); // 모달 컴포넌트 state
    const [visible, setVisible] = useState(false); // 모달 비저블
    

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

            <Text style={{fontSize: 26}}>Mock Result</Text>
            
            {/* 모달 창 */}
            {visible && modal}
            
            
            {/* 듣기 */}
            <View>
            <Text style={styles.sectionTitle}>듣기</Text>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={headers} style={styles.row} textStyle={styles.text}/>
                {
                listen.map((rowData, rowIndex) => {
                    return (
                    <TableWrapper key={rowIndex} style={styles.itemRow} >
                        <Cell key={0} data={rowData['PRB_NUM']} textStyle={styles.text} />
                        <Cell key={1} data={rowData['USER_CHOICE']} textStyle={styles.text} />
                        <Cell key={2} data={rowData['PRB_CORRT_ANSW']} textStyle={styles.text} />
                        <Cell key={3} data={rowData['USER_CHOICE'] === rowData['PRB_CORRT_ANSW'] ? '정답' : '오답'} textStyle={styles.text} />
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
                <Text style={styles.sectionTitle}>쓰기</Text>
                <View>
                    {
                        write.map((rowData, rowIndex) => {
                            return (
                            <View key={rowIndex}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.prbNumText}>{rowData['PRB_NUM']}</Text>
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
                                </View>                                    
                            
                                {
                                rowData['TAG'] === '001' || rowData['TAG'] === '002'
                                
                                ? <View>
                                    <Text>㉠</Text>
                                    <Text style={styles.inputBox}>{rowData['USER_CHOICE']}</Text>
                                    <Text>㉡</Text>
                                    <Text style={styles.inputBox}>{rowData['USER_CHOICE2']}</Text>
                                </View>
                                : <View>
                                    <Text style={styles.inputBox}>{rowData['USER_CHOICE']}</Text>
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
            
            

            {/* 읽기 */}
            <View>
            <Text style={styles.sectionTitle}>읽기</Text>
            <Table style={{marginBottom: 50}} borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={headers} style={styles.row} textStyle={styles.text} />
                {
                read.map((rowData, rowIndex) => {
                    return (
                    <TableWrapper key={rowIndex} style={styles.itemRow} >
                        <Cell key={0} data={rowData['PRB_NUM']} textStyle={styles.text} />
                        <Cell key={1} data={rowData['USER_CHOICE']} textStyle={styles.text} />
                        <Cell key={2} data={rowData['PRB_CORRT_ANSW']} textStyle={styles.text} />
                        <Cell key={3} data={rowData['USER_CHOICE'] === rowData['PRB_CORRT_ANSW'] ? '정답' : '오답'} textStyle={styles.text} />
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
        borderRadius: 10,
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
