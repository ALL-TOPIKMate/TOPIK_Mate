import React, {useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)
import auth from '@react-native-firebase/auth'; // 사용자 정보 가져오기
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component'


import Loading from './component/Loading';
import MockProb from './component/MockProb';
import MockProbModal from './component/MockProbModal';
import MockTimer from './component/MockTimer';


// import 유틸
import { getNow } from '../utils/DateUtil';

// 현재 로그인한 사용자 정보 가져오기
const user = auth().currentUser;
const userEmail = user.email;


// users 컬렉션으로부터 현재 로그인한 사용자의 도큐먼트 REF GET
const getUserDocRef = async (email) => {

    try {
        const querySnapshot = await firestore()
            .collection('users')
            .where('email', '==', email)
            .get();


        console.log(`querySnapshot.docs[0].data().u_uid: ${querySnapshot.docs[0].data().u_uid}`);
        return querySnapshot.docs[0].ref;

    } catch (err) {
        
        console.log(err);

        return null;
    }

}

// 틀린 문제 업데이트
const updateUserWrongColl = async (email, problems, level) => {

    const userDocRef = await getUserDocRef(email);

    try {
        const wrongColl = userDocRef.collection(`wrong_${level}`);
    
        problems.map((problem) => {

            /* 풀이 기록 확인 */
            if (problem.USER_CHOICE !== undefined) {

                // 쓰기 영역 문제 처리
                if (problem.PRB_SECT === 'WR') {
                    // const tagDoc = wrongColl
                    //                 .doc('WR_TAG')
                    //                 .collection('PRB_TAG')
                    //                 .doc(problem.TAG);
                    // tagDoc.set({});
                    // const prbRscList = tagDoc.collection('PRB_RSC_LIST');

                    // const prbDoc = prbRscList.doc(problem.PRB_ID);
                    // prbDoc.set({});

                    // // 현재 날짜/시간으로 도큐먼트 ID 지정
                    // prbDoc.collection('PRB_LIST').doc(getNow()).set(problem);
                } else {

                    if (problem.USER_CHOICE !== problem.PRB_CORRT_ANSW) {
                        // // 틀린 문제 wrong list에 삽입
    
                        // 문제 영역, 태그 별 wrong list에 삽입
                        const sectTagDoc = wrongColl
                                        .doc(`${problem.PRB_SECT}_TAG`); sectTagDoc.set({});

                        const tagDoc = sectTagDoc
                                        .collection('PRB_TAG')
                                        .doc(problem.TAG); tagDoc.set({});

                        // 틀린 문제 컬렉션 삽입
                        tagDoc.collection('PRB_LIST').doc(problem.PRB_ID).set(problem);

                    } else {
                        // 맞은 문제 처리
                        const tagWrongColl = wrongColl
                                        .doc(`${problem.PRB_SECT}_TAG`)
                                        .collection('PRB_TAG')
                                        .doc(problem.TAG)
                                        .collection('PRB_LIST');
                        const probRef = tagWrongColl.doc(problem.PRB_ID);

                        probRef.get()
                            .then((docSnapshot) => {
                                if (docSnapshot.exists) {
                                    // 예전에 틀린 문제 맞힘 -> wrong list에서 제거
                                    probRef.delete().then(() => {
                                        console.log(`Doc deleted! - ${problem.PRB_ID} in ${tagWrongColl.path}`);
                                    })
                                }
                            })
                    }
                }   
            }

        })

    } catch (err) {
        console.log(err)
    }


}



const MockStudyScreen = ({navigation, route}) =>{
    
    const storage = getStorage(firebase);
    
    // 콜렉션 불러오기
    const problemCollection = firestore()
                                .collection('problems')
                                .doc(route.params.level)
                                .collection('PQ')
                                .doc(route.params.order)
                                .collection('PRB_LIST');


    /** 문제 데이터 로드 */
    const [problems, setProblems] = useState([]); // json
    const prevProblems = useRef([]);

    const dataLoading = async () => {
            
        try {
            const data = await problemCollection.get();
            setProblems(data.docs.map(doc => ({...doc.data()})));
        } catch (error) {
            console.log(error.message);
        }
    }
    

    // 문제 REF 설정
    useEffect(() => {
        prevProblems.current = problems;
    }, [problems])

    
    
    
    /* 멀티미디어 로드 */
    
    // 이미지 로드
    const imageRef = storage.ref().child(`/images/${route.params.level}PQ${route.params.order}/`);
    const [images, setImages] = useState({});
    const prevImages = useRef({});
    
    const imagesLoading = async (imageRef) => {
        try {
            await imageRef.listAll().then(res => {
                
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
    
    // 이미지 REF 설정
    useEffect(() => {
        prevImages.current = images;
    }, [images])



    // 오디오 로드
    const audioRef = storage.ref().child(`/audios/${route.params.level}PQ${route.params.order}/`);
    const [audios, setAudios] = useState({});
    const prevAudios = useRef({});
    
    const audiosLoading = async (audioRef) =>  { 
        
        await audioRef.listAll().then(res => {
            
            const data = {}
            
            res.items.forEach(item => {
                item.getDownloadURL().then(url => {
                    
                    data[item.name] = {};
                    data[item.name].url = url;
                    
                })
            })
            
            setAudios(data);
            
        });
            
    }

    
    // 오디오 REF 설정
    useEffect(() => {
        prevAudios.current = audios;
    }, [audios])
    

    // 데이터 준비 여부
    const [ready, setReady] = useState(false);
    
    
    /** 데이터 로딩 처리 */
    useEffect(() => {

        setReady(false);

        // 데이터 로딩
        dataLoading();
        imagesLoading(imageRef);
        audiosLoading(audioRef);

        setTimeout(() => {
            setReady(true); // 데이터 준비 완료
        }, 3000); // 3초간 로딩

    }, []);



    
    /* 사용자 답안 저장 */
    const [choice, setChoice] = useState(0);
    const [direction, setDirection] = useState(0);
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        if (isEnd || direction !== 0) {
            console.log(`current index: ${index}`);
            console.log(`current choice: ${choice}`);
            console.log(`current direction: ${direction}`);
            
            let newArr = [...prevProblems.current];
            if (newArr !== undefined) {

                // 직전 풀이한 문제의 사용자 선택 저장
                newArr[index + direction]['USER_CHOICE'] = choice;
                setProblems(newArr);
                
                console.log(
                    `updated ${index + direction}: ${newArr[index + direction].USER_CHOICE}`
                    );
                        
            }
        }
    }, [isEnd, index]);
        


    /* 결과 화면 만들기 */
    const [isEnd, setIsEnd] = useState(false); // 타임 아웃 여부
    
    const [listen, setListen] = useState([]);
    const [write, setWrite] = useState([]);
    const [read, setRead] = useState([]);
    

    // 결과 화면 테이블 헤더
    const headers = ['No.', 'Your answer', 'Correct Answer', 'Result', 'Review'];
    
    useEffect(() => {
        if (isEnd || index === prevProblems.current.length) {

            // 사용자 틀린 문제 DB 업데이트
            updateUserWrongColl(userEmail, prevProblems.current, route.params.level.toLowerCase());

            // 문제 영역별 분류
            prevProblems.current.map((problem) => {
                
                switch (problem.PRB_SECT) {
                    case 'LS':
                        setListen((prevList) => [...prevList, problem]);
                        break;
                    case 'RD':
                        setRead((prevList) => [...prevList, problem]);
                        break;
                    case 'WR':
                        setWrite((prevList) => [...prevList, problem]);
                        break;
                }
            });
        }
    }, [isEnd, index]);

                

    /* 푼 문제 재확인(결과화면 모달) */
    const [modal, setModal] = useState(<MockProbModal />); // 모달 컴포넌트 state
    const [visible, setVisible] = useState(false); // 모달 비저블
    

    // 푼 문제 재확인 버튼 요소
    const element = (data, index) => (
        // 버튼을 클릭하면 해당 문제를 풀었던 화면을 보여줌(problemStructure[data])
        <TouchableOpacity onPress={() => {
            setModal(<MockProbModal 
                problem={
                    data == 'LS'
                    ? listen
                    : (
                        data == 'RD'
                        ? read
                        : write
                    )
                }
                index={index}
                setVisible={setVisible}
                images={prevImages}
                audios={prevAudios}/>);
            setVisible(true);}}
        >
            <View style={{width: 50, height: 20, backgroundColor: '#94AF9F', borderRadius: 2, marginLeft: 5}}>
                <Text style={styles.text}>Review</Text>
            </View>
        </TouchableOpacity>
    );



    /** 출력 화면 */ 
    if (!ready) {
        // 로딩 화면
        return (
            <Loading />
        )
    } else if (ready && !isEnd && index !== prevProblems.current.length) {
        // 문제 풀이 화면
        return (
            <View style={styles.container}>
                <View>
                    <TouchableOpacity 
                        onPress={() => setIsEnd(true)} 
                        style={styles.exitBtn}>
                        <Text>Exit</Text>
                    </TouchableOpacity>
                </View>
                {/* 타이머 */}
                {/* <MockTimer
                    level={route.params.level}
                    setIsEnd={setIsEnd}
                /> */}
    
                {/* 문제 풀이 영역 */}
                <MockProb
                    problem={prevProblems.current[index]}
                    choice={prevProblems.current[index].USER_CHOICE}
                    setChoice={setChoice}
                    setIndex={setIndex}
                    index={index}
                    probListLength={prevProblems.current.length}
                    setDirection={setDirection}
                    images={prevImages}
                    audios={prevAudios}
                />
            </View>
        );
    } else if (isEnd || index === prevProblems.current.length) {
        // 결과 테이블 화면
        return (
            <ScrollView style={styles.container}>

                {/* 모달 창 */}
                {visible && modal}
                
                
                {/* 듣기 */}
                <View>
                <Text style={styles.sectionTitle}>듣기</Text>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    <Row data={headers} style={[styles.row, {backgroundColor: '#C1C0B9'}]} textStyle={styles.text}/>
                    {
                    listen.map((rowData, rowIndex) => {
                        return (
                        <TableWrapper key={rowIndex} style={styles.row} >
                            <Cell key={0} data={rowData['PRB_NUM']} textStyle={styles.text} />
                            <Cell key={1} data={rowData['USER_CHOICE']} textStyle={styles.text} />
                            <Cell key={2} data={rowData['PRB_CORRT_ANSW']} textStyle={styles.text} />
                            <Cell key={3} data={rowData['USER_CHOICE'] === rowData['PRB_CORRT_ANSW'] ? '정답' : '오답'} textStyle={styles.text} />
                            <Cell key={4} data={element('LS', rowIndex)} textStyle={styles.text} />
                        </TableWrapper>
                        )
                    })
                    }
                </Table>
                </View>
                


                {/* 쓰기 */}
                {
                    route.params.length === 'LV2'
                    ? <View>
                    <Text style={styles.sectionTitle}>쓰기</Text>
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
                    : null
                }
                
                

                {/* 읽기 */}
                <View>
                <Text style={styles.sectionTitle}>읽기</Text>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    <Row data={headers} style={[styles.row, {backgroundColor: '#C1C0B9'}]} textStyle={styles.text} />
                    {
                    read.map((rowData, rowIndex) => {
                        return (
                        <TableWrapper key={rowIndex} style={styles.row} >
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
        );
    }     
}




const styles = StyleSheet.create({
    container:{
        padding: 20,
    },

    exitBtn: {
        width: 50,
        left: 300,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        backgroundColor: '#D9D9D9',
    },

    button:{
        flex: 3,
        borderRadius: 10,
        padding: 16,
        backgroundColor: '#BBD6B8',
        // flexDirection: "row",
        // justifyContent: "center"

    },

    sectionTitle: {
        marginBottom: 10,
        marginTop: 20,
        fontSize: 20,
    },

    row: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#f6f8fa',
    },

    text: { textAlign: 'center' },
})


export default MockStudyScreen;
