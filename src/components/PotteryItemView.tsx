import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  Animated,
  LayoutChangeEvent,
  TouchableOpacity,
  Pressable,
  TouchableHighlight,
} from 'react-native'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useDatabase } from '../services/db-context'
import {
  deletePotteryItemById,
  getPotteryItemById,
  getPotteryItems,
} from '../services/potteryItem-service'
import { PotteryItem, Clay, Glaze, PotteryItemFirings, PotteryItemMeasurements } from '../models'
import {
  getClaysByPotteryItemId,
  removePotteryItemClayLink,
} from '../services/potteryItem-clays-service'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList, RootTabParamList } from './MyTabBar'
import {
  getGlazesByPotteryItemId,
  removePotteryItemGlazeLink,
} from '../services/potteryItem-glaze-service'
import {
  deleteFiringsByPotteryItemId,
  getFiringsByPotteryItemId,
} from '../services/potteryItem-firing-service'
import {
  deleteMeasurementsByPotteryItemId,
  getMeasurementsByPotteryItemId,
} from '../services/potteryItem-measurements-service'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useTheme } from '@react-navigation/native'
import AnimatedPressable from './AnimatedPressable'
import NewPotteryItem from './NewPotteryItem'
import Modal from 'react-native-modal'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import DeleteModal from './DeleteModal'
import { getStatus } from '../constants/utils'

export type PotteryItemViewProps = {
  route: RouteProp<RootStackParamList, 'PotteryItemView'>
}
type PotteryItemsListNavigationProp = BottomTabNavigationProp<RootTabParamList, 'PotteryItemsList'>

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const PotteryItemView = ({ route }: PotteryItemViewProps) => {
  const { id } = route.params
  const navigation = useNavigation<PotteryItemsListNavigationProp>()
  const { colors } = useTheme()
  const DB = useDatabase()
  const [reload, setReload] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [potteryItem, setPotteryItem] = useState<PotteryItem | undefined>(undefined)
  const [clays, setClays] = useState<Clay[]>([])
  const [glazes, setGlazes] = useState<Glaze[]>([])
  const [firings, setFirings] = useState<PotteryItemFirings[]>([])
  const [measurements, setMeasurements] = useState<PotteryItemMeasurements[]>([])
  const [existingSeries, setExistingSeries] = useState<string[]>([])
  const [scrollWidth, setScrollWidth] = useState(0)
  const [selectedClayId, setSelectedClayId] = useState<string | null>(null)
  const [selectedGlazeId, setSelectedGlazeId] = useState<string | null>(null)
  const [selectedFiringId, setSelectedFiringId] = useState<string | null>(null)
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string | null>(null)
  const [formVisible, setFormVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const rectSizes = useRef<Record<string, Animated.ValueXY>>({})
  const minDimensions = useRef<Record<string, { width: number; height: number }>>({})
  const notesHeights = useRef<Record<string, number>>({})
  const animationDuration = 300
  const dateIsDefined =
    potteryItem &&
    (potteryItem.startDate ||
      potteryItem.greenwareDate ||
      potteryItem.bisqueDate ||
      potteryItem.glazeDate)
  const dateProperties = [
    { label: 'Start Date', value: potteryItem?.startDate },
    { label: 'Greenware Date', value: potteryItem?.greenwareDate },
    { label: 'Bisque Date', value: potteryItem?.bisqueDate },
    { label: 'Completion Date', value: potteryItem?.glazeDate },
  ]
  const definedDates = dateProperties.filter((prop) => prop.value)
  const itemsToCheck = (item: PotteryItem) => {
    return [
      { label: 'Pictures', condition: item?.displayPicturePath?.length < 1 },
      { label: 'Clays', condition: clays.length <= 0 },
      { label: 'Glazes', condition: glazes.length <= 0 },
      { label: 'Firings', condition: firings.length <= 0 },
      { label: 'Measurements', condition: measurements.length <= 0 },
      { label: 'Notes', condition: item.projectNotes.length <= 0 },
      { label: 'Series', condition: !item.series || item.series.length < 1 },
      { label: 'Start Date', condition: !item?.startDate},
      { label: 'Greenware Completion Date', condition: !item?.greenwareDate},
      { label: 'Bisque Fire Date', condition: !item?.bisqueDate},
      { label: 'Glaze Fire Date', condition: !item?.glazeDate},
    ]
  }
  // Initialize rectSizes for each clay
  useEffect(() => {
    clays.forEach((clay) => {
      if (!rectSizes.current[clay.clayId]) {
        rectSizes.current[clay.clayId] = new Animated.ValueXY({ x: 60, y: 30 }) // Initial size
      }
      if (!minDimensions.current[clay.clayId]) {
        minDimensions.current[clay.clayId] = { width: 60, height: 30 } // Default min dimensions
      }
    })

    glazes.forEach((glaze) => {
      if (!rectSizes.current[glaze.glazeId]) {
        rectSizes.current[glaze.glazeId] = new Animated.ValueXY({ x: 60, y: 30 }) // Initial size
      }
      if (!minDimensions.current[glaze.glazeId]) {
        minDimensions.current[glaze.glazeId] = { width: 60, height: 30 } // Default min dimensions
      }
    })

    firings.forEach((firing) => {
      if (!rectSizes.current[firing.firingId]) {
        rectSizes.current[firing.firingId] = new Animated.ValueXY({ x: 60, y: 30 }) // Initial size
      }
      if (!minDimensions.current[firing.firingId]) {
        minDimensions.current[firing.firingId] = { width: 60, height: 30 } // Default min dimensions
      }
    })

    measurements.forEach((measurement) => {
      if (!rectSizes.current[measurement.measurementId]) {
        rectSizes.current[measurement.measurementId] = new Animated.ValueXY({ x: 60, y: 30 }) // Initial size
      }
      if (!minDimensions.current[measurement.measurementId]) {
        minDimensions.current[measurement.measurementId] = { width: 60, height: 30 } // Default min dimensions
      }
    })
  }, [clays, glazes, firings, measurements])

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message
    }
    return String(error)
  }

  const loadDataCallback = useCallback(async () => {
    setLoading(true)

    try {
      const storedPotteryItem = await getPotteryItemById(DB, id)
      if (storedPotteryItem) {
        setPotteryItem(storedPotteryItem)
        navigation.setOptions({
          title: storedPotteryItem.projectTitle || 'Pottery Item',
        })
      }
      const storedItems = await getPotteryItems(DB)
      if (storedItems)
        setExistingSeries(
          Array.from(new Set(storedItems.map((p) => p.series))).filter(
            (s): s is string => s != null && s.length > 0,
          ),
        )
      const storedClays = await getClaysByPotteryItemId(DB, id)
      if (storedClays) setClays(storedClays)

      const storedGlazes = await getGlazesByPotteryItemId(DB, id)
      if (storedGlazes) setGlazes(storedGlazes)

      const storedFirings = await getFiringsByPotteryItemId(DB, id)
      if (storedFirings) setFirings(storedFirings)

      const storedMeasurements = await getMeasurementsByPotteryItemId(DB, id)
      if (storedMeasurements) setMeasurements(storedMeasurements)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [DB, id, navigation])

  useEffect(() => {
    loadDataCallback()
  }, [loadDataCallback, reload])

  const handleReload = () => setReload((prev) => !prev)

  const handlePress = (id: string, type: 'clay' | 'glaze' | 'firing' | 'measurement') => {
    const currentSize = rectSizes.current[id]
    const currentMinSize = minDimensions.current[id]

    const updateState = (
      setter: React.Dispatch<React.SetStateAction<string | null>>,
      selectedId: string | null,
    ) => {
      setter(null)
      if (selectedId === id) {
        // Shrink the item back to its original size
        Animated.timing(currentSize, {
          toValue: {
            x: currentMinSize?.width || 60,
            y: currentMinSize?.height || 20,
          },
          duration: animationDuration,
          useNativeDriver: false,
        }).start()
      } else {
        // If another item of the same type is expanded, shrink it first
        if (selectedId && rectSizes.current[selectedId]) {
          Animated.timing(rectSizes.current[selectedId], {
            toValue: {
              x: minDimensions.current[selectedId]?.width || 60,
              y: minDimensions.current[selectedId]?.height || 20,
            },
            duration: animationDuration,
            useNativeDriver: false,
          }).start(() => {
            // Reset the animated value explicitly
            rectSizes.current[selectedId].setValue({
              x: minDimensions.current[selectedId]?.width || 60,
              y: minDimensions.current[selectedId]?.height || 20,
            })
          })
        }

        // Expand the currently pressed item
        Animated.timing(currentSize, {
          toValue: { x: scrollWidth, y: notesHeights.current[id] },
          duration: animationDuration,
          useNativeDriver: false,
        }).start(() => setter(id))
      }
    }

    // Handle based on the type
    if (type === 'clay') {
      updateState(setSelectedClayId, selectedClayId)
    } else if (type === 'glaze') {
      updateState(setSelectedGlazeId, selectedGlazeId)
    } else if (type === 'firing') {
      updateState(setSelectedFiringId, selectedFiringId)
    } else if (type === 'measurement') {
      updateState(setSelectedMeasurementId, selectedMeasurementId)
    }
  }
  const calculateTextHeight = (notesText: string): number => {
    const name = 28 //20 + 8 total vertical padding
    const labels = 80 //4 rows
    const notesHeight = notesText.length > 10 ? 60 : 10
    const bordersAndPadding = 13
    return name + labels + notesHeight + bordersAndPadding
  }

  const handleDeletePotteryItem = async (id: string) => {
    await deletePotteryItemById(DB, id)
    await deleteFiringsByPotteryItemId(DB, id)
    await deleteMeasurementsByPotteryItemId(DB, id)
    await Promise.all(clays.map((c) => removePotteryItemClayLink(DB, id, c.clayId)))
    await Promise.all(glazes.map((g) => removePotteryItemGlazeLink(DB, id, g.glazeId)))
    navigation.navigate('PotteryItemsList')
  }
  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Show loading spinner when data is being loaded */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        potteryItem && (
          <View style={{ flex: 1, rowGap: 5 }}>
            <ScrollView
              style={[styles.scrollContainer, { borderColor: colors.border }]}
              contentContainerStyle={[styles.scrollContent, {}]}
            >
              {potteryItem.displayPicturePath.length > 1 && (
                <ImageBackground
                  src={potteryItem.displayPicturePath}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
              {potteryItem.series && potteryItem.series.length > 0 && (
                <View style={styles.group}>
                  <Text style={[styles.label, { color: colors.text, fontFamily: 'heading' }]}>
                    Series
                  </Text>
                  <View
                    style={[
                      styles.listOutputUnselectable,
                      { borderColor: colors.border, rowGap: 8 },
                    ]}
                  >
                    <Text
                      key={'series'}
                      style={[
                        {
                          color: colors.text,
                          borderColor: colors.border,
                          borderStyle: 'dashed',
                          borderBottomWidth: 1,
                          fontFamily: 'text',
                        },
                      ]}
                    >
                      {potteryItem.series}
                    </Text>
                  </View>
                </View>
              )}
              {clays.length > 0 && (
                <View style={styles.group}>
                  <Text style={[styles.label, { color: colors.text, fontFamily: 'heading' }]}>
                    Clays
                  </Text>
                  <View
                    onLayout={(event: LayoutChangeEvent) =>
                      setScrollWidth(event.nativeEvent.layout.width - 10)
                    }
                    style={[styles.listOutput, { borderColor: colors.border, rowGap: 5 }]}
                  >
                    {clays.map((clay) => (
                      <AnimatedTouchable
                        key={clay.clayId + 'button'}
                        onPress={() => handlePress(clay.clayId, 'clay')}
                        onLayout={(event) => {
                          if (!minDimensions.current[clay.clayId]) {
                            const { width, height } = event.nativeEvent.layout
                            minDimensions.current[clay.clayId] = { width, height }
                          }
                          if (!notesHeights.current[clay.clayId]) {
                            notesHeights.current[clay.clayId] = calculateTextHeight(clay.notes)
                          }
                        }}
                        style={[
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            minWidth: rectSizes.current[clay.clayId]?.x,
                            minHeight: rectSizes.current[clay.clayId]?.y,
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 4,
                          },
                        ]}
                      >
                        <Text
                          key={clay.clayId + 'name'}
                          style={[
                            {
                              color: colors.text,
                              textAlign: 'center',
                              fontSize: 18,
                              fontFamily: 'heading',
                              lineHeight: 20,
                            },
                          ]}
                        >
                          {clay.name}
                        </Text>
                        {selectedClayId === clay.clayId && (
                          <View style={{ padding: 4 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  { color: colors.text, fontFamily: 'heading', lineHeight: 20 },
                                ]}
                              >
                                Manufacturer:
                              </Text>
                              <Text
                                style={[
                                  {
                                    color: colors.text,
                                    borderColor: colors.border,
                                    fontFamily: 'text',
                                    flex: 1,
                                    textAlign: 'center',
                                    borderBottomWidth: 1,
                                    borderStyle: 'dashed',
                                    lineHeight: 20,
                                  },
                                ]}
                              >
                                {clay.manufacturer.length >= 1 ? clay.manufacturer : 'N/A'}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  { color: colors.text, fontFamily: 'heading', lineHeight: 20 },
                                ]}
                              >
                                Type:
                              </Text>
                              <Text
                                style={[
                                  {
                                    color: colors.text,
                                    borderColor: colors.border,
                                    fontFamily: 'text',
                                    flex: 1,
                                    textAlign: 'center',
                                    borderBottomWidth: 1,
                                    borderStyle: 'dashed',
                                    lineHeight: 20,
                                  },
                                ]}
                              >
                                {clay.type && clay.type.length >= 1 ? clay.type : 'N/A'}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  { color: colors.text, fontFamily: 'heading', lineHeight: 20 },
                                ]}
                              >
                                Firing Range:
                              </Text>
                              <Text
                                style={[
                                  {
                                    color: colors.text,
                                    borderColor: colors.border,
                                    fontFamily: 'text',
                                    flex: 1,
                                    textAlign: 'center',
                                    borderBottomWidth: 1,
                                    borderStyle: 'dashed',
                                    lineHeight: 20,
                                  },
                                ]}
                              >
                                {clay.firingRange && clay.firingRange.length >= 1
                                  ? clay.firingRange
                                  : 'N/A'}
                              </Text>
                            </View>
                            <Text
                              style={[
                                { color: colors.text, fontFamily: 'heading', lineHeight: 20 },
                              ]}
                            >
                              Notes
                            </Text>
                            {clay.notes.length >= 1 ? (
                              <ScrollView
                                contentContainerStyle={{
                                  paddingHorizontal: 8,
                                }}
                                style={{
                                  height: 60,
                                  borderColor: colors.border,
                                  borderWidth: 1,
                                  borderTopWidth: 0,
                                  borderStyle: 'dashed',
                                }}
                                onStartShouldSetResponder={() => true}
                              >
                                <View onStartShouldSetResponder={() => true}>
                                  <Text
                                    style={[
                                      {
                                        color: colors.text,
                                        fontFamily: 'text',

                                        textAlign: 'center',
                                        lineHeight: 20,
                                      },
                                    ]}
                                  >
                                    {clay.notes}
                                  </Text>
                                </View>
                              </ScrollView>
                            ) : (
                              <Text
                                style={[
                                  {
                                    color: colors.text,
                                    borderColor: colors.border,
                                    fontFamily: 'text',
                                    paddingHorizontal: 8,
                                    borderWidth: 1,
                                    borderTopWidth: 0,
                                    borderStyle: 'dashed',
                                    textAlign: 'center',
                                    lineHeight: 20,
                                  },
                                ]}
                              >
                                N/A
                              </Text>
                            )}
                          </View>
                        )}
                      </AnimatedTouchable>
                    ))}
                  </View>
                </View>
              )}
              {glazes.length > 0 && (
                <View style={styles.group}>
                  <Text style={[styles.label, { color: colors.text, fontFamily: 'heading' }]}>
                    Glazes
                  </Text>
                  <View style={[styles.listOutput, { borderColor: colors.border, rowGap: 5 }]}>
                    {glazes.map((glaze) => (
                      <View
                        key={'View' + glaze.glazeId}
                        style={
                          selectedGlazeId === glaze.glazeId
                            ? { width: scrollWidth }
                            : { width: 'auto' }
                        }
                      >
                        <AnimatedTouchable
                          key={glaze.glazeId + 'button'}
                          onPress={() => handlePress(glaze.glazeId, 'glaze')}
                          onLayout={(event) => {
                            if (!minDimensions.current[glaze.glazeId]) {
                              const { width, height } = event.nativeEvent.layout
                              minDimensions.current[glaze.glazeId] = { width, height }
                            }
                            if (!notesHeights.current[glaze.glazeId]) {
                              notesHeights.current[glaze.glazeId] = calculateTextHeight(glaze.notes)
                            }
                          }}
                          style={[
                            {
                              backgroundColor: colors.card,
                              borderColor: colors.border,
                              minWidth: rectSizes.current[glaze.glazeId]?.x,
                              minHeight: rectSizes.current[glaze.glazeId]?.y,
                              borderWidth: 1,
                              borderRadius: 5,
                              padding: 4,
                            },
                          ]}
                        >
                          <Text
                            key={glaze.glazeId + 'name'}
                            style={[
                              {
                                color: colors.text,
                                textAlign: 'center',
                                fontSize: 18,
                                fontFamily: 'heading',
                              },
                            ]}
                          >
                            {glaze.name}
                          </Text>
                          {selectedGlazeId === glaze.glazeId && (
                            <View style={{ padding: 4 }}>
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: colors.text, fontFamily: 'heading' }]}>
                                  Manufacturer:
                                </Text>
                                <Text
                                  style={[
                                    {
                                      color: colors.text,
                                      borderColor: colors.border,
                                      fontFamily: 'text',
                                      flex: 1,
                                      textAlign: 'center',
                                      borderBottomWidth: 1,
                                      borderStyle: 'dashed',
                                    },
                                  ]}
                                >
                                  {glaze.manufacturer.length >= 1 ? glaze.manufacturer : 'N/A'}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: colors.text, fontFamily: 'heading' }]}>
                                  Type:
                                </Text>
                                <Text
                                  style={[
                                    {
                                      color: colors.text,
                                      borderColor: colors.border,
                                      fontFamily: 'text',
                                      flex: 1,
                                      textAlign: 'center',
                                      borderBottomWidth: 1,
                                      borderStyle: 'dashed',
                                    },
                                  ]}
                                >
                                  {glaze.type && glaze.type.length >= 1 ? glaze.type : 'N/A'}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: colors.text, fontFamily: 'heading' }]}>
                                  ID:
                                </Text>
                                <Text
                                  style={[
                                    {
                                      color: colors.text,
                                      borderColor: colors.border,
                                      fontFamily: 'text',
                                      flex: 1,
                                      textAlign: 'center',
                                      borderBottomWidth: 1,
                                      borderStyle: 'dashed',
                                    },
                                  ]}
                                >
                                  {glaze.idCode && glaze.idCode.length >= 1 ? glaze.idCode : 'N/A'}
                                </Text>
                              </View>
                              <Text style={[{ color: colors.text, fontFamily: 'heading' }]}>
                                Notes
                              </Text>
                              {glaze.notes.length >= 1 ? (
                                <ScrollView
                                  contentContainerStyle={{
                                    paddingHorizontal: 8,
                                  }}
                                  style={{
                                    height: 60,
                                    borderColor: colors.border,
                                    borderWidth: 1,
                                    borderTopWidth: 0,
                                    borderStyle: 'dashed',
                                  }}
                                  onStartShouldSetResponder={() => true}
                                >
                                  <View onStartShouldSetResponder={() => true}>
                                    <Text
                                      style={[
                                        {
                                          color: colors.text,
                                          fontFamily: 'text',

                                          textAlign: 'center',
                                          lineHeight: 20,
                                        },
                                      ]}
                                    >
                                      {glaze.notes}
                                    </Text>
                                  </View>
                                </ScrollView>
                              ) : (
                                <Text
                                  style={[
                                    {
                                      color: colors.text,
                                      borderColor: colors.border,
                                      fontFamily: 'text',
                                      paddingHorizontal: 8,
                                      borderWidth: 1,
                                      borderTopWidth: 0,
                                      borderStyle: 'dashed',
                                      textAlign: 'center',
                                      lineHeight: 20,
                                    },
                                  ]}
                                >
                                  N/A
                                </Text>
                              )}
                            </View>
                          )}
                        </AnimatedTouchable>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {firings.length > 0 && (
                <View style={styles.group}>
                  <Text style={[styles.label, { color: colors.text, fontFamily: 'heading' }]}>
                    Firings
                  </Text>
                  <View
                    style={[
                      styles.listOutputUnselectable,
                      { borderColor: colors.border, rowGap: 8 },
                    ]}
                  >
                    {firings.map((firing) => (
                      <Text
                        key={firing.firingId}
                        style={[
                          {
                            color: colors.text,
                            borderColor: colors.border,
                            borderStyle: 'dashed',
                            borderBottomWidth: 1,
                            fontFamily: 'text',
                          },
                        ]}
                      >
                        {firing.fireType + '/' + firing.fireStyle + ': ' + firing.cone}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
              {measurements.length > 0 && (
                <View style={styles.group}>
                  <Text style={[styles.label, { color: colors.text, fontFamily: 'heading' }]}>
                    Measurements
                  </Text>
                  <View
                    style={[
                      styles.listOutputUnselectable,
                      { borderColor: colors.border, rowGap: 8 },
                    ]}
                  >
                    {measurements.map((m) => (
                      <Text
                        key={m.measurementId}
                        style={[
                          {
                            color: colors.text,
                            borderColor: colors.border,
                            borderStyle: 'dashed',
                            borderBottomWidth: 1,
                            fontFamily: 'text',
                          },
                        ]}
                      >
                        {m.name + ': ' + m.scale} {m.system === 'Metric' ? 'c.' : 'in.'}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
              {potteryItem.projectNotes.length > 0 && (
                <View style={styles.group}>
                  <Text style={[styles.label, { color: colors.text, fontFamily: 'heading' }]}>
                    Notes
                  </Text>
                  <View
                    style={[
                      styles.listOutputUnselectable,
                      { borderColor: colors.border, rowGap: 8 },
                    ]}
                  >
                    <Text
                      key={'notes'}
                      style={[
                        {
                          color: colors.text,
                          borderColor: colors.border,
                          borderStyle: 'dashed',
                          borderBottomWidth: 1,
                          fontFamily: 'text',
                        },
                      ]}
                    >
                      {potteryItem.projectNotes}
                    </Text>
                  </View>
                </View>
              )}
              {dateIsDefined && (
                <View style={styles.group}>
                  <Text style={[styles.label, { color: colors.text, fontFamily: 'heading' }]}>
                    Progress
                  </Text>
                  <View
                    style={[
                      styles.listOutputUnselectable,
                      { borderColor: colors.border, rowGap: 8 },
                    ]}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          {
                            color: colors.text,
                            borderColor: colors.border,
                            borderBottomWidth: 1,
                            fontFamily: 'headingBold',
                            flex: 1,
                            fontSize: 16,
                            textAlign: 'center'
                          },
                        ]}
                      >
                        Status
                      </Text>
                      <Text
                        style={[
                          {
                            color: colors.text,
                            borderColor: colors.border,
                            borderBottomWidth: 1,
                            fontFamily: 'textBold',
                            flex: 1,
                          },
                        ]}
                      >
                        {getStatus(potteryItem)}
                      </Text>
                    </View>
                    {definedDates.map((m) => (
                      <View key={'wrapper: ' + m.label} style={{ flexDirection: 'row' }}>
                        <Text
                          key={m.label}
                          style={[
                            {
                              color: colors.text,
                              borderColor: colors.border,
                              borderStyle: 'dashed',
                              borderBottomWidth: 1,
                              fontFamily: 'heading',
                              flex: 1,
                            },
                          ]}
                        >
                          {m.label + ':'}
                        </Text>
                        <Text
                          key={m.value}
                          style={[
                            {
                              color: colors.text,
                              borderColor: colors.border,
                              borderStyle: 'dashed',
                              borderBottomWidth: 1,
                              fontFamily: 'text',
                              flex: 1,
                            },
                          ]}
                        >
                          {m.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {itemsToCheck(potteryItem).some((prop) => prop.condition) && (
                <Text style={{ color: colors.text, fontFamily: 'text', textAlign: 'center' }}>
                  The project currently has no{' '}
                  {itemsToCheck(potteryItem)
                    .filter((prop) => prop.condition)
                    .map((prop) => prop.label)
                    .reduce((acc, curr, index, arr) => {
                      if (index === arr.length - 1 && arr.length > 1) {
                        return `${acc}, or ${curr}`
                      }
                      return acc ? `${acc}, ${curr}` : curr
                    }, '')}
                </Text>
              )}
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <AnimatedPressable style={{ padding: 4 }} onPress={() => setFormVisible(true)}>
                <Ionicons name="create" color={colors.border} size={40} />
              </AnimatedPressable>
              <AnimatedPressable
                style={[{ padding: 4 }]}
                onPress={() => setDeleteModalVisible(true)}
              >
                <Ionicons name="trash" color={colors.border} size={40} />
              </AnimatedPressable>
            </View>
            <NewPotteryItem
              formVisible={formVisible}
              setFormVisible={setFormVisible}
              callBackFunction={handleReload}
              initialData={{
                potteryItem,
                clays: clays,
                glazes: glazes,
                measurements: measurements,
                firings: firings,
              }}
              existingSeries={existingSeries}
            />
            <DeleteModal
              name={potteryItem.projectTitle}
              deleteId={potteryItem.potteryItemId}
              isDeleteModalVisible={isDeleteModalVisible}
              setDeleteModalVisible={setDeleteModalVisible}
              deleteCallback={handleDeletePotteryItem}
            />
          </View>
        )
      )}
    </View>
  )
}

export default PotteryItemView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 10,
  },
  scrollContent: {
    rowGap: 20,
    paddingBottom: 30,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
  },
  listOutput: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 20,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  listOutputUnselectable: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 20,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  errorText: {
    color: 'red',
  },
  group: {
    width: 'auto',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'center',
    overflow: 'hidden',
  },
})
