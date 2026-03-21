import React, { useState } from 'react';
import { Dropdown } from './Dropdown';

const SORT_OPTIONS = [
  'By alphabetical order',
  'By rating',
  'By release date',
];

interface SortDropdownProps {
  onSortChange?: (sortOption: string) => void;
  initialSort?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  onSortChange,
  initialSort = 'By alphabetical order',
}) => {
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const handleSelect = (sortOption: string) => {
    setSelectedSort(sortOption);
    onSortChange?.(sortOption);
  };

  return (
    <Dropdown
      label="Sort by"
      value={selectedSort}
      options={SORT_OPTIONS}
      onSelect={handleSelect}
    />
  );
};
