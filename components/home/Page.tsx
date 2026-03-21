import React, { useState } from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { Layout } from "../common/Layout";
import { CategoryDropdown } from "./CategoryDropdown";
import { SortDropdown } from "./SortDropdown";
import { SearchBar } from "./SearchBar";
import { SearchButton } from "./SearchButton";
import { MovieCard } from "./MovieCard";
import { useNowPlayingMovies, useSearchMovies } from "../../hooks/useMovieQueries";

export const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const nowPlayingQuery = useNowPlayingMovies();
  const searchQueryResult = useSearchMovies(submittedQuery);

  const isLoading = submittedQuery ? searchQueryResult.isLoading : nowPlayingQuery.isLoading;
  const isError = submittedQuery ? searchQueryResult.isError : nowPlayingQuery.isError;
  const movies = submittedQuery ? searchQueryResult.data?.results : nowPlayingQuery.data?.results;

  const handleSearch = () => {
    setSubmittedQuery(searchQuery);
  };

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 29, marginBottom: 10 }}>
      <CategoryDropdown />
      <SortDropdown />
      <SearchBar onSearch={setSearchQuery} />
      <SearchButton onPress={handleSearch} />
      {submittedQuery ? (
        <Text style={{ 
          fontSize: 22, 
          fontFamily: 'SourceSans3-Bold', 
          color: '#000', 
          marginTop: 20,
          marginBottom: 10
        }}>
          Search Results
        </Text>
      ) : null}
    </View>
  );

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
        ListHeaderComponent={renderHeader}
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