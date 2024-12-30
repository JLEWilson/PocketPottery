import React, { useEffect, useState, useCallback, useRef } from 'react'
import type { Clay } from '../models'
import { Pressable, TouchableOpacity, ScrollView, StyleSheet, Text, View, BackHandler, Animated } from 'react-native'
import Modal from 'react-native-modal'
import NewClay from './NewClay'
import { useDatabase } from '../services/db-context'
import { createClayTable, getClays } from '../services/clay-service'
import globalStyles from '../constants/stylesheet'
import { useFocusEffect, useIsFocused, useNavigation, useTheme } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import AnimatedPressable from './AnimatedPressable'
import { RootTabParamList } from './MyTabBar'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

export type ClaysListProps = {
  onClaySelect?: (c: Clay[]) => void
  children?: React.ReactNode
}

type PotteryItemsListNavigationProp = BottomTabNavigationProp<RootTabParamList, 'PotteryItemsList'>
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

function ClaysList({ onClaySelect, children }: ClaysListProps) {
  const DB = useDatabase()
  const navigation = useNavigation<PotteryItemsListNavigationProp>()
  const isFocused = useIsFocused()
  const { colors } = useTheme()
  const [selectedClays, setSelectedClays] = useState<Clay[]>([])
  const [allClays, setAllClays] = useState<Clay[]>([])
  const [newClayFormVisible, setNewClayFormVisible] = useState(false)
  const [reload, setReload] = useState(false)
  const rectHeights = useRef<Record<string, Animated.Value>>({})
  const [currentExpandedId, setCurrentExpandedId] = useState<string | null>(null);
  const maxHeight = 300
  const animationDuration = 300

  const loadDataCallback = useCallback(async () => {
    try {
      await createClayTable(DB)
      const storedClays = await getClays(DB)
      setAllClays(storedClays)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error clays items: ${error.message}`)
      } else {
        console.error('Unknown error occurred while loading clays.')
      }
    }
  }, [DB])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Navigate to PotteryItemsList when back button is pressed
        navigation.navigate('PotteryItemsList')
        return true // Prevent default back behavior
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

  useEffect(() => {
    const initializeRectHeights = () => {
      allClays.forEach((clay) => {
        if (!rectHeights.current[clay.clayId]) {
          rectHeights.current[clay.clayId] = new Animated.Value(1); // Initial size
        }
      });
    };
    initializeRectHeights();
  }, [allClays]);

  
const animateHeight = (id: string) => {
  const currentSize = rectHeights.current[id];
  if (!currentSize) {
    console.log(`Animated.Value not initialized for id: ${id}`);
    return;
  }

  if (currentExpandedId === id) {
    setCurrentExpandedId(null);
    Animated.timing(currentSize, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  } else {
    if (currentExpandedId) {
      const previousExpandedId = currentExpandedId;
      const previousSize = rectHeights.current[previousExpandedId];
      if (previousSize) {
        Animated.timing(previousSize, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: false,
        }).start();
      }
    }

    Animated.timing(currentSize, {
      toValue: maxHeight,
      duration: animationDuration,
      useNativeDriver: false,
    }).start(() => {
      setCurrentExpandedId(id) 
    });
  }
};

  const handleClaySelect = (c: Clay) => {
    if(onClaySelect) {
      setSelectedClays((prevSelectedClays) => {
        const isSelected = prevSelectedClays.some((selected) => selected.clayId === c.clayId);
    
        // Determine the updated state
        const updatedClays = isSelected
          ? prevSelectedClays.filter((selected) => selected.clayId !== c.clayId) // Remove if selected
          : [...prevSelectedClays, c]; // Add if not selected
    
        // If onClaySelect is defined, call it with the updated state
        onClaySelect(updatedClays);
    
        return updatedClays; // Update the local state
      });
    } else {
      selectedClays.includes(c) ? setSelectedClays([]) : setSelectedClays([c])
      animateHeight(c.clayId)
    }
  };

  const handleModalSubmission = () => {
    setNewClayFormVisible(false)
    setReload((prev) => !prev)
  }

  return (
    <View style={[styles.container]}>
      <ScrollView style={styles.scrollContainer} indicatorStyle="white">
        {allClays.map((c) => 
        onClaySelect ?
        (
          <AnimatedPressable
            key={'Button: ' + c.clayId}
            onPress={() => handleClaySelect(c)}
            style={[
              styles.button,
              { borderColor: colors.border },
              selectedClays.some((selected) => selected.clayId === c.clayId)
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card },
            ]}
          >
            <Text
              key={'Name: ' + c.clayId}
              style={[styles.buttonText, { color: colors.text, fontFamily: 'textBold' }]}
            >
              {c.name}
            </Text>
          </AnimatedPressable>
        )
        :
        (
          <AnimatedTouchable 
          key={'Button: ' + c.clayId}
          onPress={() => handleClaySelect(c)}
          style={[
            styles.button,
            { 
              borderColor: colors.border,
              minHeight: rectHeights.current[c.clayId]
            },
            selectedClays.some((selected) => selected.clayId === c.clayId)
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.card },
          ]}
        >
          <Text
            key={'Name: ' + c.clayId}
            style={[
              styles.buttonText, 
              { color: colors.text, fontFamily: 'textBold' }
            ]}
          >
            {c.name}
          </Text>
          
            {currentExpandedId === c.clayId && (
              <View>
                {
                  c.manufacturer.length > 1 &&
                  <Text style={{ color: colors.text }}>manu</Text>
                }
                {
                  c.notes.length > 1 &&
                <Text style={{ color: colors.text }}>{c.notes}</Text>
                }
              </View>
            )}
          
          </AnimatedTouchable>
        )
        )}
      </ScrollView>
      <View style={{ position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center' }}>
        <AnimatedPressable
          onPress={() => setNewClayFormVisible(true)}
          style={[
            globalStyles.button,
            styles.newClayButton,
            { backgroundColor: colors.primary, borderColor: colors.border },
          ]}
        >
          <Text style={[{ color: colors.text, fontFamily: 'textBold', fontSize: 16 }, onClaySelect == undefined ? {fontSize: 20 } : {fontSize: 16}]}>
            New Clay
          </Text>
        </AnimatedPressable>
        {children}
      </View>
      <Modal
        isVisible={newClayFormVisible}
        animationIn={'zoomIn'}
        animationInTiming={750}
        animationOut={'zoomOut'}
        animationOutTiming={750}
        backdropColor={colors.border}
        backdropOpacity={0.5}
        onBackdropPress={() => setNewClayFormVisible(false)}
        onBackButtonPress={() => setNewClayFormVisible(false)}
        backdropTransitionOutTiming={0}
      >
        <View style={{ flex: 1 }}>
          <NewClay callBackFunction={handleModalSubmission}>
            <Pressable
              onPress={() => setNewClayFormVisible(false)}
              style={{ position: 'absolute', top: 10, right: 20, zIndex: 2 }}
            >
              <Ionicons name="close-circle-outline" size={30} color={colors.text} />
            </Pressable>
          </NewClay>
        </View>
      </Modal>
    </View>
  )
}

export default ClaysList

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
  newClayButton: {
    marginBottom: 5,
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 30,
    borderRadius: 30,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
  },
});