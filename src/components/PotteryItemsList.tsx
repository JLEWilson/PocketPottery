import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { PotteryItemComponent } from './PotteryItem';
import { PotteryItem } from '../models';
import { useDatabase } from '../services/db-context';
import {
  createPotteryItemTable,
  getPotteryItems,
  resetPotteryItemTable,
} from '../services/potteryItem-service';
import NewPotteryItem from '../components/NewPotteryItem';
import { useTheme } from '@react-navigation/native';

const PotteryItemList = () => {
  const DB = useDatabase();
  const {colors} = useTheme()
  const [potteryItems, setPotteryItems] = useState<PotteryItem[]>([]); 
  const [reload, setReload] = useState(false)

  const loadDataCallback = useCallback(async () => {
    try {
      await createPotteryItemTable(DB);
      const storedPotteryItems = await getPotteryItems(DB);
      if (storedPotteryItems.length) {
        setPotteryItems(storedPotteryItems);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error loading pottery items: ${error.message}`);
      } else {
        console.error('Unknown error occurred while loading pottery items.');
      }
    }
  }, [DB]);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback, reload]);

  const handleFormSubmission = () => {
    setReload((prev) => !prev);
  }

  return (
    <View style={{backgroundColor: colors.background, flex: 1}}>
      <ScrollView  contentContainerStyle={styles.scrollView}>
          {potteryItems.map((p) => (
            <PotteryItemComponent key={p.potteryItemId} potteryItem={p} />
          ))}
      </ScrollView>
      <NewPotteryItem callBackFunction={handleFormSubmission} />
      <View style={{position:'absolute', bottom: 0, right: 0}}>
        <Button title='resetdata' onPress={() => resetPotteryItemTable(DB)}/>
      </View>
    </View>
  );
};

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
});

export default PotteryItemList;
