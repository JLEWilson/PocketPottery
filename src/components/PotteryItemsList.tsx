import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, BackHandler } from 'react-native'
import { PotteryItemComponent } from './PotteryItem'
import { PotteryItem } from '../models'
import { useDatabase } from '../services/db-context'
import {
  createPotteryItemTable,
  getPotteryItems,
  resetPotteryItemTable,
} from '../services/potteryItem-service'
import NewPotteryItem from '../components/NewPotteryItem'
import { useFocusEffect, useIsFocused, useNavigation, useTheme } from '@react-navigation/native'
import {
  createPotteryItemFiringsTable,
  resetFiringsTable,
} from '../services/potteryItem-firing-service'
import {
  createPotteryItemGlazesTable,
  resetPotteryItemGlazesTable,
} from '../services/potteryItem-glaze-service'
import {
  createPotteryItemClaysTable,
  resetPotteryItemClaysTable,
} from '../services/potteryItem-clays-service'
import {
  createPotteryItemMeasurementsTable,
  resetMeasurementsTable,
} from '../services/potteryItem-measurements-service'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList, RootTabParamList } from './MyTabBar'
// import { resetClayTable } from '../services/clay-service'
// import { resetGlazeTable } from '../services/glaze-service'
// ad this on reset button in settings
import AnimatedPressable from './AnimatedPressable'
import globalStyles from '../constants/stylesheet'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

type PotteryItemsStackNavigationProp = StackNavigationProp<RootStackParamList, 'PotteryItemView'>
type PotteryItemsBottomNavigationProp = BottomTabNavigationProp<RootTabParamList, 'PotteryItemsList'>

const PotteryItemList = () => {
  const DB = useDatabase()
  const { colors } = useTheme()
  const isFocused = useIsFocused()
  const nav = useNavigation<PotteryItemsStackNavigationProp>()
  const navigation = useNavigation<PotteryItemsBottomNavigationProp>()
  const [potteryItems, setPotteryItems] = useState<PotteryItem[]>([])
  const [reload, setReload] = useState(false)
  const [formVisible, setFormVisible] = useState(false)

  const loadDataCallback = useCallback(async () => {
    try {
      await createPotteryItemTable(DB)
      await createPotteryItemClaysTable(DB)
      await createPotteryItemGlazesTable(DB)
      await createPotteryItemFiringsTable(DB)
      await createPotteryItemMeasurementsTable(DB)
      const storedPotteryItems = await getPotteryItems(DB)
      if (storedPotteryItems.length) {
        setPotteryItems(storedPotteryItems)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error loading pottery items: ${error.message}`)
      } else {
        console.error('Unknown error occurred while loading pottery items.')
      }
    }
  }, [DB, reload])
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
    if (isFocused) {
      loadDataCallback(); 
    }
  }, [isFocused, reload, loadDataCallback]);

  const handleReload = () => {
    setReload((prev) => !prev)
  }
  const handlePress = (id: string) => {
    nav.navigate('PotteryItemView', { id })
  }
  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {potteryItems.map((p) => (
          <PotteryItemComponent key={p.potteryItemId} potteryItem={p} handlePress={handlePress} />
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
          <Text style={[{ color: colors.text, fontFamily: 'textBold', fontSize: 20 }, { flex: 1, textAlign: 'center' },]}>
            New Project
          </Text>
        </AnimatedPressable>
      </View>
      <NewPotteryItem callBackFunction={handleReload} formVisible={formVisible} setFormVisible={setFormVisible} />
    </View>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
})

export default PotteryItemList
