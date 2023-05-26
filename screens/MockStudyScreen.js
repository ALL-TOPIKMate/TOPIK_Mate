import React, {useState, useEffect, } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component'


import MockProb from './component/MockProb';
import MockProbModal from './component/MockProbModal';
import MockTimer from './component/MockTimer';


const MockStudyScreen = ({navigation, route}) =>{
    
    const storage = getStorage(firebase);

    // 콜렉션 불러오기
    const problemCollection = firestore()
                                .collection('problems')
                                .doc(route.params.level)
                                .collection('PQ')
                                .doc(route.params.order)
                                .collection('problem-list');
    const [problems, setProblems] = useState([]); // json

    // MOUNT - 문제 로드
    useEffect(() => {
        async function dataLoading() {
    
            try {
                const data = await problemCollection.get();
                setProblems(data.docs.map(doc => ({...doc.data()})));
            } catch (error) {
                console.log(error.message);
            }
        }
        
        dataLoading();
    }, []);



    /* 멀티미디어 로드 */
    
    // 이미지 로드
    const imageRef = storage.ref().child(`/images/${route.params.level}PQ${route.params.order}/`);
    const [images, setImages] = useState({});

    useEffect(() => {
        async function imagesLoading() {
            try {
                imageRef.listAll().then(res => {

                    const data = {}

                    res.items.forEach(item => {
                        item.getDownloadURL().then(url => {
                            
                            data[item.name] = {};
                            data[item.name].url = url;

                        })
                    })

                    setImages(data);
                    
                });

            } catch(err) {
                console.log(err);
            }
        }

        imagesLoading();
    }, []);

    // 오디오 로드
    const audioRef = storage.ref().child(`/audios/${route.params.level}PQ${route.params.order}/`);
    const [audios, setAudios] = useState({});

    useEffect(() => {
        async function audiosLoading() {
            try {
                audioRef.listAll().then(res => {

                    const data = {}

                    res.items.forEach(item => {
                        item.getDownloadURL().then(url => {
                            
                            data[item.name] = {};
                            data[item.name].url = url;
                            
                        })
                    })

                    setAudios(data);
                    
                });

            } catch(err) {
                console.log(err);
            }
        }

        audiosLoading();
    }, []);

   

    /* 사용자 답안 저장 */
    const [choice, setChoice] = useState(0);
    const [direction, setDirection] = useState(0);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (direction !== 0) {
            console.log(`current index: ${index}`);
            console.log(`current choice: ${choice}`);
            console.log(`current direction: ${direction}`);

            let newArr = [...problems];
            newArr[index + direction]['USER_CHOICE'] = choice;
            setProblems(newArr);

            console.log(
                `updated ${index + direction}: ${newArr[index + direction].USER_CHOICE}`
            );

        }
    }, [index]);



    
    /* 결과 화면 만들기 */
    const [isEnd, setIsEnd] = useState(false);

    const [listen, setListen] = useState([]);
    const [write, setWrite] = useState([]);
    const [read, setRead] = useState([]);

    // 결과 화면 테이블 헤더
    const headers = ['No.', 'Your answer', 'Correct Answer', 'Result', 'See...'];

    useEffect(() => {
        if (isEnd || index === problems.length) {
            problems.map((problem) => {

                switch (problem.PRB_SECT) {
                case '듣기':
                    setListen((prevList) => [...prevList, problem]);
                    break;
                case '읽기':
                    setRead((prevList) => [...prevList, problem]);
                    break;
                case '쓰기':
                    setWrite((prevList) => [...prevList, problem]);
                    break;
                }
            });
        }
    }, [isEnd, index]);



    /* 푼 문제 재확인(결과화면 모달) */
    // 모달 창 여닫기
    const [modal, setModal] = useState({
        'open': false,
        'sect': '',
        'index': -1,
    });

    // 푼 문제 재확인 버튼 요소
    const element = (data, index) => (
        // 버튼을 클릭하면 해당 문제를 풀었던 화면을 보여줌(problemStructure[data])
        <TouchableOpacity onPress={() => setModal({open: true, sect: data, index: index})}>
            <View>
                <Text style={styles.text}>See...</Text>
            </View>
        </TouchableOpacity>
    );


    if (modal.open) {

        if (modal.sect === '듣기') {
        return (
            <MockProbModal
            problem={listen[modal.index]}
            modal={modal}
            setModal={setModal}
            />
        )
        } else if (modal.sect === '읽기') {
        return (
            <MockProbModal
            problem={read[modal.index]}
            modal={modal}
            setModal={setModal}
            />
        )
        } else if (modal.sect === '쓰기') {
        return (
            <MockProbModal
            problem={write[modal.index]}
            modal={modal}
            setModal={setModal}
            />
        )
        }
        
    } else if (isEnd || index === problems.length) {
        return (
        <ScrollView>
            {/* 듣기 */}
            <View>
            <Text>듣기</Text>
            <Table>
                <Row data={headers} style={styles.row} />
                {
                listen.map((rowData, rowIndex) => {
                    return (
                    <TableWrapper key={rowIndex} style={styles.row} >
                        <Cell data={rowData['PRB_NUM']} style={styles.text} />
                        <Cell data={rowData['USER_CHOICE']} style={styles.text} />
                        <Cell data={rowData['PRB_CORRT_ANSW']} style4={styles.text} />
                        <Cell data={rowData['USER_CHOICE'] === rowData['PRB_CORRT_ANSW'] ? '정답' : '오답'} textStyle={styles.text} />
                        <Cell data={element('듣기', rowIndex)} style={styles.text} />
                    </TableWrapper>
                    )
                })
                }
            </Table>
            </View>
            


            {/* 쓰기 */}
            <View>
            <Text>쓰기</Text>
            <View>
                {
                write.map((rowData, rowIndex) => {
                    return (
                    <View key={rowIndex}>
                        <Text>{rowData['PRB_NUM']}</Text>
                        <Text>{rowData['USER_CHOICE']}</Text>
                    </View>
                    )
                })
                }
            </View>
            </View>
            
            

            {/* 읽기 */}
            <View>
            <Text>읽기</Text>
            <Table>
                <Row data={headers} style={styles.row} textStyle={styles.text} />
                {
                read.map((rowData, rowIndex) => {
                    return (
                    <TableWrapper key={rowIndex} style={styles.row} >
                        <Cell data={rowData['PRB_NUM']} style={styles.text} />
                        <Cell data={rowData['USER_CHOICE']} style={styles.text} />
                        <Cell data={rowData['PRB_CORRT_ANSW']} style={styles.text} />
                        <Cell data={rowData['USER_CHOICE'] === rowData['PRB_CORRT_ANSW'] ? '정답' : '오답'} style={styles.text} />
                        <Cell data={element('읽기', rowIndex)} style={styles.text} />
                    </TableWrapper>
                    )
                })
                }
            </Table>
            </View>
        </ScrollView>
        );
    } else {
        // 문제 풀이 화면
        return (
        <View style={styles.container}>
            {/* 타이머 */}
            <MockTimer
                level={route.params.level}
                setIsEnd={setIsEnd}
            />

            {/* 문제 풀이 영역 */}
            <MockProb
            problem={problems[index]}
            choice={problems[index].USER_CHOICE}
            setChoice={setChoice}
            setIndex={setIndex}
            index={index}
            setDirection={setDirection}
            images={images}
            audios={audios}
            />
        </View>
        );
    }


    
}

const styles = StyleSheet.create({
    container:{
        padding: 20,
    },

    containerPos: {
        flex: 20
    },

    button:{
        flex: 3,
        borderRadius: 10,
        padding: 16,
        backgroundColor: '#BBD6B8',
        // flexDirection: "row",
        // justifyContent: "center"

    },

    row: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#f6f8fa',
        textAlign: 'center',
    },

    // text: { textAlign: 'center' },
})

export default MockStudyScreen;