import React, { useState } from 'react'
import 'react-native-get-random-values'
import {
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
} from 'react-native'
import Modal from 'react-native-modal'
import ClaysList from './ClaysList'
import GlazesList from './GlazesList'
import * as ImagePicker from 'expo-image-picker'
import {
  type PotteryItem,
  type Glaze,
  type Clay,
  type PotteryItemPictures,
  type PotteryItemMeasurements,
  PotteryItemFirings,
} from '../models'
import { v4 as uuidv4 } from 'uuid'
import { addPotteryItem } from '../services/potteryItem-service'
import type { SQLiteDatabase } from 'expo-sqlite'
import { useDatabase } from '../services/db-context'
import NewMeasurement from './NewMeasurement'
import globalStyles from '../globalStyles/stylesheet'
import NewFiring from './NewFiring'


const NewPotteryItem: React.FC = () => {
  const DB = useDatabase();
  
  const [formVisible, setFormVisible] = useState(false)
  const [pieceName, setPieceName] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [currentClay, setCurrentClay] = useState<Clay | null>(null)
  const [clays, setClays] = useState<Clay[]>([])
  const [clayFormVisible, setClayFormVisible] = useState(false)
  const [currentGlaze, setCurrentGlaze] = useState<Glaze | null>(null)
  const [glazes, setGlazes] = useState<Glaze[]>([])
  const [glazeFormVisible, setGlazeFormVisible] = useState(false)
  const [measurementFormVisible, setMeasurementFormVisible] = useState(false)
  const [measurements, setMeasurements] = useState<Pick<PotteryItemMeasurements, "name" | "scale" | "system">[]>([])
  const [firingFormVisible, setFiringFormVisible] = useState(false)
  const [firings, setFirings] = useState<Pick<PotteryItemFirings,  | 'fireType' | 'cone' | 'fireStyle'>[]>([])
  const [notes, setNotes] = useState('')

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
      console.log("Change to warning? You've refused to allow this app to access your camera!")
      return
    }
    const result = await ImagePicker.launchCameraAsync()
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const addClay = (c: Clay) => {
    setClayFormVisible(false)
    if (clays.includes(c)) return
    setClays((prevClays) => [...prevClays, c])
  }

  const removeClay = (c: Clay) => {
    setClays((prevClays) => prevClays.filter((c) => currentClay !== c))
  }

  const addGlaze = (g: Glaze) => {
    setGlazeFormVisible(false)
    if (glazes.includes(g)) return
    setGlazes((prevGlazes) => [...prevGlazes, g])
  }

  const removeGlaze = (g: Glaze) => {
    setGlazes((prevGlazes) => prevGlazes.filter((glaze) => glaze !== g))
  }

  const addMeasurement = (measurement: Pick<PotteryItemMeasurements, "name" | "scale" | "system">) => {
    setMeasurementFormVisible(false)
    const newMeasurement = {
      name: measurement.name,
      scale: measurement.scale,
      system: measurement.system,
    }
    if(measurements.includes(newMeasurement)) return
    setMeasurements((prev) => [...prev, newMeasurement])
  }
  const removeMeasurement = (m: Pick<PotteryItemMeasurements, "name" | "scale" | "system">) => {
    setMeasurements((prev) => prev.filter((measurement) => measurement !== m))
  }
  const addFiring = (firing: Pick<PotteryItemFirings, 'fireType' | 'fireStyle' | 'cone'> ) => {
    setFiringFormVisible(false)
    const newFiring = {
      fireStyle: firing.fireStyle,
      fireType: firing.fireType,
      cone: firing.cone,
    }
    if(firings.includes(newFiring)) return
    setFirings((prev) => [...prev, newFiring])
  }
  const removeFiring = (f: Pick<PotteryItemFirings,  'fireType' | 'fireStyle' | 'cone'>) => {
    setFirings((prev) => prev.filter((firing) => firing !== f))
  }

  const createPotteryItem = (db: SQLiteDatabase, newPotteryItemID: string) => {
    const now = new Date()
    const potteryItemToAdd: PotteryItem = {
      potteryItemId: newPotteryItemID,
      dateCreated: now.toISOString(),
      dateEdited: now.toISOString(),
      projectTitle: pieceName,
      projectNotes: '',
      displayPicturePath: image ? image : '',
    }
    addPotteryItem(db, potteryItemToAdd)
  }

  const createPotteryItemPicture = (db: SQLiteDatabase, newPotteryItemId: string) => {
    const potteryItemPictureToAdd: PotteryItemPictures = {
      pictureId: uuidv4(),
      potteryItemId: newPotteryItemId,
      picturePath: image ? image : 'undefined',
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
    const newPotteryItemId = uuidv4()
    //PotteryItem
    createPotteryItem(DB, newPotteryItemId)
    //Pictures
    createPotteryItemPicture(DB, newPotteryItemId)
    //PotteryItemClays
    createPotteryItemClays(DB, newPotteryItemId)
    //PotteryItemGlazes
    createPotteryItemGlazes(DB, newPotteryItemId)

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
          <View style={[styles.group, {height: 70, width: 'auto'}]}>
            <Text style={styles.label}>Project Title</Text>
            <TextInput style={styles.nameInput} onChangeText={setPieceName} placeholder='Name' value={pieceName}/>
          </View>
          {/*image*/}
          <View style={styles.imageContainer}>
            {image ? (
              <View style={{ flex:1 , justifyContent: 'center', alignItems: 'center' }}>
                <ImageBackground
                  style={[styles.addImage]}
                  resizeMode='cover'
                  source={{ uri: image }}
                  >
                  <Pressable onPress={() => setImageModalVisible(true)}>
                    <Text style={styles.addImageText}>Change Image</Text>
                  </Pressable>
                </ImageBackground>
              </View>
            ) : (
              <Pressable style={styles.addImage} onPress={() => setImageModalVisible(true)}>
                <Text style={styles.addImageText}>Add Image</Text>
              </Pressable>
            )}
          </View>
{/*Clays*/}
          <View style={styles.group}>
            <Text style={styles.label}>Clays:</Text>
            { 
              clays.length > 0 ?
              <Text style={styles.reminderText}>(Tap To Remove)</Text>
              :
              <Text style={styles.reminderText}>(Optional)</Text>
            }
            <ScrollView style={styles.listOutput}>
              {clays.map((c: Clay) => (
                <Pressable key={c.clayId + ' button'} style={styles.deleteButton} onPress={() => removeClay(c)}>
                  <Text key={c.clayId + ' text'} style={styles.deleteButtonText}>
                    {c.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={[styles.buttonContainer, { justifyContent: 'center'}]}>
              <Pressable
                style={[globalStyles.button, styles.button, { display: 'flex', paddingVertical: 4, paddingHorizontal: 15, marginTop: 4}]}
                onPress={() => setClayFormVisible(true)}
              >
                <Text style={styles.buttonText}>Add Clay</Text>
              </Pressable>
            </View>
          </View>
{/*Glazes*/}
          <View style={styles.group}>
            <Text style={styles.label}>Glazes:</Text>
            { 
              glazes.length > 0 ?
              <Text style={styles.reminderText}>(Tap To Remove)</Text>
              :
              <Text style={styles.reminderText}>(Optional)</Text>
            }
            <View style={styles.listOutput}>
              {glazes.map((g: Glaze) => (
                <Pressable key={g.glazeId + ' button'} style={styles.deleteButton} onPress={() => removeGlaze(g)}>
                <Text key={g.glazeId + ' text'} style={styles.deleteButtonText}>
                  {g.name}
                </Text>
              </Pressable>
              ))}
            </View>
            <View style={[styles.buttonContainer, { justifyContent: 'center', }]}>
              <Pressable
                style={[globalStyles.button, styles.button, { display: 'flex', paddingVertical: 4, paddingHorizontal: 15, marginTop: 4}]}
                onPress={() => setGlazeFormVisible(true)}
              >
                <Text style={styles.buttonText}>Add Glaze</Text>
              </Pressable>
            </View>
          </View>
{/*Measurements*/}
          <View style={styles.group}>
            <Text style={styles.label}>Measurements:</Text>
            { 
              measurements.length > 0 ?
              <Text style={styles.reminderText}>(Tap To Remove)</Text>
              :
              <Text style={styles.reminderText}>(Optional)</Text>
            }
            <View style={styles.listOutput}>
              {measurements.map((m) => (
                <Pressable 
                  key={m.name + 'Pressable'}
                  style={[styles.deleteButton, {flexDirection: 'row'}]} 
                  onPress={() => removeMeasurement(m)}
                >
                  <Text style={styles.deleteButtonText} key={m.name + 'name text'}>{m.name + ': ' + m.scale}</Text>
                </Pressable>
              ))}
            </View>
            <View style={[styles.buttonContainer, {justifyContent: 'center'}]}>
              <Pressable style={[globalStyles.button, styles.button, { display: 'flex', paddingVertical: 4, paddingHorizontal: 15, marginTop: 4}]} onPress={() => setMeasurementFormVisible(true)}>
                <Text style={styles.buttonText}>Add Measurement</Text>
              </Pressable>
            </View>
          </View>
{/*Firings*/}
          <View style={styles.group}>
            <Text style={styles.label}>Firings</Text>
            { 
              firings.length > 0 ?
              <Text style={styles.reminderText}>(Tap To Remove)</Text>
              :
              <Text style={styles.reminderText}>(Optional)</Text>
            }
            <View style={styles.listOutput}>
              {firings.map((f, index) => (
                <Pressable 
                  key={index + f.cone + f.fireType + 'view'} 
                  style={[styles.deleteButton, {flexDirection: 'row'}]}
                  onPress={() => removeFiring(f)}
                >
                  <Text key={f.cone + f.fireType + 'text'} style={styles.deleteButtonText}>
                    {f.fireStyle != 'Environmental'
                      ? f.fireType + ': ' + 'Cone ' + f.cone
                      : f.fireType + ': ' + f.fireStyle}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={[styles.buttonContainer, {justifyContent: 'center'}]}>
              <Pressable style={[globalStyles.button, styles.button,  { display: 'flex', paddingVertical: 4, paddingHorizontal: 15, marginTop: 4}]} 
                onPress={() => setFiringFormVisible(true)}
              >
                <Text style={styles.buttonText}>Add Firing</Text>
              </Pressable>
            </View>
          </View>
          {/* Notes*/}
          <View style={[styles.group, {height: 120, width: 'auto'}]}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.reminderText}>(Optional)</Text>
            <TextInput 
              textAlignVertical='center'
              textAlign='center'
              style={[styles.notesInput]} 
              multiline={true} 
              blurOnSubmit={true} 
              onChangeText={setNotes} 
              value={notes}/>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable style={[globalStyles.button, styles.button, {padding: 8}]}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>Add New Project</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
{/*Image Modal*/}
      <Modal
        isVisible={imageModalVisible}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        onBackdropPress={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          <Pressable style={styles.button} onPress={openCamera}>
            <Text style={styles.buttonText}>New Image</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Camera Roll</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal
        isVisible={measurementFormVisible}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        onBackdropPress={() => setMeasurementFormVisible(false)}
      >
        <NewMeasurement callbackFunction={addMeasurement}/> 
      </Modal>
{/*Clays Modal*/}
      <Modal  
        isVisible={clayFormVisible}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        backdropOpacity={.9}
        onBackButtonPress={() => setClayFormVisible(false)}
        onBackdropPress={() => setClayFormVisible(false)}
      > 
        <View style={{flex: 1}}>
          <ClaysList onClaySelect={setCurrentClay} >
              <Pressable 
                onPress={() => {currentClay && addClay(currentClay)}}
                style={[styles.button, globalStyles.button, {padding: 8}]}
                >
                <Text style={[globalStyles.buttonText, {fontWeight: 'bold'}]}>Add Clay To Project</Text>
              </Pressable>
          </ClaysList>
        </View>
      </Modal>
{/*Glaze Modal*/}
      <Modal  
        isVisible={glazeFormVisible}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        backdropOpacity={.9}
        onBackButtonPress={() => setGlazeFormVisible(false)}
        onBackdropPress={() => setGlazeFormVisible(false)}
      > 
        <View style={{flex: 1}}>
          <GlazesList onGlazeSelect={setCurrentGlaze} >
            <Pressable 
              onPress={() => {currentGlaze && addGlaze(currentGlaze)}}
              style={[styles.button, globalStyles.button, {padding: 8}]}
              >
              <Text style={[globalStyles.buttonText, {fontWeight: 'bold'}]}>Add Glaze To Project</Text>
            </Pressable>
          </GlazesList>
        </View>
      </Modal>
{/*Firings Modal*/}
      <Modal 
        isVisible={firingFormVisible}
        onBackButtonPress={() => setFiringFormVisible(false)}
        onBackdropPress={() => setFiringFormVisible(false)}
      >
        <NewFiring callbackFunction={addFiring}/>
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
    backgroundColor: 'white',
    flex: 1,
  },
  nameInput: {
    flex: 1,
    marginBottom: 5,
    marginHorizontal: 15,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
  },
  imageContainer: {
    height: 100,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImage: {
    height: 80,
    width: 80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  addImageText: {
    fontSize: 14,
    fontWeight:'bold',
    textAlign: "center"
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 5,
  },
  imageModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
  
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    borderColor: 'black',
    backgroundColor: 'green',
  },
  label: {
    paddingLeft: 8,
    fontSize: 15,
  },
  listOutput: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: "black",
    borderWidth: 1,
    minHeight: 45,
    maxHeight: 135,
    marginHorizontal: 15,
  },
  glazeContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1, 
    borderColor: "black",
    padding: 4,
    margin: 2,
  },
  deleteButtonText: {
    margin: 5,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 15,
  },
  notesInput: {
    flex: 1,
    marginBottom: 5,
    marginHorizontal: 15,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
  },
  reminderText: { 
    position: "absolute", 
    right: 15, 
    fontSize: 12, 
    fontWeight: "400"}
})

export default NewPotteryItem










//CHANGE THE LABELS AND MAKE OUTPUT AREAS WITH MIN SIZES< BORDERS AND MAKE THEM BEFORE DROPDOUWN