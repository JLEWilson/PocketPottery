import React, { useEffect, useState, useCallback } from 'react'
import type { Glaze } from '../models'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal'
import NewGlaze from './NewGlaze';
import { useDatabase } from '../services/db-context';
import { createGlazeTable, getGlazes } from '../services/glaze-service';
import globalStyles from '../globalStyles/stylesheet';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';

export type GlazesListProps = {
    onGlazeSelect?: (c: Glaze) => void;
    children?: React.ReactNode;
}

function GlazesList({children, onGlazeSelect}:GlazesListProps) {
    const DB = useDatabase()
    const {colors} = useTheme()
    const [selectedGlaze, setSelectedGlaze] = useState<Glaze>()
    const [allGlazes, setAllGlazes] = useState<Glaze[]>([])
    const [newGlazeFormVisible, setNewGlazeFormVisible] = useState(false)
    const [reload, setReload] = useState(false)

    const loadDataCallback = useCallback(async () => {
        try {
            await createGlazeTable(DB);
            const storedGlazes = await getGlazes(DB);
            console.log(storedGlazes)
            setAllGlazes(storedGlazes);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error Glazes items: ${error.message}`);
            } else {
                console.error('Unknown error occurred while loading Glazes.');
            }
        }
    }, [DB]);


    useEffect(() => {
        loadDataCallback();
    }, [loadDataCallback, reload]);


    const handleGlazeSelect = (g: Glaze) => {
        setSelectedGlaze(g)
        onGlazeSelect?.(g)
    }

    const handleModalSubmission = () => {
        setNewGlazeFormVisible(false)
        setReload((prev) => !prev);
    }

    return (
         <View style={[styles.container]}>
            <ScrollView style={styles.scrollContainer} indicatorStyle='white'>
                {allGlazes.map((g) => (
                    <AnimatedPressable key={"Button: " + g.glazeId}
                        onPress={() => handleGlazeSelect(g)}
                        style={[styles.button, {borderColor: colors.border}, selectedGlaze === g ? {backgroundColor: colors.primary} : {backgroundColor: colors.card}]}
                    >
                        <Text 
                            key={"Name: " + g.glazeId}
                            style={[styles.buttonText, {color: colors.text}]}
                            >{g.name}</Text>
                    </AnimatedPressable>
                ))}
            </ScrollView>
            <View style={{position: 'absolute', right: 0, left: 0, bottom: 10, alignItems: 'center'}}>
                <AnimatedPressable 
                    onPress={() => setNewGlazeFormVisible(true)}
                    style={[globalStyles.button, styles.newGlazeButton, {backgroundColor: colors.primary, borderColor: colors.border}]}
                >
                    <Text style={[styles.buttonText, {color: colors.text}]}>New Glaze</Text>
                </AnimatedPressable>
                {children}
            </View>
            <Modal
                isVisible={newGlazeFormVisible}
                animationIn={'zoomIn'} 
                animationInTiming={750}
                animationOut={'zoomOut'}
                animationOutTiming={750}
                backdropColor={colors.text}
                backdropOpacity={0.5}
                onBackdropPress={() => setNewGlazeFormVisible(false)}
                onBackButtonPress={() => setNewGlazeFormVisible(false)}
                backdropTransitionOutTiming={0}
            >
                <View style={{flex: 1}}>
                    <NewGlaze callBackFunction={handleModalSubmission}>
                        <AnimatedPressable
                            onPress={() => setNewGlazeFormVisible(false)}
                            style={{position: 'absolute', top: 10, right: 20, zIndex:3}}
                        >
                            <Ionicons name='close-circle-outline' size={30} color={colors.text}/>
                        </AnimatedPressable>
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
        marginTop:50
    },
    newGlazeButton: {
        width: 110,
        marginBottom: 5
      },
    button: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 30,
        borderRadius: 30,
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1
    }
})