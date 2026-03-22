import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface DropdownProps {
  label?: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsExpanded(false);
  };

  const ChevronIcon = ({ direction }: { direction: 'down' | 'right' }) => (
    <Svg
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="none"
      style={{
        transform: [{ rotate: direction === 'down' ? '90deg' : '0deg' }],
      }}
    >
      <Path
        d="M8.92174 7.35486L2.36495 13.7343C2.30471 13.7929 2.22301 13.8259 2.13782 13.8259C2.05264 13.8259 1.97094 13.7929 1.9107 13.7343L0.0940664 11.9665C0.0338367 11.9079 0 11.8284 0 11.7456C0 11.6627 0.0338367 11.5832 0.0940664 11.5246L4.83368 6.91293L0.0940664 2.30127C0.0338367 2.24266 0 2.16318 0 2.0803C0 1.99742 0.0338367 1.91794 0.0940664 1.85934L1.9107 0.0915247C1.97094 0.0329221 2.05264 0 2.13782 0C2.22301 0 2.30471 0.0329221 2.36495 0.0915247L8.92174 6.471C8.9814 6.52903 9.02872 6.59793 9.06101 6.67375C9.09329 6.74958 9.10991 6.83085 9.10991 6.91293C9.10991 6.99501 9.09329 7.07628 9.06101 7.15211C9.02872 7.22794 8.9814 7.29683 8.92174 7.35486Z"
        fill="black"
      />
    </Svg>
  );

  return (
    <View
      style={styles.container}
    >
      <Pressable style={styles.header} onPress={toggleExpand}>
        <Text style={styles.headerText}>{label ? `${label}: ${value}` : value}</Text>

        <ChevronIcon direction={isExpanded ? 'down' : 'right'} />
      </Pressable>

      {isExpanded && (
        <>
          <View style={styles.divider} />
          <View style={styles.list}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.item,
                  value === option ? styles.itemSelected : styles.itemUnselected,
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text
                  style={[
                    styles.itemText,
                    value === option && styles.itemTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1.5,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderColor: '#E3E3E3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'SourceSans3-SemiBold',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  list: {
    padding: 12,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  itemSelected: {
    backgroundColor: '#00B3E5',
  },
  itemUnselected: {
    backgroundColor: '#F9FAFB',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'SourceSans3-Regular',
  },
  itemTextSelected: {
    color: '#fff',
  },
});
