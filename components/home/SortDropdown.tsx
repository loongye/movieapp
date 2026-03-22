import React from 'react';
import { useAtom } from 'jotai';
import { Dropdown } from './Dropdown';
import { sortAtom } from '../../store/atoms';

const SORT_OPTIONS = [
  'By alphabetical order',
  'By rating',
  'By release date',
];

export const SortDropdown: React.FC = () => {
  const [selectedSort, setSelectedSort] = useAtom(sortAtom);

  return (
    <Dropdown
      label="Sort by"
      value={selectedSort}
      options={SORT_OPTIONS}
      onSelect={setSelectedSort}
    />
  );
};

