import React from 'react';
import {Text,View,FlatList,StyleSheet,StatusBar} from 'react-native';
const data = [
  { id: '1', title: '제목 1', content: '테스트', date:'2023-05-01' },
  { id: '2', title: '제목 2', content: '글 내용 2', date: '2023-05-06'},
  { id: '3', title: '제목 3', content: '글 내용 3',date: '2023-05-10'},
  { id: '4', title: '제목 4', content: '글 내용 4', date: '2023-05-15'},
  { id: '5', title: '제목 5', content: '글 내용 5' , date: '2023-05-16'},
  { id: '6', title: '제목 6', content: '글 내용 6',date: '2023-05-20' },
  { id: '7', title: '제목 7', content: '글 내용 7',date: '2023-05-21'},
  { id: '8', title: '제목 8', content: '글 내용 8' ,date: '2023-05-22'},
  { id: '9', title: '제목 9', content: '글 내용 9' ,date: '2023-05-23'},
  { id: '10', title: '제목 10', content: '글 내용10', date: '2023-05-26'},
];
const Item = ({title, content, date}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.content}> {content} </Text>
    <Text style={styles.date}> {date} </Text>
  </View>
);
const Notice = ({ navigation }) => {
  const renderItem = ({ item }) => <Item title={item.title} content={item.content} date={item.date} />;
  const reversedData = [...data].reverse();  
  return (
      <View>
        <Text style={styles.titleBig}>공지사항</Text>
        <FlatList
        data={reversedData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#cccc99',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    titleBig:{
      fontSize: 30,
      boldText: {
        fontWeight: 'bold'
      },
    },
    title: {
      fontSize: 25,
    },
    content:{
      fontSize: 17,
    },
    date: {
      fontSize: 13,
      textAlign: 'right',
    }
  });
  
export default Notice;