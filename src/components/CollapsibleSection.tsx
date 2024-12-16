import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

type CollapsibleSectionProps= {
    showText: string,
    hideText: string,
    onExpand: () => void,
    onCollapse: () => void;
    children: React.ReactNode;
}

const CollapsibleSection = ({showText, hideText, onExpand, onCollapse, children}: CollapsibleSectionProps) => {
  const {colors} = useTheme()  
  const [isExpanded, setIsExpanded] = useState(false);
    const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
    const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
    
    const scrollIndicatorSize =
      completeScrollBarHeight > visibleScrollBarHeight
        ? (visibleScrollBarHeight * visibleScrollBarHeight) /
          completeScrollBarHeight
        : visibleScrollBarHeight;

    const toggleDetails = () => {
      setIsExpanded(!isExpanded);
      isExpanded ? onCollapse() : onExpand() 
    };
    
    const scrollIndicator = useRef(new Animated.Value(0)).current;
    const difference =
  visibleScrollBarHeight > scrollIndicatorSize
    ? visibleScrollBarHeight - scrollIndicatorSize
    : 1;

const scrollIndicatorPosition = Animated.multiply(
  scrollIndicator,
  visibleScrollBarHeight / completeScrollBarHeight
).interpolate({
  inputRange: [0, difference],
  outputRange: [0, difference],
  extrapolate: "clamp",
});

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleDetails} style={styles.toggleButton}>
            <View style={{borderWidth: 1, borderColor: colors.text, height: 0, flex: 1}}/>
               <View style={{flexDirection: 'row', flex:3, justifyContent:'center'}}>
                  <Text style={[styles.toggleButtonText, {color: colors.text}]}>
                    {isExpanded ? hideText: showText}
                  </Text>
                  {isExpanded ? 
                    <Ionicons name="caret-up-outline" size={24}color={colors.text} />
                    : 
                    <Ionicons name="caret-down-outline" size={24} color={colors.text} />
                  }

                </View>
              <View style={{borderWidth: 1, borderColor: colors.text, height: 0, flex: 1}}/>
            </TouchableOpacity>
            {isExpanded &&
                <View style={[styles.scrollArea, {backgroundColor: colors.background, borderColor: colors.border}]}>
                  <ScrollView 
                    contentContainerStyle={{backgroundColor: colors.background }}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onContentSizeChange={(_,height) => {
                      setCompleteScrollBarHeight(height);
                    }}
                    onLayout={({
                      nativeEvent: {
                        layout: { height }
                      }
                    }) => {
                      setVisibleScrollBarHeight(height);
                    }}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
                      { useNativeDriver: false }
                    )}
                    >
                      {children}
                  </ScrollView>
                  <View
              style={{
                height: '100%',
                width: 6,
                backgroundColor: colors.card,
                borderRadius: 8
              }}
            >
              <Animated.View
                style={{
                  width: 6,
                  borderRadius: 8,
                  backgroundColor: colors.primary,
                  height: scrollIndicatorSize,
                  transform: [{ translateY: scrollIndicatorPosition }]
                }}
              />
            </View>
                </View>
            }
        </View>
    );
};

export default CollapsibleSection;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding:4
    },
    toggleButton: {
      padding: 10,
      alignItems: 'center',
      marginBottom: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    toggleButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,

    },
    detailsText: {
      fontSize: 14,
      color: 'black',
    },
    scrollArea: {
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: 'black',
      flex: 1, 
      flexDirection: "row", 
    }
  });
  
