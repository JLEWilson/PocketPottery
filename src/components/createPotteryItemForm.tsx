import React, { useState } from 'react'
import 'react-native-get-random-values'
import { View, Button, Text, TextInput, Image, StyleSheet, Pressable, ImageBackground } from 'react-native'
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import type { PotteryItem, Glaze, Clay, PotteryItemPictures, PotteryItemMeasurements } from '../models'
import { v4 as uuidv4 } from 'uuid'
import { addPotteryItem } from '../services/potteryItem-service'
import type { SQLiteDatabase } from 'expo-sqlite'
import { getDBConnection } from '../services/db-service'
import { coneTemperatures } from '../constants/coneTemperatures'

const glazeOptions = [
  {
    glazeId: 'glaze1',
    name: 'glaze1',
    manufacturer: 'glaze1Maker',
    notes: 'a nice glaze',
  },
  {
    glazeId: 'glaze2',
    name: 'glaze2',
    manufacturer: 'glaze2Maker',
    notes: 'a nice glaze',
  },
  {
    glazeId: 'glaze3',
    name: 'glaze3',
    manufacturer: 'glaze3Maker',
    notes: 'a nice glaze',
  },
]
const clayOptions = [
  {
    clayId: 'clay1',
    name: 'clay1',
    manufacturer: 'clay1Maker',
    notes: 'a nice clay',
  },
  {
    clayId: 'clay2',
    name: 'clay2',
    manufacturer: 'clay2Maker',
    notes: 'a nice clay',
  },
  {
    clayId: 'clay3',
    name: 'clay3',
    manufacturer: 'clay3Maker',
    notes: 'a nice clay',
  },
]

const CreatePotteryItemForm: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false)
  const [pieceName, setPieceName] = useState('New Piece')
  const [image, setImage] = useState<string | null>(null)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [clay, setClay] = useState<Clay | null>(null)
  const [clays, setClays] = useState<Clay[]>([])
  const [clayFormVisible, setClayFormVisible] = useState(false)
  const [currentGlaze, setCurrentGlaze] = useState<Glaze | null>(null)
  const [glazes, setGlazes] = useState<Glaze[]>([])
  const [glazeFormVisible, setGlazeFormVisible] = useState(false)
  const [measurementFormVisible, setMeasurementFormVisible] = useState(false)
  const [measurementName, setMeasurementName] = useState('')
  const [measurementValue, setMeasurementValue] = useState('')
  const [measurements, setMeasurements] = useState<{name:string, value:number}[]>([])
  const [fireType, setFireType] = useState('Cone')

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

  const addClay = (c: Clay) => {
    if(clays.includes(c)) return
    setClays((prevClays) => [...prevClays, c])
  }

  const removeClay = (c: Clay) => {
    setClays((prevClays) => prevClays.filter((c) => clay !== c))
  }

  const addGlaze = (g: Glaze) => {
    if(glazes.includes(g)) return
    setGlazes((prevGlazes) => [...prevGlazes, g])
  }

  const removeGlaze = (g: Glaze) => {
    setGlazes((prevGlazes) => prevGlazes.filter((glaze) => glaze !== g))
  }

  const addMeasurement = () => {
    const newMeasurement = {
      name: measurementName, 
      value: parseInt(measurementValue)
    }
    setMeasurements((prev) => [...prev, newMeasurement])
  }

  const createPotteryItem = (db: SQLiteDatabase, newPotteryItemID: string) => {
    const now = new Date()
    const potteryItemToAdd: PotteryItem = {
      potteryItemId: newPotteryItemID,
      dateCreated: now.toISOString(),
      dateEdited: now.toISOString(),
      projectTitle: pieceName,
      projectNotes: "",
      displayPicturePath: image ? image: ""  
    }
    addPotteryItem(db, potteryItemToAdd)
  }

  const createPotteryItemPicture = (db: SQLiteDatabase, newPotteryItemId: string) => {
    const potteryItemPictureToAdd: PotteryItemPictures = {
      pictureId: uuidv4(),
      potteryItemId: newPotteryItemId,
      picturePath: image ? image : "undefined",
    }
    //Use Service to Submit
  }

  const createPotteryItemClays = (db: SQLiteDatabase, newPotteryItemId: string) => {
    //use Service to submit
  }

  const createPotteryItemGlazes = (db: SQLiteDatabase, newPotteryItemId: string) => {
    glazes.forEach((g) => {
      //Use Service to Submit
      g.glazeId
    })
  }

  const createPotteryItemMeasurements = (db: SQLiteDatabase, newPotteryItemId: string) => {
    //use Service to submit
  }

  const handleSubmitForm = async () => {
    const db = await getDBConnection()
    const newPotteryItemId = uuidv4()
    //PotteryItem
    createPotteryItem(db, newPotteryItemId)

    //Pictures
    createPotteryItemPicture(db, newPotteryItemId)
    //PotteryItemClays
    createPotteryItemClays(db, newPotteryItemId)
    //PotteryItemGlazes
    createPotteryItemGlazes(db, newPotteryItemId)

    //NEXT NEEDS FORM INPUTS
    //PotteryItemMeasurements

    //PotteryItemBisqueFireTemp

    //PotteryItemGlazeFireTemp

    //PotteryItemTechniques

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
          
          {/*title*/}
          <TextInput style={styles.nameInput} onChangeText={setPieceName} value={pieceName} />
          
          {/*image*/}
          <View style={styles.imageContainer}>
            {image ? 
              <ImageBackground style={styles.addImage} imageStyle={styles.addImage} source={{uri: image}}>
                <Pressable  onPress={() => setImageModalVisible(true)}>
                  <Text style={styles.addImageText}>Change Image</Text>
                </Pressable>
              </ImageBackground>
              :
              <Pressable style={styles.addImage} onPress={() => setImageModalVisible(true)}>
                <Text style={styles.addImageText}>Add Image</Text>
              </Pressable>
            }
          </View>

          {/*clay*/}
          <View style={styles.clayGroup}>
            <Picker
              style={styles.clayDropdown}
              selectedValue={clay?.clayId || null}
              onValueChange={(value) => {
                const selectedClay = clayOptions.find((c) => c.clayId === value);
                setClay(selectedClay || null);}
              }
            >
              <Picker.Item
                label='Choose a Clay'
                value='No Clay Chosen'
                key='default'
              />
              {clayOptions.map((clay) => (
                <Picker.Item
                  label={clay.name}
                  value={clay.clayId}
                  key={clay.clayId}
                />
              ))}
            </Picker>
            <View style={styles.glazeButtonContainer}>
              <Pressable style={styles.addGlazeButton}  onPress={() => clay && addClay(clay)} >
                <Text>"Add Clay"</Text>  
              </Pressable>
              <Pressable style={styles.addGlazeButton}  onPress={() => setClayFormVisible(true)} >
                <Text>"New Clay"</Text>  
              </Pressable>
            </View>
          </View>
          
          {/*glazes*/}
          <View style={styles.glazeGroup}>
            <View style={styles.glazeDropdown}>
              <Picker
                style={styles.glazeDropdown}
                selectedValue={currentGlaze?.glazeId || null}
                onValueChange={(value) => {
                  const selectedGlaze = glazeOptions.find((glaze) => glaze.glazeId === value);
                  setCurrentGlaze(selectedGlaze || null);}
                }
              >
                <Picker.Item
                label='Choose a Glaze'
                value='No Glaze Chosen'
                key='default'
              />
                {glazeOptions.map((glaze) => (
                  <Picker.Item
                    label={glaze.name}
                    value={glaze.glazeId}
                    key={glaze.glazeId}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.glazeButtonContainer}>
              <Pressable style={styles.addGlazeButton}  onPress={() => currentGlaze && addGlaze(currentGlaze)} >
                <Text>"Add Glaze"</Text>  
              </Pressable>
              <Pressable style={styles.addGlazeButton}  onPress={() => setGlazeFormVisible(true)} >
                <Text>"New Glaze"</Text>  
              </Pressable>
            </View>
            <Text style={styles.glazesLabel}>Clays:</Text>
            <View style={styles.glazesList}>
              {clays.map((c: Clay) => (
                <View key={c.clayId + ' view'} style={styles.glazeContainer}>
                  <Text key={c.clayId + ' text'} style={styles.glazeName}>
                    {c.name}
                  </Text>
                  <Pressable style={styles.removeGlazeButton} onPress={() => removeClay(c)}>
                    <Text style={styles.removeGlazeButtonText}>X</Text>
                  </Pressable>
                </View>
              ))}
            </View>
            <Text style={styles.glazesLabel}>Glazes:</Text>
            <View style={styles.glazesList}>
              {glazes.map((g: Glaze) => (
                <View key={uuidv4()} style={styles.glazeContainer}>
                  <Text key={g.glazeId} style={styles.glazeName}>
                    {g.name}
                  </Text>
                  <Pressable style={styles.removeGlazeButton} onPress={() => removeGlaze(g)}>
                    <Text style={styles.removeGlazeButtonText}>X</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {/*Measurements*/}
          <View style={styles.measurementsGroup}>
            <Text>Measurements:</Text>
            <View>
              {measurements.map((m) => (
                <View>
                  <Text>{m.name + ':'}</Text>
                  <Text>{'  ' + m.value}</Text>
                </View>
              ))}
            </View>
            <Pressable style={styles.addGlazeButton} onPress={() => setMeasurementFormVisible(true)}>
              <Text style={styles.addMeasurementButtonText}>Add Measurement</Text>
            </Pressable>
          </View>
          
          {/*Fire Temps*/}
          <View>
            <Text>Fire Type:</Text>
            <Picker
                style={{backgroundColor: 'green'}}
                selectedValue={fireType}
                onValueChange={setFireType}
            >
              <Picker.Item 
                label='Cone'
                value={"Cone"}
                key={"fireType: Cone"}
              />
              <Picker.Item 
                label='Raku'
                value={"Raku"}
                key={"fireType: Raku"}
              />
            </Picker>
            {
              fireType == "Cone" &&
              <View>
                <Text>Temperature:</Text>
                <Picker
                    style={{backgroundColor: 'green'}}
                    selectedValue={fireType}
                    onValueChange={setFireType}
                >
                  {Object.entries(coneTemperatures).map(([key, value]) => (
                    <Picker.Item 
                      label={key + ": " + value.fahrenheit + "f"}
                      value={key}
                      key={key}
                    />
                  ))}
                </Picker>
              </View>
            }
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
      <Modal
        isVisible={measurementFormVisible} 
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        onBackdropPress={() => setMeasurementFormVisible(false)} 
      >
        <View style={{backgroundColor: 'green', gap:5}}>
          <View>
            <Text style={{marginHorizontal: 5}}>Name</Text>
            <TextInput 
              style={{backgroundColor: 'white', margin:10, padding: 5}}
              onChangeText={setMeasurementName}
            />
          </View>
          <View>
            <Text style={{marginHorizontal: 5}}>Value</Text>
            <TextInput 
              keyboardType='number-pad'
              style={{backgroundColor: 'white', margin:10, padding: 5}}
              onChangeText={setMeasurementValue}
            />
          </View>
          <Pressable style={styles.addGlazeButton} onPress={addMeasurement}>
            <Text>Add Measurement</Text>
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
  glazeButtonContainer: {
    width:'auto',
    backgroundColor:'red', 
    flexDirection:'row-reverse'
  },
  addGlazeButton:{
    borderRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    padding: 4,
    width: 100,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'green'
  },
  glazesLabel: {
    fontSize: 15
  },
  glazesList: { 
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  glazeContainer: {
    flexDirection: 'row',
  },
  glazeName: {
    margin: 5,
    textAlign: 'center',
  },
  glazeDropdown: {},
  removeGlazeButton: {
    backgroundColor: 'green',
    width: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 2,
  },
  removeGlazeButtonText: {
    fontSize: 18,
  },
  measurementsGroup: {
    flex: 1
  },
  addMeasurementButton: {

  },
  addMeasurementButtonText: {
    fontSize:15
  }
})

export default CreatePotteryItemForm
