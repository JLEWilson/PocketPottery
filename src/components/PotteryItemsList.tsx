import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, BackHandler, Pressable } from 'react-native'
import { PotteryItemComponent } from './PotteryItem'
import { PotteryItem } from '../models'
import { useDatabase } from '../services/db-context'
import { createPotteryItemTable, getPotteryItems } from '../services/potteryItem-service'
import NewPotteryItem from '../components/NewPotteryItem'
import { useFocusEffect, useIsFocused, useNavigation, useTheme } from '@react-navigation/native'
import { createPotteryItemFiringsTable } from '../services/potteryItem-firing-service'
import { createPotteryItemGlazesTable } from '../services/potteryItem-glaze-service'
import { createPotteryItemClaysTable } from '../services/potteryItem-clays-service'
import { createPotteryItemMeasurementsTable } from '../services/potteryItem-measurements-service'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList, RootTabParamList } from './MyTabBar'
import AnimatedPressable from './AnimatedPressable'
import globalStyles from '../constants/stylesheet'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { createMetaTable } from '../services/meta'
import { Ionicons } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import {
  CompletionStatus,
  getStatus,
  getStatusKey,
  groupBy,
  sortObjectsByProperty,
  sortPotteryItemsByStatus,
} from '../constants/utils'
import CollapsibleSection from './CollapsibleSection'

type PotteryItemsStackNavigationProp = StackNavigationProp<RootStackParamList, 'PotteryItemView'>
type PotteryItemsBottomNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'PotteryItemsList'
>

const SortOptions = {
  ALPHABETICAL: 'Alphabetical',
  COMPLETION_STATUS: 'Completion Status',
  DATE_STARTED: 'Start Date',
  DATE_COMPLETED: 'Completion Date',
  SERIES: 'Series',
  TAG: 'Tag',
} as const

type SortOptionKeys = keyof typeof SortOptions;

const FilterOptions = {
  ...CompletionStatus,
}

const PotteryItemList = () => {
  const DB = useDatabase()
  const { colors } = useTheme()
  const isFocused = useIsFocused()
  const nav = useNavigation<PotteryItemsStackNavigationProp>()
  const navigation = useNavigation<PotteryItemsBottomNavigationProp>()
  const [potteryItems, setPotteryItems] = useState<PotteryItem[]>([])
  const [sortedPotteryItems, setSortedPotteryItems] = useState<PotteryItem[]>([])
  const [reload, setReload] = useState(false)
  const [isSortModalVisible, setIsSortModalVisible] = useState<boolean>(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [formVisible, setFormVisible] = useState(false)
  const buttonRef = useRef<View>(null)
  const [sortMode, setSortMode] = useState<SortOptionKeys>('ALPHABETICAL')
  const [selectedSortButton, setselectedSortButton] = useState<SortOptionKeys>('ALPHABETICAL')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const checkboxIcons = {
    checked: <Ionicons name="square" size={20} color={colors.primary} />,
    unchecked: <Ionicons name="square-outline" size={20} color={colors.primary} />,
  }

  const loadDataCallback = useCallback(async () => {
    try {
      await createMetaTable(DB)
      await createPotteryItemTable(DB)
      await createPotteryItemClaysTable(DB)
      await createPotteryItemGlazesTable(DB)
      await createPotteryItemFiringsTable(DB)
      await createPotteryItemMeasurementsTable(DB)
      const storedPotteryItems = await getPotteryItems(DB)
      if (storedPotteryItems.length) {
        setPotteryItems(storedPotteryItems)
        handleSubmitSorting()
      } else {
        setPotteryItems([])
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error loading pottery items: ${error.message}`)
      } else {
        console.error('Unknown error occurred while loading pottery items.')
      }
    }
  }, [DB, reload])

  useEffect(() => {
    if (potteryItems.length > 0) {
      handleSubmitSorting(); 
    }
  }, [potteryItems])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp()
        return true
      }

      // Add back handler
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      // Cleanup the handler when the screen is unfocused
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [navigation]),
  )

  useEffect(() => {
    if (isFocused || reload) {
      loadDataCallback()
    }
  }, [isFocused, reload, loadDataCallback])

  const sortPotteryItems = (items: PotteryItem[]) => {
    switch (sortMode) {
      case "ALPHABETICAL":
        return sortObjectsByProperty(items, "projectTitle");
      case "COMPLETION_STATUS":
        return sortPotteryItemsByStatus(items);
      case "DATE_STARTED":
        return sortObjectsByProperty(items, "startDate");
      case "DATE_COMPLETED":
        return sortObjectsByProperty(items, "glazeDate");
      case "SERIES":
        return sortObjectsByProperty(items, "series");
      default:
        return items;
    }
  };
  
  const filterPotteryItems = () => {
    
    const filteredItems = potteryItems.filter((item) => {
      const status = getStatus(item);
      const key = getStatusKey(status)
      console.log(`Item: ${item.projectTitle}, Status: ${status}`);
      return selectedFilters.length === 0 || selectedFilters.includes(key);
    });
  
    console.log('Filtered Items:', filteredItems); // Check the filtered items
    return filteredItems;
  };
  
  const handleSubmitSorting = () => {
    // Set the sort mode based on the selected option
    setSortMode(selectedSortButton);
    setIsSortModalVisible(false);
  
    // First, filter the items based on selected filters
    const filteredItems = filterPotteryItems();
  
    // Then, apply sorting to the filtered items
    const sortedItems = sortPotteryItems(filteredItems);
  
    // Finally, update the sorted items state
    setSortedPotteryItems(sortedItems);
  };

  const toggleOption = (option: string) => {
    setSelectedFilters(
      (prevSelected) =>
        prevSelected.includes(option)
          ? prevSelected.filter((o) => o !== option) // Remove if already selected
          : [...prevSelected, option], // Add if not selected
    )
  }

  const handleReload = () => {
    setReload((prev) => !prev)
  }

  const handlePress = (id: string) => {
    nav.navigate('PotteryItemView', { id })
  }

  const openModal = () => {
    // Measure button position
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setModalPosition({ x: x + width, y: y, width, height })
      setIsSortModalVisible(true)
    })
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={{ position: 'absolute', right: 12, top: 0, zIndex: 3 }}>
        <View ref={buttonRef}>
          <AnimatedPressable onPress={() => openModal()} style={{ padding: 4 }}>
            <Ionicons name="filter" color={colors.text} size={25} />
          </AnimatedPressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.scrollView]}>
        {sortMode === 'SERIES'
          ? Object.entries(groupBy(sortedPotteryItems, (item) => item.series || 'No Series')).map(
              ([series, items]) => (
                <View key={series + ' wrapper'} style={{ width: '100%' }}>
                  <CollapsibleSection
                    showText={series}
                    hideText={series}
                    startOpen={true}
                    key={series || 'No Series'}
                  >
                    <View style={[styles.scrollView, { padding: 0 }]}>
                      {/* Pottery Items in the Series */}
                      {items.map((p) => (
                        <PotteryItemComponent
                          key={p.potteryItemId}
                          potteryItem={p}
                          handlePress={handlePress}
                        />
                      ))}
                    </View>
                  </CollapsibleSection>
                </View>
              ),
            )
          : sortMode === 'COMPLETION_STATUS'
            ? Object.entries(groupBy(sortedPotteryItems, (item) => getStatus(item))).map(
                ([status, items]) => (
                  <View key={status + ' wrapper'} style={{ width: '100%' }}>
                    <CollapsibleSection
                      showText={status}
                      hideText={status}
                      startOpen={true}
                      key={status || 'No Series'}
                    >
                      <View style={[styles.scrollView, { padding: 0 }]}>
                        {/* Pottery Items in the Completion Status Group */}
                        {items.map((p) => (
                          <PotteryItemComponent
                            key={p.potteryItemId}
                            potteryItem={p}
                            handlePress={handlePress}
                          />
                        ))}
                      </View>
                    </CollapsibleSection>
                  </View>
                ),
              )
            : /* Default rendering for other sort modes */
              sortedPotteryItems.map((p) => (
                <PotteryItemComponent
                  key={p.potteryItemId}
                  potteryItem={p}
                  handlePress={handlePress}
                />
              ))}
      </ScrollView>
      <View style={styles.modalOpenButton}>
        <AnimatedPressable
          onPress={() => setFormVisible(true)}
          style={[
            globalStyles.button,
            styles.newProjectButton,
            { backgroundColor: colors.primary, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              {
                color: colors.text,
                fontFamily: 'textBold',
                fontSize: 20,
                textAlign: 'center',
                padding: 1,
              },
            ]}
          >
            New Piece
          </Text>
        </AnimatedPressable>
      </View>
      <NewPotteryItem
        callBackFunction={handleReload}
        formVisible={formVisible}
        setFormVisible={setFormVisible}
        existingSeries={Array.from(new Set(potteryItems.map((p) => p.series))).filter(
          (s): s is string => s != null && s.length > 0,
        )}
      />
      <Modal
        isVisible={isSortModalVisible}
        animationIn={'fadeInRightBig'}
        animationInTiming={750}
        animationOut={'fadeOutRightBig'}
        animationOutTiming={400}
        backdropColor={colors.border}
        backdropOpacity={0.5}
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => setIsSortModalVisible(false)}
        onBackdropPress={() => setIsSortModalVisible(false)}
      >
        <View
          style={[
            {
              position: 'absolute',
              backgroundColor: colors.background,
              width: 200,
              padding: 8,
              top: modalPosition.y + modalPosition.height / 2,
              left: modalPosition.x - 215,
              rowGap: 8,
            },
          ]}
        >
          <Text
            style={{ color: colors.text, fontFamily: 'title', textAlign: 'center', fontSize: 20 }}
          >
            Sort Style
          </Text>
          {(Object.keys(SortOptions) as Array<keyof typeof SortOptions>).map((key) => (
            <AnimatedPressable
              key={key}
              onPress={() => {
                setselectedSortButton(key)
              }}
              style={{
                backgroundColor: key === selectedSortButton ? colors.primary : colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              }}
            >
              <Text
                key={key + 'text'}
                style={{
                  color: colors.text,
                  fontFamily: 'text',
                  textAlign: 'center',
                  paddingVertical: 3,
                }}
              >
                {SortOptions[key]}
              </Text>
            </AnimatedPressable>
          ))}
          <View style={{ borderTopWidth: 1, borderStyle: 'dashed', borderColor: colors.border }} />
          <Text
            style={{ color: colors.text, fontFamily: 'title', textAlign: 'center', fontSize: 20 }}
          >
            Filters
          </Text>
          <View style={{ rowGap: 5 }}>
            {(Object.keys(FilterOptions) as Array<keyof typeof FilterOptions>).map((optionKey) => (
              <Pressable
                key={optionKey}
                style={{ flexDirection: 'row' }}
                onPress={() => toggleOption(optionKey)} // Toggle option on press
              >
                <Text style={{ marginRight: 5 }}>
                  {selectedFilters.includes(optionKey)
                    ? checkboxIcons.checked
                    : checkboxIcons.unchecked}
                </Text>
                <Text style={{ color: colors.text, fontFamily: 'title', fontSize: 16 }}>
                  {FilterOptions[optionKey]}
                </Text>
              </Pressable>
            ))}
          </View>
          <AnimatedPressable
            onPress={handleSubmitSorting}
            style={[
              globalStyles.button,
              { backgroundColor: colors.primary, borderColor: colors.border, marginTop: 4 },
            ]}
          >
            <Text style={{ color: colors.text, fontFamily: 'textBold', fontSize: 18 }}>Apply</Text>
          </AnimatedPressable>
        </View>
      </Modal>
    </View>
  )
}

/**
  
 */

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    padding: 30,
  },
  potteryItemsContainer: {
    flexGrow: 1,
  },
  modalOpenButton: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 10,
    alignItems: 'center',
  },
  newProjectButton: {
    marginBottom: 5,
  },
  sortModalContent: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default PotteryItemList
