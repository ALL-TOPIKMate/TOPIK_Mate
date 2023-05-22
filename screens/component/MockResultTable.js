import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell, Cells } from 'react-native-table-component';


const MockResultTable = (props) => {
    
    const haeders = ["No.", "Your answer", "Correct answer", "Result", "See"]
    const resultData = []

    props.results.map((result, index) => {
        resultData.push([
            result.PRB_NUM,
            result.USER_CHOICE,
            result.PRB_CORRT_ANSW,
            result.USER_CHOICE == result.PRB_CORRT_ANSW ? "정답" : "오답",
            result._display_seq_num
        ])
    })

    // 버튼 요소
    const element = (data, index) => (
        // 버튼을 클릭하면 해당 문제를 풀었던 화면을 보여줌(problemStructure[data])
        <TouchableOpacity onPress={() => {props.targetRef.current = data; console.log(`props.targetRef.current: ${props.targetRef.current}`)}}>
            <View style={styles.btn}>
                <Text style={styles.text}>see</Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <View>
            <Table
                style = {styles.table}
                borderStyle={{borderWidth: 1, borderColor: '#000000'}}>
                <Row data={haeders} flexArr={[1, 1, 1, 1]} style={styles.head} textStyle={styles.text} />
                {
                    resultData.map((rowData, index) => (
                        <TableWrapper key={index} style={styles.row}>
                            {
                                rowData.map((cellData, cellIndex) => (
                                    <Cell key={cellIndex} data={cellIndex === 4 ? element(cellData, cellIndex) : cellData} textStyle={styles.text} />
                                ))
                            }
                        </TableWrapper>
                        // <Row
                        //     key = {index}
                        //     data = {result}
                        //     style = {styles.tableData}
                        //     textStyle = {styles.text}
                        //     onClick = {() => {console.log(result[4])}}
                        // />
                        // <Row 
                        //     key={index}
                        //     data={result}
                        //     style={styles.tableData}
                        //     textStyle={styles.text}>
                        //     {
                        //         <TableWrapper>
                        //             <Cell key={0} data={result[0]}/>
                        //             <Cell key={1} data={result[1]}/>
                        //             <Cell key={2} data={result[2]}/>
                        //             <Cell key={3} data={result[3]}/>
                        //         </TableWrapper>
                        //     }
                        // </Row>
                        // <TableWrapper style={styles.container}>
                        //     <Cell key={0} data={result[0]} style={styles.tableData} />
                        //     <Cell key={1} data={result[1]} style={styles.tableData} />
                        //     <Cell key={3} data={result[2]} style={styles.tableData} />
                        //     <Cell key={4} data={result[3]} style={styles.tableData} />
                        // </TableWrapper>
                    ))
                }
            </Table>
        </View>
    )
}

const styles = StyleSheet.create({

    container: { 
        flexDirection: 'row',
        flexArr: [1, 1, 1, 1]
    },
    
    table: {
        marginTop: 5,
        marginBottom: 20,
    },

    row: { 
        height: 40,
        flexDirection: 'row',  
        backgroundColor: '#f6f8fa',
    },

    head: { 
        height: 40,
        backgroundColor: '#f1f8ff',
    },

    tableData: {
    },

    btn: {
        borderWidth: 1
    },

    text: { textAlign: 'center' },
});

export default MockResultTable;