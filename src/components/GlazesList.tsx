import React, { useEffect, useState, useCallback, useRef, SetStateAction } from 'react'
import type { Glaze } from '../models'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Animated,
  TouchableOpacity,
} from 'react-native'
import Modal from 'react-native-modal'
import NewGlaze from './NewGlaze'
import { useDatabase } from '../services/db-context'
import { createGlazeTable, deleteGlazeById, getGlazes } from '../services/glaze-service'
import globalStyles from '../constants/stylesheet'
import { useFocusEffect, useIsFocused, useNavigation, useTheme } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import AnimatedPressable from './AnimatedPressable'
import { PotteryItemsListNavigationProp } from './MyTabBar'
import DeleteModal from './DeleteModal'

export type GlazesListProps = {
  existingProjectGlazes?: Glaze[]
  selectedGlazes?: Glaze[]
  setSelectedGlazes?: React.Dispatch<SetStateAction<Glaze[]>>
  children?: React.ReactNode
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

function GlazesList({
  selectedGlazes,
  existingProjectGlazes,
  setSelectedGlazes,
  children,
}: GlazesListProps) {
  const DB = useDatabase()
  const navigation = useNavigation<PotteryItemsListNavigationProp>()
  const isFocused = useIsFocused()
  const { colors } = useTheme()
  const [allGlazes, setAllGlazes] = useState<Glaze[]>([])
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [newGlazeFormVisible, setNewGlazeFormVisible] = useState(false)
  const [curGlaze, setCurGlaze] = useState<Glaze | null>(null)
  const [modalGlazeData, setModalGlazeData] = useState<Glaze | undefined>(undefined)
  const rectHeights = useRef<Record<string, Animated.Value>>({})
  const [currentExpandedId, setCurrentExpandedId] = useState<string | null>()
  const [reload, setReload] = useState(false)
  const animationDuration = 300
  const isSelectable = Boolean(setSelectedGlazes)

  const loadDataCallback = useCallback(async () => {
    try {
      await createGlazeTable(DB)
      const storedGlazes = await getGlazes(DB)

      const initiallyFilteredGlazes = existingProjectGlazes
        ? storedGlazes.filter((glaze) => !existingProjectGlazes.some((g) => g.glazeId === glaze.glazeId))
        : storedGlazes

      setAllGlazes(initiallyFilteredGlazes)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error loading glazes: ${error.message}`)
      } else {
        console.error('Unknown error occurred while loading glazes.')
      }
    }
  }, [DB, selectedGlazes])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('PotteryItemsList')
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [navigation]),
  )

  useEffect(() => {
    if (isFocused) {
      loadDataCallback()
    }
  }, [isFocused, reload, loadDataCallback])

  useEffect(() => {
    const initializeRectHeights = () => {
      allGlazes.forEach((glaze) => {
        if (!rectHeights.current[glaze.glazeId]) {
          rectHeights.current[glaze.glazeId] = new Animated.Value(1)
        }
      })
    }
    initializeRectHeights()
  }, [allGlazes])

  const calculateHeight = (g: Glaze): number => {
    const lineHeight = 18
    const padding = 20
    const baseHeight = 60
    const rowGap = 40

    const notesLines = Math.ceil(g.notes.length / 35)
    const manufacturerLines = Math.ceil(g.manufacturer.length / 15)
    const dynamicHeight = notesLines * lineHeight + manufacturerLines * lineHeight
    const buffer = 40

    return baseHeight + dynamicHeight + padding + buffer + rowGap
  }

  const animateHeight = (g: Glaze) => {
    const id = g.glazeId
    const currentSize = rectHeights.current[id]
    if (!currentSize) {
      console.log(`Animated.Value not initialized for id: ${id}`)
      return
    }

    setCurrentExpandedId(null)
    if (currentExpandedId === id) {
      Animated.timing(currentSize, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: false,
      }).start()
    } else {
      if (currentExpandedId) {
        const previousExpandedId = currentExpandedId
        const previousSize = rectHeights.current[previousExpandedId]
        if (previousSize) {
          Animated.timing(previousSize, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: false,
          }).start()
        }
      }
      const height = calculateHeight(g)
      Animated.timing(currentSize, {
        toValue: height,
        duration: animationDuration,
        useNativeDriver: false,
      }).start(() => {
        setCurrentExpandedId(id)
      })
    }
  }

  const handleGlazeSelect = (g: Glaze) => {
    if (isSelectable) {
      setSelectedGlazes?.((prevSelectedGlazes: Glaze[]) => {
        const isSelected = prevSelectedGlazes.some((selected) => selected.glazeId === g.glazeId)

        const updatedClays = isSelected
          ? prevSelectedGlazes.filter((selected) => selected.glazeId !== g.glazeId)
          : [...prevSelectedGlazes, g]

        return updatedClays
      })
    } else {
      curGlaze?.glazeId === g.glazeId ? setCurGlaze(null) : setCurGlaze(g)
      animateHeight(g)
    }
  }

  const handleDeleteGlaze = async (id: string) => {
    await deleteGlazeById(DB, id)
    setReload((prev) => !prev)
    setDeleteModalVisible(false)
  }

  const handleModalSubmission = () => {
    setNewGlazeFormVisible(false)
    setReload((prev) => !prev)
  }

  return (
    <View style={[styles.container]}>
      <ScrollView style={styles.scrollContainer} indicatorStyle="white">
        {allGlazes.map((g) =>
          isSelectable ? (
            <AnimatedPressable
              key={'Button: ' + g.glazeId}
              onPress={() => handleGlazeSelect(g)}
              style={[
                styles.button,
                { borderColor: colors.border },
                selectedGlazes?.some((selected) => selected.glazeId === g.glazeId) ||
                curGlaze?.glazeId === g.glazeId
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.card },
              ]}
            >
              <Text
                key={'Name: ' + g.glazeId}
                style={[styles.buttonText, { color: colors.text, fontFamily: 'textBold' }]}
              >
                {g.name}
              </Text>
            </AnimatedPressable>
          ) : (
            <AnimatedTouchable
              key={'Button: ' + g.glazeId}
              onPress={() => handleGlazeSelect(g)}
              style={[
                styles.button,
                {
                  borderColor: colors.border,
                  minHeight: rectHeights.current[g.glazeId],
                },
                selectedGlazes?.some((selected) => selected.glazeId === g.glazeId) ||
                curGlaze?.glazeId === g.glazeId
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.card },
              ]}
            >
              <Text
                key={'Name: ' + g.glazeId}
                style={[styles.buttonText, { color: colors.text, fontFamily: 'textBold' }]}
              >
                {g.name}
              </Text>

              {currentExpandedId === g.glazeId && (
                <View style={{ flex: 1, rowGap: 10, marginTop: 10 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: colors.text, fontFamily: 'headingBold', fontSize: 18 }}>
                      Manufacturer:
                    </Text>
                    {g.manufacturer.length > 0 ? (
                      <Text
                        style={{
                          color: colors.text,
                          fontFamily: 'text',
                          fontSize: 18,
                          borderColor: colors.border,
                          textAlign: 'center',
                          flex: 1,
                          borderBottomWidth: 1,
                          borderStyle: 'dashed',
                        }}
                      >
                        {g.manufacturer}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: colors.text,
                          fontFamily: 'text',
                          fontSize: 18,
                          borderColor: colors.border,
                          textAlign: 'center',
                          flex: 1,
                          borderBottomWidth: 1,
                          borderStyle: 'dashed',
                        }}
                      >
                        N/A
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      g.notes.length > 0 ? { flexDirection: 'column' } : { flexDirection: 'row' },
                    ]}
                  >
                    <Text style={{ color: colors.text, fontFamily: 'headingBold', fontSize: 18 }}>
                      Notes:
                    </Text>
                    {g.notes.length > 0 ? (
                      <Text
                        style={{
                          color: colors.text,
                          lineHeight: 18,
                          borderColor: colors.border,
                          fontSize: 18,
                          fontFamily: 'text',
                          textAlign: 'center',
                          borderBottomWidth: 1,
                          borderStyle: 'dashed',
                        }}
                      >
                        {g.notes}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: colors.text,
                          borderColor: colors.border,
                          fontSize: 18,
                          fontFamily: 'text',
                          borderBottomWidth: 1,
                          borderStyle: 'dashed',
                          textAlign: 'center',
                          flex: 1,
                        }}
                      >
                        N/A
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <AnimatedPressable
                      style={{ padding: 4, paddingHorizontal: 16 }}
                      onPress={() => {
                        setModalGlazeData(g)
                        setNewGlazeFormVisible(true)
                      }}
                    >
                      <Ionicons name="create" color={colors.border} size={30} />
                    </AnimatedPressable>
                    <AnimatedPressable
                      style={[
                        { paddingVertical: 4, paddingHorizontal: 16, borderColor: colors.border },
                      ]}
                      onPress={() => {
                        setModalGlazeData(g)
                        setDeleteModalVisible(true)
                      }}
                    >
                      <Ionicons name="trash" color={colors.border} size={30} />
                    </AnimatedPressable>
                  </View>
                </View>
              )}
            </AnimatedTouchable>
          ),
        )}
      </ScrollView>
      <View style={{ position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center' }}>
        <AnimatedPressable
          onPress={() => {
            setModalGlazeData(undefined)
            setNewGlazeFormVisible(true)
          }}
          style={[
            globalStyles.button,
            styles.newGlazeButton,
            { backgroundColor: colors.primary, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              { color: colors.text, fontFamily: 'textBold' },
              isSelectable ? { fontSize: 16 } : { fontSize: 20 },
            ]}
          >
            New Glaze
          </Text>
        </AnimatedPressable>
        {children}
      </View>
      <DeleteModal
        name={modalGlazeData?.name || 'Error Retrieving Name'}
        deleteId={modalGlazeData?.glazeId || '0'}
        isDeleteModalVisible={isDeleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        deleteCallback={handleDeleteGlaze}
      />
      <Modal
        isVisible={newGlazeFormVisible}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.border}
        backdropOpacity={0.5}
        onBackdropPress={() => setNewGlazeFormVisible(false)}
        onBackButtonPress={() => setNewGlazeFormVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <View style={{ flex: 1 }}>
          <NewGlaze initialData={modalGlazeData} callBackFunction={handleModalSubmission}>
            <Pressable
              onPress={() => setNewGlazeFormVisible(false)}
              style={{ position: 'absolute', top: 10, right: 20, zIndex: 3 }}
            >
              <Ionicons name="close-circle-outline" size={30} color={colors.text} />
            </Pressable>
          </NewGlaze>
        </View>
      </Modal>
    </View>
  )
}

export default GlazesList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  scrollContainer: {
    marginBottom: 100,
    marginTop: 50,
  },
  newGlazeButton: {
    marginBottom: 5,
  },
  button: {
    flex: 1,
    padding: 10,
    elevation: 3,
    marginBottom: 30,
    borderRadius: 30,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
  },
})
