import React from "react";
import { Text, View, StyleSheet } from "react-native";


export default ProbTxt = (props) =>{
    return (
        <View>
            <View style = {styles.textBox}>
                <Text>
                  {props.PRB_TXT}
              </Text>
            </View>

            <Text />
            <Text />
        </View>
    );
}

const styles = StyleSheet.create({
    textBox: {
        backgroundColor: "#D9D9D9",
        padding: 16,
        
        borderWidth: 1,
        borderColor: "black",

        flexShrink: 1
    }
})