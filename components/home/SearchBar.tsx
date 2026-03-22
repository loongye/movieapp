import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useAtom } from 'jotai';
import { searchTextAtom } from '../../store/atoms';

export const SearchBar: React.FC = () => {
  const [searchText, setSearchText] = useAtom(searchTextAtom);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor="#9CA3AF"
        value={searchText}
        onChangeText={setSearchText}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#E3E3E3',
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontFamily: 'SourceSans3-Regular',
    color: '#000',
  },
});
