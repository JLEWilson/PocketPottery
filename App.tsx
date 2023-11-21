import React, { useCallback, useEffect, useState } from 'react'
import {
	Button,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	useColorScheme,
	View,
} from 'react-native'
import { PotteryItemComponent } from './src/components/PotteryItem'
import { PotteryItem } from './src/models'
import { getDBConnection} from './src/services/db-service'
import { createPotteryItemTable, getPotteryItems, getPotteryItemById, addPotteryItem, updatePotteryItem , deletePotteryItemById} from './src/services/potteryItem-service'
const App = () => {
	const isDarkMode = useColorScheme() === 'dark'
	const [potteryItems, setPotteryItems] = useState<PotteryItem[]>([])
	const [newPotteryItem, setNewPotteryItem] = useState('')
	
	return (
		<View>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<ScrollView>
				<View style={[styles.appTitleView]}>
					<Text style={styles.appTitleText}> Pocket Pottery </Text>
				</View>
				<View>
					{potteryItems.map((p) => (
						<PotteryItemComponent key={p.potteryItemId} potteryItem={p} />
					))}
				</View>
				<View style={styles.textInputContainer}>
					<TextInput style={styles.textInput} value={newPotteryItem} onChangeText={text => setNewPotteryItem(text)} />
					<Button
						onPress={openForm}
						title="Add ToDo"
						color="#841584"
						accessibilityLabel="open pottery project form"
					/>
				</View>
			</ScrollView>
		</View>
	)
}
const styles = StyleSheet.create({
	appTitleView: {
		marginTop: 20,
		justifyContent: 'center',
		flexDirection: 'row',
	},
	appTitleText: {
		fontSize: 24,
		fontWeight: '800'
	},
	textInputContainer: {
		marginTop: 30,
		marginLeft: 20,
		marginRight: 20,
		borderRadius: 10,
		borderColor: 'black',
		borderWidth: 1,
		justifyContent: 'flex-end'
	},
	textInput: {
		borderWidth: 1,
		borderRadius: 5,
		height: 30,
		margin: 10,
		backgroundColor: 'pink'
	},
})
export default App