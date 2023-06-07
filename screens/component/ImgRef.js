import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Button, Image} from 'react-native'

import firebase from '@react-native-firebase/app';
import { getStorage } from '@react-native-firebase/storage'; // include storage module besides Firebase core(firebase/app)

const ImgRef = (props) => {

    const storage = getStorage(firebase);
    
    // 이미지 로드
    const imageRef = storage.ref().child(`/images`);
    const [images, setImages] = useState({});
    const [isImage, setIsImage] = useState(false)

    useEffect(()=>{
        async function imagesLoading() {
            try {
                const PRB_ID = props.PRB_ID
                const PRB_RSC = PRB_ID.substr(0, PRB_ID.length-3) // 문제 번호를 제외한 회차정보
    
                // console.log(PRB_RSC)
                let image = {}
                await imageRef.child(`/${PRB_RSC}/${props.IMG_REF}`).getDownloadURL().then((url) => {
                    image["IMG_REF"] = url
                })
    
                setImages(image)
            } catch(err) {
                console.log(err);
            }
        }

        imagesLoading()
    }, [])

    useEffect(()=>{
        // console.log(images)
        setIsImage(true)
    }, [images])

    return (
        <View>
            {
                isImage ?(
                    <Image
                        style={{height: 250}}
                        resizeMode = "contain"
                        source={{uri: images['IMG_REF']}}
                    />
                ): null

            }
            <Text/>
        </View>
    )
}

export default ImgRef