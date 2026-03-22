import React from 'react';
import { useAtom } from 'jotai';
import { Dropdown } from './Dropdown';
import { categoryAtom } from '../../store/atoms';

const CATEGORIES = ['Now Playing', 'Upcoming', 'Popular'];

export const CategoryDropdown: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useAtom(categoryAtom);

  return (
    <Dropdown
      value={selectedCategory}
      options={CATEGORIES}
      onSelect={setSelectedCategory}
    />
  );
};

