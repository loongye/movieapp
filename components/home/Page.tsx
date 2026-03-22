import React from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { useAtom } from "jotai";
import { categoryAtom, sortAtom, searchTextAtom, submittedSearchAtom, activeCategoryAtom, activeSortAtom } from "../../store/atoms";

import { useNowPlayingMovies, usePopularMovies, useUpcomingMovies, useSearchMovies } from "../../hooks/useMovieQueries";


import { MovieCard } from "./MovieCard";
import { Layout } from "../common/Layout";
import { CategoryDropdown } from "./CategoryDropdown";
import { SortDropdown } from "./SortDropdown";
import { SearchBar } from "./SearchBar";
import { SearchButton } from "./SearchButton";


const PageHeader = React.memo(({ handleSearch, submittedSearch, activeCategory }: any) => (
  <View style={{ paddingHorizontal: 29, marginBottom: 10 }}>
    <CategoryDropdown />
    <SortDropdown />
    <SearchBar />
    <SearchButton onPress={handleSearch} />
    {(submittedSearch || activeCategory) ? (
      <Text style={{ 
        fontSize: 22, 
        fontFamily: 'SourceSans3-Bold', 
        color: '#000', 
        marginTop: 20,
        marginBottom: 10
      }}>
        {submittedSearch ? `Search Results: ${submittedSearch}` : `${activeCategory} Movies`}
      </Text>
    ) : null}
  </View>
));

export const Page = () => {
  const [category] = useAtom(categoryAtom);
  const [sort] = useAtom(sortAtom);
  const [searchText] = useAtom(searchTextAtom);
  
  const [activeCategory, setActiveCategory] = useAtom(activeCategoryAtom);
  const [activeSort, setActiveSort] = useAtom(activeSortAtom);
  const [submittedSearch, setSubmittedSearch] = useAtom(submittedSearchAtom);

  const sortMap: Record<string, string> = {
    'By alphabetical order': 'original_title.asc',
    'By rating': 'vote_average.desc',
    'By release date': 'primary_release_date.desc',
  };

  const getSortBy = () => {
    return sortMap[activeSort] || 'popularity.desc';
  };

  const sortBy = getSortBy();
  const isSearchActive = !!submittedSearch;

  const nowPlayingQuery = useNowPlayingMovies(1, sortBy, !isSearchActive && activeCategory === 'Now Playing');
  const popularQuery = usePopularMovies(1, sortBy, !isSearchActive && activeCategory === 'Popular');
  const upcomingQuery = useUpcomingMovies(1, sortBy, !isSearchActive && activeCategory === 'Upcoming');
  const searchQueryResult = useSearchMovies(submittedSearch, 1, isSearchActive);

  // Determine which query to use
  const getActiveQuery = () => {
    if (isSearchActive) return searchQueryResult;
    if (activeCategory === 'Popular') return popularQuery;
    if (activeCategory === 'Upcoming') return upcomingQuery;
    return nowPlayingQuery;
  };

  const activeQuery = getActiveQuery();

  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;
  const movies = activeQuery.data?.results || [];

  const handleSearch = React.useCallback(() => {
    setActiveCategory(category);
    setActiveSort(sort);
    setSubmittedSearch(searchText);
  }, [category, sort, searchText, setActiveCategory, setActiveSort, setSubmittedSearch]);

  return (
    <Layout>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 29 }}>
            <MovieCard
              title={item.title}
              releaseDate={item.release_date}
              overview={item.overview}
              posterPath={item.poster_path}
            />
          </View>
        )}
        ListHeaderComponent={
          <PageHeader 
            handleSearch={handleSearch} 
            submittedSearch={submittedSearch}
            activeCategory={activeCategory}
          />
        }
        ListEmptyComponent={() => (
          <View style={{ padding: 29, alignItems: 'center' }}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#00B3E5" />
            ) : isError ? (
              <Text style={{ fontFamily: 'SourceSans3-Regular', color: 'red' }}>Error loading movies</Text>
            ) : (
              <Text style={{ fontFamily: 'SourceSans3-Regular', color: '#9CA3AF' }}>No movies found</Text>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </Layout>
  );
};