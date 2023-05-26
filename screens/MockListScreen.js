import React, { useEffect, useState } from 'react';

import {View, Text, Button, FlatList} from 'react-native';
import AppNameHeader from './component/AppNameHeader'
import firestore from '@react-native-firebase/firestore';

const MockListScreen = ({navigation, route}) => {
    
    const mockColl = firestore()
                        .collection('problems')
                        .doc(route.params.level)
                        .collection('PQ');
    const [mockList, setMockList] = useState([]);

    useEffect(() => {
        async function getMockList() {
            try {
                const data = await mockColl.get();
                setMockList(data.docs.map(doc => ({id: doc.id, name: doc.id[3] == '1' 
                                                                ? Number(doc.id) + "st" 
                                                                : (
                                                                    doc.id[3] == '2' 
                                                                    ? Number(doc.id) + "nd" : (
                                                                        doc.id[3] == '3'
                                                                        ? Number(doc.id) + "rd"
                                                                        : Number(doc.id) + "th"
                                                                    ))})));
                
                // data.docs.map((doc) => {
                    // let ordinaryNumName = "th";
                    // let lastNum = doc.id[3];
                    
                    // if (lastNum == "1") {
                    //     ordinaryNumName = "st";
                    // } else if (lastNum == "2") {
                    //     ordinaryNumName = "nd";
                    // } else if (lastNum == "3") {
                    //     ordinaryNumName = "rd";
                    // }

                    // let newObj = {
                    //     id: doc.id,
                    //     name: Number(doc.id) + ordinaryNumName
                    // }

                    // setMockList([...mockList, newObj])
                // });

            } catch (err) {
                console.log(err)
            }
        }

        getMockList();

    }, []);


    return (

        <View>
            <Text>
                선택한 TOPIK 레벨: { route.params.level }
            </Text>
            <View>
                {
                    mockList.map((mock, index) => {
                        return (
                            <Button 
                                key={index} 
                                title={mock.name} 
                                onPress={()=>{
                                    navigation.push("MockStudy", {
                                        level: route.params.level,
                                        order: mock.id
                                    })
                                }}
                            />
                        )
                    })
                }
            </View>

            {/* <Button title = "60st topik mock test" onPress={()=>{navigation.push("MockStudy", {order: 60})}}/> */}
        </View>
    );

}

export default MockListScreen;