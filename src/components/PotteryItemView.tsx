import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useDatabase } from '../services/db-context';
import { getPotteryItemById } from '../services/potteryItem-service';
import { PotteryItem, Clay } from '../models';
import { getClaysByPotteryItemId } from '../services/potteryItem-clays-service';
import { getClayById } from '../services/clay-service';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './MyTabBar';

export type PotteryItemViewProps = {
  route: RouteProp<RootStackParamList, 'PotteryItemView'>;
};

const PotteryItemView = ({ route }: PotteryItemViewProps) => {
  const { id } = route.params;
  const DB = useDatabase();
  const [reload, setReload] = useState(false);
  const [potteryItem, setPotteryItem] = useState<PotteryItem | undefined>(undefined);
  const [clays, setClays] = useState<Clay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
  const loadDataCallback = useCallback(async () => {
    try {
      console.log('Starting loadDataCallback...');
      
      // Test `getPotteryItemById`
      console.log('Calling getPotteryItemById...');
      try {
        const storedPotteryItem = await getPotteryItemById(DB, id);
        console.log('Result of getPotteryItemById:', storedPotteryItem);
        if (storedPotteryItem) {
          setPotteryItem(storedPotteryItem);
        }
      } catch (error) {
        console.error('Error in getPotteryItemById:', getErrorMessage(error));
      }
  
      // Test `getClaysByPotteryItemId` and `getClayById`
      console.log('Calling getClaysByPotteryItemId...');
      try {
        const storedClays = await getClaysByPotteryItemId(DB, id);
        console.log('Result of getClaysByPotteryItemId:', storedClays);
  
        if (storedClays?.length) {
          console.log('Calling getClayById for each storedClay...');
          const clayDetails = await Promise.all(
            storedClays.map(async (potteryItemClay) => {
              try {
                const clay = await getClayById(DB, potteryItemClay.clayId);
                console.log('Result of getClayById for clayId:', potteryItemClay.clayId, clay);
                return clay;
              } catch (error) {
                console.error('Error in getClayById:', potteryItemClay.clayId, getErrorMessage(error));
                return null; // Handle the error gracefully
              }
            })
          );
  
          const validClayDetails = clayDetails.filter((clay) => clay !== null && clay !== undefined);
          setClays(validClayDetails);
        }
      } catch (error) {
        console.error('Error in getClaysByPotteryItemId or mapping clays:', getErrorMessage(error));
      }
    } catch (error) {
      console.error('Unknown error in loadDataCallback:', getErrorMessage(error));
    }
  }, [DB, id]);
  

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback, reload]);

  const handleFormSubmission = () => setReload((prev) => !prev);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text>Pottery Item Details</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {potteryItem && (
        <View>
          <Text>Pottery Item: {potteryItem.projectTitle}</Text>
          {clays.length > 0 ? (
            clays.map((clay, index) => <Text key={index}>{clay.name}</Text>)
          ) : (
            <Text>No clays found for this pottery item.</Text>
          )}
        </View>
      )}
      <Text onPress={handleFormSubmission}>Reload Data</Text>
    </View>
  );
};

export default PotteryItemView;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  errorText: {
    color: 'red',
  },
});
