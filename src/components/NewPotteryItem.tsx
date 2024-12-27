import React, { useState, useRef, useEffect } from 'react'
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
  Animated,
  Keyboard,
  Alert,
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
import { addPotteryItem, updatePotteryItem } from '../services/potteryItem-service'
import type { SQLiteDatabase } from 'expo-sqlite'
import { useDatabase } from '../services/db-context'
import NewMeasurement from './NewMeasurement'
import globalStyles from '../globalStyles/stylesheet'
import NewFiring from './NewFiring'
import CollapsibleSection from './CollapsibleSection'
import { useTheme } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { addPotteryItemClayLink, removePotteryItemClayLink } from '../services/potteryItem-clays-service'
import { addPotteryItemGlazeLink, removePotteryItemGlazeLink } from '../services/potteryItem-glaze-service'
import AnimatedPressable from './AnimatedPressable'
import { addPotteryItemFiring } from '../services/potteryItem-firing-service'
import { addPotteryItemMeasurement, deleteMeasurement } from '../services/potteryItem-measurements-service'
import TextStroke from './TextStroke'

type NewPotteryItemProps = {
  callBackFunction?: () => void,
  formVisible: boolean,
  setFormVisible: (v: boolean) => void,
  initialData?: {
    potteryItem: PotteryItem,
    clays: Clay[];
    glazes: Glaze[];
    measurements: MeasurementState[]
    firings: FiringState[]
  };
}

type MeasurementState = Omit<PotteryItemMeasurements, 'measurementId'> & {
  measurementId?: string; 
  potteryItemId?: string; 
};

type FiringState = Omit<PotteryItemFirings, 'firingId'> & {
  firingId?: string; 
  potteryItemId?: string;
};

const NewPotteryItem = (props: NewPotteryItemProps) => {
  const DB = useDatabase()
  const { colors } = useTheme()
  const { callBackFunction, formVisible, setFormVisible, initialData } = props
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
  const [measurements, setMeasurements] = useState<MeasurementState[]>([])
  const [firingFormVisible, setFiringFormVisible] = useState(false)
  const [firings, setFirings] = useState<FiringState[]>([])
  const [notes, setNotes] = useState('')
  const [isKeyboardOpen, setKeyboardOpen] = useState(false)
  const [isContentExpanded, setContentExpanded] = useState(false)
  const minHeight = 260
  const maxHeight = 680
  const [clayViewHeight, setClayViewHeight] = useState(50)
  const animatedHeight = useRef(new Animated.Value(minHeight)).current

  const animateHeight = (toValue: number, speed: number) => {
    Animated.timing(animatedHeight, {
      toValue,
      duration: speed, // Duration in milliseconds
      useNativeDriver: false,
    }).start()
  }
  useEffect(() => {
    if (initialData) {
      setPieceName(initialData.potteryItem.projectTitle || '');
      setImage(initialData.potteryItem.displayPicturePath || null);
      setClays(initialData.clays || []);
      setGlazes(initialData.glazes || []);
      setMeasurements(
        initialData.measurements.map((measurement) => ({
          ...measurement,  // Spread existing properties
          potteryItemId: initialData.potteryItem.potteryItemId,  // Add potteryItemId from initialData
        })) || []
      );
      setFirings(
        initialData.firings.map((firing) => ({
          ...firing,
          potteryItemId: initialData.potteryItem.potteryItemId
        })) || []
      )
      setNotes(initialData.potteryItem.projectNotes || '');
    }
  }, [initialData]);

  useEffect(() => {
    // Add keyboard listeners to track keyboard open/close state
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true)
    })

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false)
    })

    // Cleanup keyboard listeners
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  useEffect(() => {
    let targetHeight: number

    if (isContentExpanded) {
      targetHeight = isKeyboardOpen ? maxHeight - 200 : maxHeight
    } else {
      targetHeight = minHeight + clayViewHeight
    }

    animateHeight(targetHeight, 300)
  }, [isContentExpanded, isKeyboardOpen, maxHeight, minHeight, clayViewHeight])

  useEffect(() => {}, [clayViewHeight])

  const handleClayOutputResize = (height: number) => {
    setClayViewHeight(height)
    animateHeight(minHeight + height, 100)
  }
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
    setClays((prevClays) => prevClays.filter((clay) => clay !== c))
  }
  const addGlaze = (g: Glaze) => {
    setGlazeFormVisible(false)
    if (glazes.includes(g)) return
    setGlazes((prevGlazes) => [...prevGlazes, g])
  }
  const removeGlaze = (g: Glaze) => {
    setGlazes((prevGlazes) => prevGlazes.filter((glaze) => glaze !== g))
  }
  const addMeasurement = (
    measurement: Pick<PotteryItemMeasurements, 'name' | 'scale' | 'system'>,
  ) => {
    setMeasurementFormVisible(false)
    const newMeasurement: MeasurementState = {
      ...measurement,
      potteryItemId: '', // Use an empty string or null if potteryItemId is not yet available
    };
    if (measurements.includes(newMeasurement)) return
    setMeasurements((prev) => [...prev, newMeasurement])
  }
  const removeMeasurement = (m: Pick<PotteryItemMeasurements, 'name' | 'scale' | 'system'>) => {
    setMeasurements((prev) => prev.filter((measurement) => measurement !== m))
  }
  const addFiring = (firing: Pick<PotteryItemFirings, 'fireType' | 'fireStyle' | 'cone'>) => {
    setFiringFormVisible(false)
    const newFiring = {
      ...firing,
      potteryItemId: ''
    }
    if (firings.includes(newFiring)) return
    setFirings((prev) => [...prev, newFiring])
  }
  const removeFiring = (f: Pick<PotteryItemFirings, 'fireType' | 'fireStyle' | 'cone'>) => {
    setFirings((prev) => prev.filter((firing) => firing !== f))
  }

  //Data Handlers
  const createPotteryItem = async (db: SQLiteDatabase, newPotteryItemID: string) => {
    const now = new Date()
    const potteryItemToAdd: PotteryItem = {
      potteryItemId: newPotteryItemID,
      dateCreated: now.toISOString(),
      dateEdited: now.toISOString(),
      projectTitle: pieceName,
      projectNotes: notes,
      displayPicturePath: image ? image : '',
    }
    await addPotteryItem(db, potteryItemToAdd)
  }
  const createPotteryItemPicture = async (db: SQLiteDatabase, newPotteryItemId: string) => {
    const potteryItemPictureToAdd: PotteryItemPictures = {
      pictureId: uuidv4(),
      potteryItemId: newPotteryItemId,
      picturePath: image ? image : 'undefined',
    }
    //Use Service to Submit
  }
  const createPotteryItemClays = async (db: SQLiteDatabase, newPotteryItemId: string) => {
    const promises = clays.map((clay) => 
      addPotteryItemClayLink(db, newPotteryItemId, clay.clayId)
    )
    await Promise.all(promises)
  }
  const createPotteryItemGlazes = async (db: SQLiteDatabase, newPotteryItemId: string) => {
    const promises = glazes.map((glaze) =>
      addPotteryItemGlazeLink(db, newPotteryItemId, glaze.glazeId)
    );
    await Promise.all(promises);
  }
  const createPotteryItemMeasurements = async (db: SQLiteDatabase, newPotteryItemId: string) => {
    const promises = measurements.map((m) => {
      const temp: PotteryItemMeasurements = {
        measurementId: uuidv4(),
        potteryItemId: newPotteryItemId,
        name: m.name,
        system: m.system,
        scale: m.scale,
      };
      return addPotteryItemMeasurement(db, temp);
    });
    
    await Promise.all(promises); 
  }
  const createPotteryItemFirings = async (db: SQLiteDatabase, newPotteryItemId: string) => {
    const promises = firings.map((f) => {
      const temp: PotteryItemFirings = {
        firingId: uuidv4(),
        potteryItemId: newPotteryItemId,
        fireStyle: f.fireStyle,
        fireType: f.fireType,
        cone: f.cone,
      }
      return addPotteryItemFiring(db, temp)
    })
    await Promise.all(promises)
  }
  const updateExistingPotteryItem = (db: SQLiteDatabase, itemId: string) => {
    const temp: PotteryItem = {
      potteryItemId: itemId,
      projectTitle: pieceName,
      projectNotes: notes,
      displayPicturePath: image || '',
      dateCreated: initialData?.potteryItem.dateCreated ||  new Date().toISOString(),
      dateEdited: new Date().toISOString()
    }
    updatePotteryItem(db, temp)
  }

  const updateExistingPotteryItemClays = async (db: SQLiteDatabase, itemId: string)=> {
    // Extract IDs from current and initial clays
    const newClayIds = clays.map(clay => clay.clayId); 
    const existingClayIds = (initialData?.clays || []).map(clay => clay.clayId); 

    // Find clays to add and clays to remove
    const claysToAdd = newClayIds.filter(id => !existingClayIds.includes(id)); 
    const claysToRemove = existingClayIds.filter(id => !newClayIds.includes(id)); 

    // Add new clays
    for (const clayId of claysToAdd) {
      await addPotteryItemClayLink(db, itemId, clayId);
    }

    // Remove unlinked clays
    for (const clayId of claysToRemove) {
      await removePotteryItemClayLink(db, itemId, clayId);
    }
  }
  //PotteryItemGlazes
  const updateExistingPotteryItemGlazes = async (db: SQLiteDatabase, itemId: string)=> {
    // Extract IDs from current and initial glazes
    const newGlazeIds = glazes.map(glaze => glaze.glazeId); 
    const existingGlazeIds = (initialData?.glazes || []).map(glaze => glaze.glazeId); 

    // Find glazes to add and glazes to remove
    const glazesToAdd = newGlazeIds.filter(id => !existingGlazeIds.includes(id)); 
    const claysToRemove = existingGlazeIds.filter(id => !newGlazeIds.includes(id)); 

    // Add new glazes
    for (const glazeId of glazesToAdd) {
      await addPotteryItemGlazeLink(db, itemId, glazeId);
    }

    // Remove unlinked glaze
    for (const clayId of claysToRemove) {
      await removePotteryItemGlazeLink(db, itemId, clayId);
    }
  }
  //Pictures
  const updateExistingPotteryItemPicture = (db: SQLiteDatabase, itemId: string)=> {
    const potteryItemPictureToAdd: PotteryItemPictures = {
      pictureId: uuidv4(),
      potteryItemId: itemId,
      picturePath: image ? image : 'undefined',
    }
    //Use Service to update
  }
  //PotteryItemMeasurements
  const updateExistingPotteryItemMeasurements = async (db: SQLiteDatabase, itemId: string)=> {
    // Extract IDs from current and initial measurements
    const newMeasurementIds = measurements.map(m => m.measurementId);  // Measurement IDs in state
    const existingMeasurementIds = (initialData?.measurements || []).map(m => m.measurementId);  // Measurement IDs in initialData

    // Find measurements to add and measurements to remove
    const measurementsToAdd = measurements.filter(m => !m.measurementId);  // New measurements without IDs
    const measurementsToRemove = existingMeasurementIds.filter(id => !newMeasurementIds.includes(id));  // Removed measurements

    // Add new measurements
    for (const measurement of measurementsToAdd) {
      const newMeasurement: PotteryItemMeasurements = {
        measurementId: uuidv4(),  // Generate a new unique ID
        potteryItemId: itemId,
        name: measurement.name,
        scale: measurement.scale,
        system: measurement.system,
      };
      await addPotteryItemMeasurement(db, newMeasurement);  // Add the new measurement
    }

    // Remove unlinked measurements
    for (const measurementId of measurementsToRemove) {
      if(measurementId){
        await deleteMeasurement(db, measurementId);  // Delete removed measurement from the database
      }
    }
  }
  //PotteryItemFiring
  const updateExistingPotteryItemFirings = async (db: SQLiteDatabase, itemId: string)=> {
    // Extract IDs from current and initial firings
    const newFiringsIds = firings.map(f => f.firingId);  // Measurement IDs in state
    const existingFirings = (initialData?.firings || []).map(f => f.firingId);  // Measurement IDs in initialData

    // Find measurements to add and measurements to remove
    const firingsToAdd = firings.filter(f => !f.firingId);  // New measurements without IDs
    const firingsToRemove = existingFirings.filter(id => !newFiringsIds.includes(id));  // Removed measurements

    // Add new measurements
    for (const firing of firingsToAdd) {
      const newFiring: PotteryItemFirings = {
        firingId: uuidv4(),  // Generate a new unique ID
        potteryItemId: itemId,
        fireStyle: firing.fireStyle,
        fireType: firing.fireType,
        cone: firing.cone,
      };
      await addPotteryItemFiring(db, newFiring);  // Add the new measurement
    }

    // Remove unlinked measurements
    for (const firingId of firingsToRemove) {
      if(firingId){
        await deleteMeasurement(db, firingId);  // Delete removed measurement from the database
      }
    }
  }


  const handleNewPotteryItem = async () => {
    if (pieceName.length < 1) {
      Alert.alert('Missing Name', 'Please add a name for your project')
      return
    }
    if (clays.length < 1) {
      Alert.alert('Missing Clay', 'Please add at least one clay to your project.')
      return
    }

    const newPotteryItemId = uuidv4()
    //PotteryItem
    await createPotteryItem(DB, newPotteryItemId)
    //PotteryItemClays
    await createPotteryItemClays(DB, newPotteryItemId)
    //Pictures
    await createPotteryItemPicture(DB, newPotteryItemId)
    //PotteryItemGlazes
    await createPotteryItemGlazes(DB, newPotteryItemId)
    //PotteryItemMeasurements
    await createPotteryItemMeasurements(DB, newPotteryItemId)
    //PotteryItemFiring
    await createPotteryItemFirings(DB, newPotteryItemId)

    handleFormClosure()
    callBackFunction?.()
  }
  const handleUpdatePotteryItem = async (updateId: string) => {
    if (pieceName.length < 1) {
      Alert.alert('Missing Name', 'Please add a name for your project')
      return
    }
    if (clays.length < 1) {
      Alert.alert('Missing Clay', 'Please add at least one clay to your project.')
      return
    }
    //PotteryItem
    
    updateExistingPotteryItem(DB, updateId)
    //PotteryItemClays
    updateExistingPotteryItemClays(DB, updateId)
    //Pictures
    updateExistingPotteryItemPicture(DB, updateId)
    //PotteryItemGlazes
    updateExistingPotteryItemGlazes(DB, updateId)
    //PotteryItemMeasurements
    updateExistingPotteryItemMeasurements(DB, updateId)
    //PotteryItemFiring
    updateExistingPotteryItemFirings(DB, updateId)

    handleFormClosure()
    callBackFunction?.()
  }
  const handleSubmitForm = async () => {  
    initialData ? handleUpdatePotteryItem(initialData.potteryItem.potteryItemId) : handleNewPotteryItem()
  }

  const handleFormClosure = () => {
    setFormVisible(false)
    setPieceName('')
    setImage(null)
    setImageModalVisible(false)
    setCurrentClay(null)
    setClays([])
    setClayFormVisible(false)
    setCurrentGlaze(null)
    setGlazes([])
    setGlazeFormVisible(false)
    setMeasurementFormVisible(false)
    setMeasurements([])
    setFiringFormVisible(false)
    setFirings([])
    setNotes('')
    setKeyboardOpen(false)
    setContentExpanded(false)
    setClayViewHeight(50)
  }

  return (
    <View style={{ backgroundColor: colors.background }}>
      
      <Modal
        isVisible={formVisible}
        animationIn={'fadeInDownBig'}
        animationInTiming={750}
        animationOut={'fadeOutUpBig'}
        animationOutTiming={750}
        backdropColor={colors.text}
        backdropOpacity={0.7}
        onBackdropPress={handleFormClosure}
        onBackButtonPress={handleFormClosure}
        backdropTransitionOutTiming={0}
      >
        <Animated.View
          style={[
            styles.innerContainer,
            {
              height: animatedHeight,
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          {/*title*/}
          <View style={[styles.group, { height: 70, width: 'auto' }]}>
            <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>
              Project Title
            </Text>
            <TextInput
              maxLength={20}
              style={[
                styles.nameInput,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                  fontFamily: 'text',
                },
              ]}
              textAlign="center"
              onChangeText={setPieceName}
              cursorColor={colors.border}
              value={pieceName}
            />
          </View>
          {/*Clays*/}
          <View style={styles.group}>
            <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>
              Clays:
            </Text>
            {clays.length > 0 ? (
              <Text style={[styles.reminderText, { color: colors.text, fontFamily: 'text' }]}>
                (Tap To Remove)
              </Text>
            ) : (
              <Text style={[styles.reminderText, { color: colors.text, fontFamily: 'text' }]}>
                (Must Have At Least 1)
              </Text>
            )}
            <ScrollView
              onContentSizeChange={(width, height) => handleClayOutputResize(height)}
              style={[
                styles.listOutput,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              contentContainerStyle={styles.listOutputContent}
            >
              {clays.map((c: Clay) => (
                <AnimatedPressable
                  key={c.clayId + ' button'}
                  style={[
                    styles.deleteButton,
                    { backgroundColor: colors.border, borderColor: colors.border },
                  ]}
                  onPress={() => removeClay(c)}
                >
                  <Text
                    key={c.clayId + ' text'}
                    style={[styles.deleteButtonText, { color: colors.text, fontFamily: 'text' }]}
                  >
                    {c.name}
                  </Text>
                </AnimatedPressable>
              ))}
            </ScrollView>
            <View style={[styles.buttonContainer, { justifyContent: 'center' }]}>
              <AnimatedPressable
                style={[
                  globalStyles.button,
                  styles.button,
                  { backgroundColor: colors.primary, borderColor: colors.border },
                ]}
                onPress={() => setClayFormVisible(true)}
              >
                <Text style={[styles.buttonText, { color: colors.text, fontFamily: 'textBold' }]}>
                  Add Clay
                </Text>
              </AnimatedPressable>
            </View>
          </View>
          <CollapsibleSection
            showText="Show Optional Fields"
            hideText="Hide Optional Fields"
            onExpand={() => setContentExpanded(true)}
            onCollapse={() => setContentExpanded(false)}
          >
            {/*image*/}
            <View style={styles.imageContainer}>
              {image ? (
              <AnimatedPressable onPress={() => setImageModalVisible(true)}>
                  <ImageBackground
                    style={[styles.addImage, {borderColor: colors.border}]}
                    imageStyle={[styles.addImage]}
                    resizeMode="cover"
                    source={{ uri: image }}
                  >
                      <TextStroke color={colors.background} stroke={1}>
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'center',
                            color: colors.text,
                            fontFamily: 'text',
                          }}
                        >
                          Change Image
                        </Text>
                      </TextStroke>
                  </ImageBackground>
                    </AnimatedPressable>
              ) : (
                <AnimatedPressable
                  style={[
                    styles.addImage,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => setImageModalVisible(true)}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: 'center',
                      color: colors.text,
                      fontFamily: 'textBold',
                    }}
                  >
                    Add Image
                  </Text>
                </AnimatedPressable>
              )}
            </View>
            {/* Notes*/}
            <View style={[styles.group, { height: 120, width: 'auto' }]}>
              <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>
                Notes
              </Text>
              <TextInput
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                    fontFamily: 'text',
                  },
                ]}
                maxLength={250}
                multiline={true}
                blurOnSubmit={true}
                onChangeText={setNotes}
                value={notes}
              />
            </View>
            {/*Glazes*/}
            <View style={styles.group}>
              <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>
                Glazes:
              </Text>
              {glazes.length > 0 && (
                <Text style={[styles.reminderText, { color: colors.text, fontFamily: 'text' }]}>
                  (Tap To Remove)
                </Text>
              )}
              <View
                style={[
                  styles.listOutput,
                  styles.listOutputContent,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {glazes.map((g: Glaze) => (
                  <AnimatedPressable
                    key={g.glazeId + ' button'}
                    style={[
                      styles.deleteButton,
                      { backgroundColor: colors.border, borderColor: colors.border },
                    ]}
                    onPress={() => removeGlaze(g)}
                  >
                    <Text
                      key={g.glazeId + ' text'}
                      style={[styles.deleteButtonText, { color: colors.text, fontFamily: 'text' }]}
                    >
                      {g.name}
                    </Text>
                  </AnimatedPressable>
                ))}
              </View>
              <View style={[styles.buttonContainer, { justifyContent: 'center' }]}>
                <AnimatedPressable
                  style={[
                    globalStyles.button,
                    styles.button,
                    { backgroundColor: colors.primary, borderColor: colors.border },
                  ]}
                  onPress={() => setGlazeFormVisible(true)}
                >
                  <Text style={[styles.buttonText, { color: colors.text, fontFamily: 'textBold' }]}>
                    Add Glaze
                  </Text>
                </AnimatedPressable>
              </View>
            </View>
            {/*Measurements*/}
            <View style={styles.group}>
              <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>
                Measurements:
              </Text>
              {measurements.length > 0 && (
                <Text style={[styles.reminderText, { color: colors.text, fontFamily: 'text' }]}>
                  (Tap To Remove)
                </Text>
              )}
              <View
                style={[
                  styles.listOutput,
                  styles.listOutputContent,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {measurements.map((m) => (
                  <AnimatedPressable
                    key={m.name + 'Pressable'}
                    style={[
                      styles.deleteButton,
                      {
                        backgroundColor: colors.border,
                        borderColor: colors.border,
                        flexDirection: 'row',
                      },
                    ]}
                    onPress={() => removeMeasurement(m)}
                  >
                    <Text
                      style={[styles.deleteButtonText, { color: colors.text, fontFamily: 'text' }]}
                      key={m.name + 'name text'}
                    >
                      {m.name + ': ' + m.scale}
                    </Text>
                  </AnimatedPressable>
                ))}
              </View>
              <View style={[styles.buttonContainer, { justifyContent: 'center' }]}>
                <AnimatedPressable
                  style={[
                    globalStyles.button,
                    styles.button,
                    { backgroundColor: colors.primary, borderColor: colors.border },
                  ]}
                  onPress={() => setMeasurementFormVisible(true)}
                >
                  <Text style={[styles.buttonText, { color: colors.text, fontFamily: 'textBold' }]}>
                    Add Measurement
                  </Text>
                </AnimatedPressable>
              </View>
            </View>
            {/*Firings*/}
            <View style={styles.group}>
              <Text style={[globalStyles.label, { color: colors.text, fontFamily: 'heading' }]}>
                Firings
              </Text>
              {firings.length > 0 && (
                <Text style={[styles.reminderText, { color: colors.text, fontFamily: 'text' }]}>
                  (Tap To Remove)
                </Text>
              )}
              <View
                style={[
                  styles.listOutput,
                  styles.listOutputContent,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {firings.map((f, index) => (
                  <AnimatedPressable
                    key={index + f.cone + f.fireType + 'view'}
                    style={[
                      styles.deleteButton,
                      {
                        backgroundColor: colors.border,
                        borderColor: colors.border,
                        flexDirection: 'row',
                      },
                    ]}
                    onPress={() => removeFiring(f)}
                  >
                    <Text
                      key={f.cone + f.fireType + 'text'}
                      style={[styles.deleteButtonText, { color: colors.text, fontFamily: 'text' }]}
                    >
                      {f.fireStyle != 'Environmental'
                        ? f.fireType + '/' + f.fireStyle + ': Cone ' + f.cone
                        : f.fireType + '/' + f.fireStyle}
                    </Text>
                  </AnimatedPressable>
                ))}
              </View>
              <View style={[styles.buttonContainer, { justifyContent: 'center' }]}>
                <AnimatedPressable
                  style={[
                    globalStyles.button,
                    styles.button,
                    { backgroundColor: colors.primary, borderColor: colors.border },
                  ]}
                  onPress={() => setFiringFormVisible(true)}
                >
                  <Text style={[styles.buttonText, { color: colors.text, fontFamily: 'textBold' }]}>
                    Add Firing
                  </Text>
                </AnimatedPressable>
              </View>
            </View>
          </CollapsibleSection>
          {/*Submit Button*/}
          <View
            style={[
              { position: 'relative', right: 0, left: 0, bottom: 5 },
              isContentExpanded ? { marginTop: 5 } : { marginTop: 0 },
            ]}
          >
            <AnimatedPressable
              style={[
                globalStyles.button,
                styles.button,
                {
                  alignSelf: 'center',
                  padding: 10,
                  backgroundColor: colors.primary,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleSubmitForm}
            >
              {
              initialData ? 
              <Text style={{ fontSize: 18, color: colors.text, fontFamily: 'textBold' }}>
                Update Project
              </Text> 
              : 
              <Text style={{ fontSize: 18, color: colors.text, fontFamily: 'textBold' }}>
                Add New Project
              </Text>
              }
            </AnimatedPressable>
          </View>
        </Animated.View>
      </Modal>
      {/*Image Modal*/}
      <Modal
        isVisible={imageModalVisible}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.text}
        backdropOpacity={0.2}
        onBackdropPress={() => setImageModalVisible(false)}
        onBackButtonPress={() => setImageModalVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <View
          style={[
            styles.imageModalContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <AnimatedPressable
            style={[
              globalStyles.button,
              styles.button,
              { backgroundColor: colors.primary, borderColor: colors.border },
            ]}
            onPress={openCamera}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>New Image</Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={[
              globalStyles.button,
              styles.button,
              { backgroundColor: colors.primary, borderColor: colors.border },
            ]}
            onPress={pickImage}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Camera Roll</Text>
          </AnimatedPressable>
        </View>
      </Modal>
      {/*Measurement Modal*/}
      <Modal
        isVisible={measurementFormVisible}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.text}
        backdropOpacity={0.2}
        onBackdropPress={() => setMeasurementFormVisible(false)}
        onBackButtonPress={() => setMeasurementFormVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <NewMeasurement callbackFunction={addMeasurement} />
      </Modal>
      {/*Clays Modal*/}
      <Modal
        isVisible={clayFormVisible}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.text}
        backdropOpacity={0.2}
        onBackButtonPress={() => setClayFormVisible(false)}
        onBackdropPress={() => setClayFormVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <View
          style={{
            height: '60%',
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            borderRadius: 10,
          }}
        >
          <Pressable
            onPress={() => setClayFormVisible(false)}
            style={{ position: 'absolute', top: 10, right: 20, zIndex: 3, padding: 4 }}
          >
            <Ionicons name="close-circle-outline" size={30} color={colors.text} />
          </Pressable>
          <ClaysList onClaySelect={setCurrentClay}>
            <AnimatedPressable
              onPress={() => {
                currentClay && addClay(currentClay)
              }}
              style={[
                styles.button,
                globalStyles.button,
                { backgroundColor: colors.primary, borderColor: colors.border, padding: 8 },
              ]}
            >
              <Text style={{ color: colors.text, fontFamily: 'textBold', fontSize: 18 }}>
                Add Clay To Project
              </Text>
            </AnimatedPressable>
          </ClaysList>
        </View>
      </Modal>
      {/*Glaze Modal*/}
      <Modal
        isVisible={glazeFormVisible}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.text}
        backdropOpacity={0.2}
        onBackButtonPress={() => setGlazeFormVisible(false)}
        onBackdropPress={() => setGlazeFormVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <View
          style={{
            height: '60%',
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            borderRadius: 10,
          }}
        >
          <Pressable
            onPress={() => setGlazeFormVisible(false)}
            style={{ position: 'absolute', top: 10, right: 20, zIndex: 3, padding: 4 }}
          >
            <Ionicons name="close-circle-outline" size={30} color={colors.text} />
          </Pressable>
          <GlazesList onGlazeSelect={setCurrentGlaze}>
            <AnimatedPressable
              onPress={() => {
                currentGlaze && addGlaze(currentGlaze)
              }}
              style={[
                styles.button,
                globalStyles.button,
                { backgroundColor: colors.primary, borderColor: colors.border, padding: 8 },
              ]}
            >
              <Text style={{ color: colors.text, fontFamily: 'textBold', fontSize: 18 }}>
                Add Glaze To Project
              </Text>
            </AnimatedPressable>
          </GlazesList>
        </View>
      </Modal>
      {/*Firings Modal*/}
      <Modal
        isVisible={firingFormVisible}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.text}
        backdropOpacity={0.2}
        onBackButtonPress={() => setFiringFormVisible(false)}
        onBackdropPress={() => setFiringFormVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <NewFiring callbackFunction={addFiring} />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
 
  innerContainer: {
    borderWidth: 1,
    borderRadius: 10,
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 15,
    paddingBottom: 8,
    fontSize: 26,
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
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageModalContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: 200,
    height: 200,
    borderWidth: 1,
    borderRadius: 10,
  },
  group: {
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
  },
  listOutputContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1,
    justifyContent: 'flex-start',
    rowGap: 8,
  },
  listOutput: {
    borderWidth: 1,
    minHeight: 50,
    marginHorizontal: 15,
    paddingTop: 5,
    paddingHorizontal: 5,
  },
  glazeContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    borderRadius: 15,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  notesInput: {
    flex: 1,
    marginBottom: 5,
    marginHorizontal: 15,
    fontSize: 14,
    textAlign: 'left',
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  reminderText: {
    position: 'absolute',
    right: 15,
    fontSize: 12,
  },
  
})

export default NewPotteryItem
