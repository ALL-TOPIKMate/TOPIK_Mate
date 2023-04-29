import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AppNameHeader from './component/AppNameHeader';

const TypeScreen = ({ navigation }) => {
  const [showButtons, setShowButtons] = useState(false);

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  }

  return (
    <View>
      <AppNameHeader />
      <View style={styles.buttonRow}>
        <Button title="듣기" onPress={toggleButtons} />
        <Button title="읽기" onPress={toggleButtons} />
        <Button title="쓰기" onPress={toggleButtons} />
      </View>
      {showButtons && (
        <View style={styles.buttonColumn}>
          <Button title="Button 1" onPress={() => { console.log("Button 4 pressed") }} />
          <Button title="Button 2" onPress={() => { console.log("Button 5 pressed") }} />
          <Button title="Button 3" onPress={() => { console.log("Button 6 pressed") }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonColumn: {
    flexDirection: 'column',
  },
});

export default TypeScreen;
