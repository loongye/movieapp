import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = createJSONStorage<any>(() => AsyncStorage);

export const categoryAtom = atomWithStorage<string>('category', 'Now Playing', storage);
export const sortAtom = atomWithStorage<string>('sort', 'By alphabetical order', storage);
export const searchTextAtom = atomWithStorage<string>('searchText', '', storage);
export const submittedSearchAtom = atomWithStorage<string>('submittedSearch', '', storage);

export const activeCategoryAtom = atomWithStorage<string>('activeCategory', 'Now Playing', storage);
export const activeSortAtom = atomWithStorage<string>('activeSort', 'By alphabetical order', storage);


