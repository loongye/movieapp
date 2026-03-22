import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SearchButtonProps {
  onPress?: () => void;
  title?: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({
  onPress,
  title = 'Search',
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E5E5E5',
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontFamily: 'SourceSans3-SemiBold',
    fontWeight: '600',
    color: '#737373',
  },
});
