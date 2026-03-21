import React, { useState } from 'react';
import { Dropdown } from './Dropdown';

const CATEGORIES = ['Now Playing', 'Upcoming', 'Popular'];

interface CategoryDropdownProps {
  onCategoryChange?: (category: string) => void;
  initialCategory?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  onCategoryChange,
  initialCategory = 'Now Playing',
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  return (
    <Dropdown
      value={selectedCategory}
      options={CATEGORIES}
      onSelect={handleSelect}
    />
  );
};
