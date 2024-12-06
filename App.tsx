import React from 'react';
import { DatabaseProvider } from './src/services/db-context';
import { useColorScheme, StatusBar } from 'react-native';
import PotteryItemList from './src/components/PotteryItemsList';

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';
	
	return (
    	<DatabaseProvider>
			{/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
      		<PotteryItemList/>
    	</DatabaseProvider>
  );
};

export default App;
