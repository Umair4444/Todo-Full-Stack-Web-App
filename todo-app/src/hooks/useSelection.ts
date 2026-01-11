import { useState, useCallback } from 'react';

export const useSelection = <T extends string | number>(initialSelection: T[] = []) => {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelection);

  const toggleSelection = useCallback((item: T) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedItems(items);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const isSelected = useCallback((item: T) => {
    return selectedItems.includes(item);
  }, [selectedItems]);

  return {
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    setSelectedItems
  };
};