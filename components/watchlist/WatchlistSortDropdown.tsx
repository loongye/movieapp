import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useAtom } from 'jotai';
import { watchlistSortAtom } from '../../store/atoms';
import Svg, { Path } from 'react-native-svg';

const data = [
  { label: 'Alphabetical order', value: 'Alphabetical' },
  { label: 'Rating', value: 'Rating' },
  { label: 'Release date', value: 'Release Date' },
];

export const WatchlistSortDropdown = () => {
  const [value, setValue] = useAtom(watchlistSortAtom);

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={[styles.textItem, item.value === value && styles.textItemActive]}>
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      containerStyle={styles.containerStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select item"
      value={value}
      onChange={item => {
        setValue(item.value);
      }}
      renderItem={renderItem}
      renderRightIcon={() => (
        <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 5 }}>
          <Path d="M6 9L12 15L18 9" stroke="#00B4E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      )}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 30,
    minWidth: 140,
    borderBottomColor: '#00B4E4',
    borderBottomWidth: 1,
  },
  containerStyle: {
    width: 200,
    borderRadius: 8,
    marginTop: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: 'SourceSans3-SemiBold',
    fontWeight: '600',
    color: '#00B4E4',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'SourceSans3-SemiBold',
    fontWeight: '600',
    color: '#00B4E4',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular',
    color: '#000',
  },
  textItemActive: {
    color: '#00B3E5',
    fontFamily: 'SourceSans3-Bold',
  },
});
