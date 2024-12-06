import React, { useState } from 'react'
import 'react-native-get-random-values'
import {
  View,
  Button,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
} from 'react-native'
import Modal from 'react-native-modal'
import ClaysList from './ClaysList'
import GlazesList from './GlazesList'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import {
  type PotteryItem,
  type Glaze,
  type Clay,
  type PotteryItemPictures,
  type PotteryItemMeasurements,
  PotteryItemFireTemp,
} from '../models'
import { v4 as uuidv4 } from 'uuid'
import { addPotteryItem } from '../services/potteryItem-service'
import type { SQLiteDatabase } from 'expo-sqlite'
import { getDBConnection } from '../services/db-service'
import { coneTemperatures } from '../constants/coneTemperatures'
import { useDatabase } from '../services/db-context'


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
  const [measurementName, setMeasurementName] = useState('')
  const [measurementValue, setMeasurementValue] = useState('')
  const [measurements, setMeasurements] = useState<{ name: string; value: number }[]>([])
  const [fireType, setFireType] = useState('Bisque')
  const [fireStyle, setFireStyle] = useState('Cone')
  const [temperature, setTemperature] = useState('0')
  const [temperatures, setTemperatures] = useState<
    Pick<PotteryItemFireTemp, 'fireTempId' | 'fireType' | 'cone' | 'fireStyle'>[]
  >([])

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

  const addMeasurement = () => {
    const newMeasurement = {
      name: measurementName,
      value: parseInt(measurementValue),
    }
    setMeasurements((prev) => [...prev, newMeasurement])
  }
  const addTemperature = () => {
    const temp: Pick<PotteryItemFireTemp, 'fireTempId' | 'fireType' | 'fireStyle' | 'cone'> = {
      fireTempId: uuidv4(),
      fireStyle: fireStyle,
      fireType: fireType,
      cone: temperature,
    }
    setTemperatures((prev) => [...prev, temp])
    setTemperature('0')
  }
  const removeTemperature = (t: Pick<PotteryItemFireTemp, 'fireTempId' | 'fireType' | 'cone'>) => {
    setTemperatures((p) => p.filter((f) => t.fireTempId !== f.fireTempId))
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

          {/*clay*/}
          <View style={styles.group}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={styles.label}>Clays:</Text>
              {clays.length > 0 &&
                <Text style={{ position: "absolute", right: 15, fontSize: 13, fontWeight: "500"}}>(tap to remove)</Text>
              }
            </View>
            <ScrollView style={styles.listOutput}>
              {clays.map((c: Clay) => (
                <Pressable key={c.clayId + ' button'} style={styles.removeGlazeButton} onPress={() => removeClay(c)}>
                  <Text key={c.clayId + ' text'} style={styles.glazeName}>
                    {c.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={[styles.glazeButtonContainer, { justifyContent: 'center'}]}>
              <Pressable
                style={[styles.button, { display: 'flex', paddingVertical: 4, paddingHorizontal: 15, marginTop: 4}]}
                onPress={() => setClayFormVisible(true)}
              >
                <Text style={styles.buttonText}>Add Clay To Project</Text>
              </Pressable>
            </View>
          </View>

          {/*glazes*/}
          <View style={styles.group}>
            <View>
              <Text style={styles.label}>Glazes:</Text>
              {glazes.length > 0 &&
                <Text style={{ position: "absolute", right: 15, fontSize: 13, fontWeight: "500"}}>(tap to remove)</Text>
              }
              <View style={styles.listOutput}>
                {glazes.map((g: Glaze) => (
                  <Pressable key={g.glazeId + ' button'} style={styles.removeGlazeButton} onPress={() => removeGlaze(g)}>
                  <Text key={g.glazeId + ' text'} style={styles.glazeName}>
                    {g.name}
                  </Text>
                </Pressable>
                ))}
              </View>
            </View>
            <View style={[styles.glazeButtonContainer, { justifyContent: 'center', }]}>
              <Pressable
                style={[styles.button, { display: 'flex', paddingVertical: 4, paddingHorizontal: 15, marginTop: 4}]}
                onPress={() => setGlazeFormVisible(true)}
              >
                <Text style={styles.buttonText}>Add Glaze</Text>
              </Pressable>
            </View>
          </View>

          {/*Measurements*/}
          <View style={styles.group}>
            <Text>Measurements:</Text>
            <View>
              {measurements.map((m) => (
                <View>
                  <Text>{m.name + ':'}</Text>
                  <Text>{'  ' + m.value}</Text>
                </View>
              ))}
            </View>
            <Pressable style={styles.button} onPress={() => setMeasurementFormVisible(true)}>
              <Text style={styles.buttonText}>Add Measurement</Text>
            </Pressable>
          </View>

          {/*Fire Temps*/}
          <View>
            <Text>Fire Type:</Text>
            <Picker style={styles.dropdown} selectedValue={fireStyle} onValueChange={setFireStyle}>
              <Picker.Item label="Bisque" value={'Bisque'} key={'FireType: Bisque'} />
              <Picker.Item label="Glaze" value={'Glaze'} key={'fireType: Glaze'} />
            </Picker>
            <Picker style={styles.dropdown} selectedValue={fireStyle} onValueChange={setFireStyle}>
              <Picker.Item label="Cone" value={'Cone'} key={'fireStyle: Cone'} />
              <Picker.Item label="Raku" value={'Raku'} key={'fireStyle: Raku'} />
            </Picker>
            {fireStyle == 'Cone' && (
              <View>
                <Text>Temperature:</Text>
                <Picker
                  style={styles.dropdown}
                  selectedValue={temperature}
                  onValueChange={setTemperature}
                >
                  {Object.entries(coneTemperatures).map(([key, value]) => (
                    <Picker.Item
                      label={key + ': ' + value.fahrenheit + 'f'}
                      value={key}
                      key={key}
                    />
                  ))}
                </Picker>
              </View>
            )}
            <Pressable style={styles.button} onPress={addTemperature}>
              <Text style={styles.buttonText}>Add Firing</Text>
            </Pressable>
          </View>
          <View style={styles.group}>
            <Text>Firings</Text>
            <View>
              {temperatures.map((f, index) => (
                <View key={index + f.cone + f.fireType + 'view'} style={styles.glazeContainer}>
                  <Text key={f.cone + f.fireType + 'text'} style={styles.glazeName}>
                    {f.fireStyle == 'Cone'
                      ? f.fireType + ': ' + f.fireStyle + f.cone
                      : f.fireType + ': ' + f.fireStyle}
                  </Text>
                  <Pressable style={styles.removeGlazeButton} onPress={() => removeTemperature(f)}>
                    <Text style={styles.deleteButtonText}>X</Text>
                  </Pressable>
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
        <View style={{ backgroundColor: 'green', gap: 5 }}>
          <View>
            <Text style={{ marginHorizontal: 5 }}>Name</Text>
            <TextInput
              style={{ backgroundColor: 'white', margin: 10, padding: 5 }}
              onChangeText={setMeasurementName}
            />
          </View>
          <View>
            <Text style={{ marginHorizontal: 5 }}>Value</Text>
            <TextInput
              keyboardType="number-pad"
              style={{ backgroundColor: 'white', margin: 10, padding: 5 }}
              onChangeText={setMeasurementValue}
            />
          </View>
          <Pressable style={styles.button} onPress={addMeasurement}>
            <Text style={styles.buttonText}>Add Measurement</Text>
          </Pressable>
        </View>
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
          <ClaysList onSubmit={setCurrentClay} />
          <View style={{height: 50, justifyContent: 'center', alignItems:'center', backgroundColor:'blue'}}>
            {/*This might need to be re done because you cant open a modal within a modal, Mayb
            we switch views? can we come back to a filled out form?*/}
            
            <Pressable 
              onPress={() => {currentClay && addClay(currentClay)}}
              style={[styles.button, { flex: 2, paddingVertical: 5, paddingHorizontal: 15}]}
              >
              <Text style={[styles.buttonText, {fontWeight: 'bold'}]}>Add Clay To Project</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/*Clays Modal*/}
      <Modal  
        isVisible={glazeFormVisible}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        backdropOpacity={.9}
        onBackButtonPress={() => setGlazeFormVisible(false)}
        onBackdropPress={() => setGlazeFormVisible(false)}
      > 
        <View style={{flex: 1}}>
          <GlazesList onSubmit={setCurrentGlaze} />
          <View style={{height: 50, justifyContent: 'center', alignItems:'center', backgroundColor:'blue'}}>
            {/*This might need to be re done because you cant open a modal within a modal, Mayb
            we switch views? can we come back to a filled out form?*/}
            
            <Pressable 
              onPress={() => {currentGlaze && addGlaze(currentGlaze); console.log(currentGlaze)}}
              style={[styles.button, { flex: 2, paddingVertical: 5, paddingHorizontal: 15}]}
              >
              <Text style={[styles.buttonText, {fontWeight: 'bold'}]}>Add Glaze To Project</Text>
            </Pressable>
          </View>
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
  glazeButtonContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 4,
    elevation: 3,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
  glazeName: {
    margin: 5,
    textAlign: 'center',
  },
  dropdown: {
    backgroundColor: 'teal',
    marginHorizontal: 5,
  },
  addMeasurementButton: {},
  removeGlazeButton: {
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
    fontSize: 12,
  },
  buttonText: {
    fontSize: 15,
  },
})

export default NewPotteryItem










//CHANGE THE LABELS AND MAKE OUTPUT AREAS WITH MIN SIZES< BORDERS AND MAKE THEM BEFORE DROPDOUWN