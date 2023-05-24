import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AppNameHeader from './component/AppNameHeader';

const TypeScreen = ({ navigation }) => {
  //const [showButtons, setShowButtons] = useState(false);

  //const toggleButtons = () => {
  //  setShowButtons(!showButtons);
  //}
  const [showListenButtons, setShowListenButtons]=useState(false);
  const [showReadButtons, setShowReadButtons] = useState(false);
  const [showWriteButtons, setShowWriteButtons] = useState(false);
  
  const handleListenButtonPress = () => {
    console.log("Listen Button press");
    setShowListenButtons(true);
    setShowReadButtons(false);
    setShowWriteButtons(false);
  };

  const handleReadButtonPress = () => {
    console.log("Read Button press");
    setShowReadButtons(true);
    setShowListenButtons(false);
    setShowWriteButtons(false);
  };
  const handleWriteButtonPress = () => {
    console.log("Write Button press");
    setShowWriteButtons(true);
    setShowListenButtons(false);
    setShowReadButtons(false);
  };

  return (
    <View>
      <AppNameHeader />
      <View style={styles.buttonRow}>
        <Button color="#91aa9e" title="듣기" onPress={handleListenButtonPress} />
        <Button color="#91aa9e" title="읽기" onPress={handleReadButtonPress} />
        <Button color="#91aa9e" title="쓰기" onPress={handleWriteButtonPress} />
      </View>
      {showListenButtons && (
        <View style={styles.buttonColumn}>
          <Button color="#8caf95" title="듣기 버튼1" onPress={() => {navigation.navigate('TypeQuest') }} />
          <Button color="#8caf95" title="듣기 버튼2" onPress={() => {navigation.navigate('TypeQuest') }} />
          <Button color="#8caf95" title="듣기 버튼3" onPress={() => {navigation.navigate('TypeQuest') }} />
        </View>
      )}
      {showReadButtons && (
        <View style={styles.buttonColumn}>
          <Button color="#8caf95" title="읽기 버튼1" onPress={() => {navigation.navigate('TypeQuest') }} />
          <Button color="#8caf95" title="읽기 버튼2" onPress={() => {navigation.navigate('TypeQuest') }} />
          <Button color="#8caf95" title="읽기 버튼3" onPress={() => {navigation.navigate('TypeQuest') }} />
        </View>
      )}
      {showWriteButtons && (
        <View style={styles.buttonColumn}>
          <Button color="#8caf95" title="쓰기 버튼1" onPress={() => {navigation.navigate('TypeQuest') }} />
          <Button color="#8caf95" title="쓰기 버튼2" onPress={() => {navigation.navigate('TypeQuest') }} />
          <Button color="#8caf95" title="쓰기 버튼3" onPress={() => {navigation.navigate('TypeQuest') }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  buttonColumn: {
    flexDirection: 'column',
    marginBottom: 20,
  },
});

export default TypeScreen;
