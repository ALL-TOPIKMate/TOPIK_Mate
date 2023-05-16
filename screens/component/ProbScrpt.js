import React from "react";
import { Text, View, StyleSheet } from "react-native";


export default ProbScrpt = (props) =>{
    return (
        <View>
            <View style = {styles.textBox}>
                <Text>
                    {props.PRB_SCRPT}
                </Text>
            </View>

            <Text/>
        </View>
    );
}

const styles = StyleSheet.create({
    textBox:{
        backgroundColor: "#D9D9D9",
        padding: 16, 
        
        borderWidth: 1,
        borderColor: "black",
    }
})