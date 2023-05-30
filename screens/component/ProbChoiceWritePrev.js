import React, {useState, useEffect, useRef} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native'

export default ProbChoiceWritePrev = (props) =>{
    return (
        <View>
            <View>
                <Text style = {{fontSize: 16, paddingVertical: 4}}> Your Answer</Text>
                <View style = {styles.viewBox}>
                    <View>
                        <Text> {props.PRB_USER_ANSW} </Text>
                    </View>
                </View>     
            </View>
   
            <Text />
            <View>
                <Text style = {{fontSize: 16, paddingVertical: 4}}> Best Answer</Text>
                <View style = {styles.viewBox}>
                    <View>
                        <Text> {props.PRB_CORRT_ANSW} </Text>
                    </View>
                </View>
            </View>

            <Text />
            <View style = {styles.viewBox}>
                <Text>채점기준 박스</Text>
            </View>

            
            <Text />
            <Text />

            <View style = {{flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity onPress = {() => {props.setNextBtn(props.nextBtn-1)}} disabled={(props.nextBtn == 0) ? (true) : (false)} style = {[styles.btn, {backgroundColor: (props.nextBtn == 0) ? ("#D9D9D9") : ("#94AF9F")}]}>
                    <Text style = {{color: "black", textAlign: "center"}}>PREV</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress = {() => {props.setNextBtn(props.nextBtn+1)}} disabled = {(props.nextBtn == props.size-1) ? (true) : (false)} style = {[styles.btn, {backgroundColor: (props.nextBtn == props.size-1) ? ("#D9D9D9") : ("#94AF9F")}]}>
                    <Text style = {{color: "black", textAlign: "center"}}>NEXT TO</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBox: {
        backgroundColor: "#D9D9D9", 
        padding: 16,
        paddingVertical: 64,

        borderWidth: 1,
        borderColor: "black", 
        flexShrink: 1,
    },

    btn: {
        width: 100,
        paddingVertical: 16,
        borderRadius: 20
    }
})