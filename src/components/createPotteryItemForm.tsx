import React, { useState } from 'react'
import 'react-native-get-random-values'
import { View, Button, Text, TextInput, Image, StyleSheet, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import type { PotteryItem, Glaze, Clay } from '../models'
import { v4 as uuidv4 } from 'uuid'

const CreatePotteryItemForm: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false)
  const [pieceName, setPieceName] = useState('Piece Name')
  const [image, setImage] = useState<string | null>(null)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [clay, setClay] = useState<Clay>()
  const [currentGlaze, setCurrentGlaze] = useState<Glaze | null>(null)
  const [glazes, setGlazes] = useState<Glaze[]>([])
  const [glazeFormVisible, setGlazeFormVisible] = useState(false)

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
      console.log("You've refused to allow this app to access your camera!")
      return
    }
    const result = await ImagePicker.launchCameraAsync()
    if (!result.canceled) {
      setImage(result.assets[0].uri)
      console.log(result.assets[0].uri)
    }
  }

  const addGlaze = (g: Glaze) => {
    setGlazes((prevGlazes) => [...prevGlazes, g])
  }

  const removeGlaze = (g: Glaze) => {
    setGlazes((prevGlazes) => prevGlazes.filter((glaze) => glaze !== g))
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
      <Modal isVisible={formVisible} animationIn={'bounceIn'} animationOut={'bounceOut'}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>New Piece</Text>
          <TextInput style={styles.nameInput} onChangeText={setPieceName} value={pieceName} />
          <View style={styles.imageContainer}>
            <Pressable style={styles.addImage} onPress={() => setImageModalVisible(true)}>
              <Text style={styles.addImageText}>Add Image</Text>
            </Pressable>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>

          <View style={styles.clayGroup}>
            <Picker
              style={styles.clayDropdown}
              selectedValue={clay}
              onValueChange={(currentClay) => setClay(currentClay)}
              //Check this again after doing some more styling
            >
              <Picker.Item
                label="Clay1"
                value={{
                  clayId: 'clay1',
                  name: 'clay1',
                  manufacturer: 'clay1Maker',
                  notes: 'a nice clay',
                }}
                key={uuidv4()}
              />
              <Picker.Item
                label="Clay2"
                value={{
                  clayId: 'clay2',
                  name: 'clay2',
                  manufacturer: 'clay2Maker',
                  notes: 'a cool clay',
                }}
                key={uuidv4()}
              />
              <Picker.Item
                label="Clay3"
                value={{
                  clayId: 'clay3',
                  name: 'clay3',
                  manufacturer: 'clay3Maker',
                  notes: 'a bad clay',
                }}
                key={uuidv4()}
              />
              <Picker.Item
                label="Clay4"
                value={{
                  clayId: 'clay4',
                  name: 'clay4',
                  manufacturer: 'clay4Maker',
                  notes: 'a clay',
                }}
                key={uuidv4()}
              />
            </Picker>
          </View>

          <View style={styles.glazeGroup}>
            <View style={styles.glazeDropdown}>
              <Picker
                style={styles.glazeDropdown}
                itemStyle={{ backgroundColor: 'blue' }}
                selectedValue={currentGlaze}
                onValueChange={(g) => setCurrentGlaze(g)}
              >
                <Picker.Item
                  label="Glaze1"
                  value={{
                    clayId: 'glaze1',
                    name: 'glaze1',
                    manufacturer: 'glaze1Maker',
                    notes: 'a nice glaze',
                  }}
                  key={uuidv4()}
                />
                <Picker.Item
                  label="Glaze2"
                  value={{
                    clayId: 'glaze2',
                    name: 'glaze2',
                    manufacturer: 'glaze2Maker',
                    notes: 'a cool glaze',
                  }}
                  key={uuidv4()}
                />
                <Picker.Item
                  label="Glaze3"
                  value={{
                    clayId: 'glaze3',
                    name: 'glaze3',
                    manufacturer: 'glaze3Maker',
                    notes: 'a bad glaze',
                  }}
                  key={uuidv4()}
                />
                <Picker.Item
                  label="Glaze4"
                  value={{
                    clayId: 'glaze4',
                    name: 'glaze4',
                    manufacturer: 'glaze4Maker',
                    notes: 'a glaze',
                  }}
                  key={uuidv4()}
                />
              </Picker>
              {currentGlaze != null && (
                <Button title="Add Glaze" onPress={() => addGlaze(currentGlaze)} />
              )}
              <Button title="New Glaze" onPress={() => setGlazeFormVisible(true)} />
            </View>
            <Text style={styles.glazesLabel}>Glazes:</Text>
            <View style={styles.glazesList}>
              {glazes.map((g: Glaze) => (
                <View key={uuidv4()} style={styles.glazeContainer}>
                  <Text key={g.glazeId} style={styles.glazeName}>
                    {g.name}
                  </Text>
                  <Button title="(X)" onPress={() => removeGlaze(g)} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={imageModalVisible}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        onBackdropPress={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          <Pressable style={styles.imageModalButton} onPress={openCamera}>
            <Text style={styles.imageModalButtonText}>New Image</Text>
          </Pressable>
          <Pressable style={styles.imageModalButton} onPress={pickImage}>
            <Text style={styles.imageModalButtonText}>Camera Roll</Text>
          </Pressable>
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
    marginVertical: 8,
  },
  nameInput: {
    alignSelf: 'center',
    fontSize: 24,
  },
  imageContainer: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    textAlign: 'center',
    fontSize: 16,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  imageModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageModalButton: {
    backgroundColor: 'red',
    height: 30,
    width: 100,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageModalButtonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  clayGroup: {
    backgroundColor: 'yellow',
  },
  clayDropdown: {
    backgroundColor: 'teal',
  },
  glazeGroup: {
    flex: 1,
  },
  glazesLabel: {},
  glazesList: { flex: 1 },
  glazeContainer: {
    flex: 1,
  },
  glazeName: {
    flex: 1,
  },
  glazeDropdown: {
    flex: 1,
  },
})

export default CreatePotteryItemForm
