import React, { useEffect, useState } from 'react';

import { View, Text, Button, StyleSheet, Pressable, ScrollView, FlatList, TouchableOpacity } from 'react-native';
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
                console.log(data.docs.length);
                setMockList(data.docs.map(doc => (
                    {
                        id: doc.id, 
                        name: doc.id[3] == '1' 
                        ? Number(doc.id) + "st" 
                        : (
                            doc.id[3] == '2' 
                            ? Number(doc.id) + "nd" : (
                                doc.id[3] == '3'
                                ? Number(doc.id) + "rd"
                                : Number(doc.id) + "th"
                            ))
                        }))
                );

            } catch (err) {
                console.log(err)
            }
        }

        getMockList();

    }, []);


    const renderItem = ({item}) => {
        return (
            <Pressable
                onPress={() => {
                    navigation.push("MockStudy", {
                        level: route.params.level,
                        order: item.id
                    })
                }}
                style={styles.mockItem}>
                <Text style={styles.mockName}>{item.name}</Text>
            </Pressable>
        )
    }

    return (

        <View style={styles.container}>
            <View style={styles.titleSection}>
                <Text style={styles.tabNaviTitle}>
                    모의고사 - TOPIK { route.params.level }
                </Text>
            </View>

            <View style={styles.mockList}>
                <FlatList 
                    keyExtractor={(item) => item.id}
                    data={mockList}
                    renderItem={renderItem}
                />
            </View>

            {/* <Button title = "60st topik mock test" onPress={()=>{navigation.push("MockStudy", {order: 60})}}/> */}
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

    mockList: {
        flex: 5,
        flexDirection: 'column'
    },

    mockItem: {
        height: 80,
        borderRadius: 10,
        padding: 16,
        marginVertical: 10,
        backgroundColor: '#D9D9D9',

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

    mockName: {
        fontSize: 24,
    }

});

export default MockListScreen;