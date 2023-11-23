import React, { useState } from 'react';
import { View, Button, Text, TextInput, Image,StyleSheet} from 'react-native';
import Modal from "react-native-modal"
import * as ImagePicker from 'expo-image-picker'

const CreatePotteryItemForm: React.FC = () => {
    const [formVisible, setFormVisible] = useState(false)
    const [pieceName, setPieceName] = useState('Piece Name')
    const [image, setImage] = useState<string | null>(null)
    const [imageModalVisible, setImageModalVisible] = useState(false)
    
    const pickImage = async () => {
        setImageModalVisible(false)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    const openCamera = async () => {
        setImageModalVisible(false)
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
        if (permissionResult.granted === false) {
            console.log("You've refused to allow this appp to access your camera!")
            return;
        }
        const result = await ImagePicker.launchCameraAsync()
        if (!result.canceled) {
        setImage(result.assets[0].uri)
        console.log(result.assets[0].uri)
        }
    }

    return (
        <View>
            <View style={styles.modalOpenButton}>
                <Button
                    onPress={() => setFormVisible(true)}
                    title="Add New Piece"
                    color="#841584"
                    accessibilityLabel="open pottery project form"
                />
            </View>
            <Modal 
                isVisible={formVisible} 
                animationIn={"bounceIn"}
                animationOut={"bounceOut"}
            >
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>New Piece</Text>
                    <TextInput 
                        style={styles.nameInput}
                        onChangeText={setPieceName}
                        value={pieceName}
                    />
                    <View style={styles.imageContainer}>
                        <Button title="Add Image" onPress={() => setImageModalVisible(true)} />
                        {image && <Image source={{ uri: image }} style={styles.image} />}
                    </View>
                </View>
            </Modal>
            <Modal
                isVisible={imageModalVisible}
                animationIn={"bounceIn"}
                animationOut={"bounceOut"}
            >
                <View style={styles.imageModalContainer}>
                    <Button title="Camera roll" onPress={pickImage} />
                    <Button title="Pick an image from camera roll" onPress={pickImage} />
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalOpenButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    innerContainer: {
        backgroundColor: 'blue',
        flex: 1,
    },
    title: {
        alignSelf: 'center',
        fontSize: 24,
        marginVertical: 8
    },
    nameInput: {
        alignSelf: 'center',
        fontSize: 24
    },
    imageContainer: {
        height: 30,
        width: 30
    },
    image: {
        height: 30,
        width: 30
    },
    imageModalContainer: {
        height: 50,
        width: 50
    }
})

export default CreatePotteryItemForm