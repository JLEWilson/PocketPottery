import React, { useState } from 'react';
import { View, Button, Text, TextInput, Image,StyleSheet} from 'react-native';
import Modal from "react-native-modal"
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker' 
import type { PotteryItem, Glaze, Clay } from '../models'

const CreatePotteryItemForm: React.FC = () => {
    const [formVisible, setFormVisible] = useState(false)
    const [pieceName, setPieceName] = useState('Piece Name')
    const [image, setImage] = useState<string | null>(null)
    const [imageModalVisible, setImageModalVisible] = useState(false)
    const [clay, setClay] = useState<Clay>() 
    const [currentGlaze, setCurrentGlaze] = useState<Glaze | null>(null)
    const [glazes, setGlazes] = useState<Glaze[]>([])
    const [glazeFormVisible, setGlazeFormVisible ] = useState(false)
  
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

    const addGlaze = (g:  Glaze) => {
        setGlazes(prevGlazes => [...prevGlazes, g])
    }

    const removeGlaze = (g: Glaze) => {
        setGlazes(prevGlazes => prevGlazes.filter(glaze => glaze !== g))
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
                    <View style={styles.clayGroup}>
                        <Picker
                            style={styles.clayDropdown}
                            selectedValue={clay}
                            onValueChange={currentClay => setClay(currentClay)}
                            mode='dropdown' //Check this gain after doing some more styling
                        >
                            <Picker.Item label='Clay1' value={'clayId'}/>
                            <Picker.Item label='Clay2' value={'clayId'}/>
                            <Picker.Item label='Clay3' value={'clayId'}/>
                            <Picker.Item label='Clay4' value={'clayId'}/>
                        </Picker>
                    </View>
                    <View style={styles.glazeGroup}>
                        <Text style={styles.glazesLabel}>Glazes:</Text>
                        <View style={styles.glazesList}>
                            { glazes.map((g: Glaze) => (
                                <View style={styles.glazeContainer}>
                                    <Text key={g.clayId}
                                        style={styles.glazeName}>
                                        {g.name}
                                    </Text>
                                    <Button 
                                        title='(X)'
                                        onPress={() => removeGlaze(g)}
                                    />
                                </View>
                            )) }
                        </View>
                    </View>
                        <View style={styles.glazeDropdown}>
                            <Picker
                            style={styles.glazeDropdown}
                            selectedValue={currentGlaze}
                            onValueChange={g => setCurrentGlaze(g)}
                            mode='dropdown' //Check this gain after doing some more styling
                            >
                                <Picker.Item label='Glaze1' value={'glazeId'}/>
                                <Picker.Item label='Glaze2' value={'glazeId'}/>
                                <Picker.Item label='Glaze3' value={'glazeId'}/>
                                <Picker.Item label='Glaze4' value={'glazeId'}/>
                            </Picker>
                            {
                                currentGlaze != null &&
                                <Button 
                                title='Add Glaze'
                                onPress={ () => addGlaze(currentGlaze) }
                                />
                            }
                            <Button 
                                title='New Glaze'
                                onPress={() => setGlazeFormVisible(true) }
                            />
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
            {/*Glaze Form Modal will go here, will be used in other parts of app add later*/}
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
    },
    clayGroup: {
        flex:1
    },
    clayDropdown: {
        flex:1
    },
    glazeGroup: {
        flex:1
    },
    glazesLabel: {
        flex:1
    },
    glazesList: {
        flex:1
    },
    glazeContainer: {
        flex:1
    },
    glazeName: {
        flex:1
    },
    glazeDropdown: {
        flex:1
    },
})

export default CreatePotteryItemForm