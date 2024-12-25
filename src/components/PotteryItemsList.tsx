import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native'
import { PotteryItemComponent } from './PotteryItem'
import { PotteryItem } from '../models'
import { useDatabase } from '../services/db-context'
import {
  createPotteryItemTable,
  getPotteryItems,
  resetPotteryItemTable,
} from '../services/potteryItem-service'
import NewPotteryItem from '../components/NewPotteryItem'
import { useNavigation, useTheme } from '@react-navigation/native'
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
import { RootStackParamList } from './MyTabBar'
import { resetClayTable } from '../services/clay-service'
import { resetGlazeTable } from '../services/glaze-service'

type PotteryItemsListNavigationProp = StackNavigationProp<RootStackParamList, 'PotteryItemView'>

const PotteryItemList = () => {
  const DB = useDatabase()
  const { colors } = useTheme()
  const nav = useNavigation<PotteryItemsListNavigationProp>()
  const [potteryItems, setPotteryItems] = useState<PotteryItem[]>([])
  const [reload, setReload] = useState(false)

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

  useEffect(() => {
    loadDataCallback()
  }, [loadDataCallback, reload])

  const handleFormSubmission = () => {
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
      <NewPotteryItem callBackFunction={handleFormSubmission} />
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
})

export default PotteryItemList
