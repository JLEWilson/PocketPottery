import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PotteryItemComponent } from './PotteryItem';
import { PotteryItem } from '../models';
import { useDatabase } from '../services/db-context';
import {
  createPotteryItemTable,
  getPotteryItems,
} from '../services/potteryItem-service';
import NewPotteryItem from '../components/NewPotteryItem';

const PotteryItemList = () => {

  const [potteryItems, setPotteryItems] = useState<PotteryItem[]>([]);
  const DB = useDatabase(); // Access the shared database instance

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
  }, [loadDataCallback]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.appTitleView}>
          <Text style={styles.appTitleText}>Pocket Pottery</Text>
        </View>
        <View style={styles.potteryItemsContainer}>
          {potteryItems.map((p) => (
            <PotteryItemComponent key={p.potteryItemId} potteryItem={p} />
          ))}
        </View>
      </ScrollView>
      <NewPotteryItem />
    </>
  );
};

const styles = StyleSheet.create({
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  potteryItemsContainer: {
    flexGrow: 1,
  },
});

export default PotteryItemList;
