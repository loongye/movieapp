import React from "react";
import { FlatList, View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAtom } from "jotai";
import { categoryAtom, sortAtom, searchTextAtom, submittedSearchAtom, activeCategoryAtom, activeSortAtom } from "../../store/atoms";

import {
    useInfiniteNowPlayingMovies,
    useInfinitePopularMovies,
    useInfiniteUpcomingMovies,
    useInfiniteSearchMovies
} from "../../hooks/useMovieQueries";

import { MovieCard } from "./MovieCard";
import { Layout } from "../common/Layout";
import { CategoryDropdown } from "./CategoryDropdown";
import { SortDropdown } from "./SortDropdown";
import { SearchBar } from "./SearchBar";
import { SearchButton } from "./SearchButton";


const PageHeader = React.memo(({ handleSearch, submittedSearch }: any) => (
    <View style={{ paddingHorizontal: 29, marginBottom: 30 }}>
        <CategoryDropdown />
        <SortDropdown />
        <SearchBar />
        <SearchButton onPress={handleSearch} />
        {submittedSearch ? (
            <Text style={{
                fontSize: 22,
                fontFamily: 'SourceSans3-Bold',
                color: '#000',
                marginTop: 20,
                marginBottom: 10
            }}>
                Search Results: {submittedSearch}
            </Text>
        ) : null}
    </View>
));

export const Page = ({ navigation }: any) => {
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

    const sortBy = sortMap[activeSort] || 'popularity.desc';
    const isSearchActive = !!submittedSearch;

    // Infinite Query hooks
    const nowPlayingInfinite = useInfiniteNowPlayingMovies(sortBy, !isSearchActive && activeCategory === 'Now Playing');
    const popularInfinite = useInfinitePopularMovies(sortBy, !isSearchActive && activeCategory === 'Popular');
    const upcomingInfinite = useInfiniteUpcomingMovies(sortBy, !isSearchActive && activeCategory === 'Upcoming');
    const searchInfinite = useInfiniteSearchMovies(submittedSearch, isSearchActive);

    // Determine which query to use
    const getActiveQuery = () => {
        if (isSearchActive) return searchInfinite;
        if (activeCategory === 'Popular') return popularInfinite;
        if (activeCategory === 'Upcoming') return upcomingInfinite;
        return nowPlayingInfinite;
    };

    const activeQuery = getActiveQuery();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = activeQuery;

    // Flatten results
    const movies = React.useMemo(() => {
        return data?.pages.flatMap(page => page.results) || [];
    }, [data?.pages]);

    const handleSearch = React.useCallback(() => {
        setActiveCategory(category);
        setActiveSort(sort);
        setSubmittedSearch(searchText);
    }, [category, sort, searchText, setActiveCategory, setActiveSort, setSubmittedSearch]);

    const renderFooter = () => {
        if (!hasNextPage) return null;

        return (
            <View style={styles.footerContainer}>
                <TouchableOpacity
                    style={[styles.loadMoreButton, isFetchingNextPage && styles.loadMoreButtonDisabled]}
                    onPress={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    activeOpacity={0.8}
                >
                    {isFetchingNextPage ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator color="white" style={{ marginRight: 10 }} />
                            <Text style={styles.loadMoreText}>Loading...</Text>
                        </View>
                    ) : (
                        <Text style={styles.loadMoreText}>Load More</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Layout>
            <FlatList
                data={movies}
                extraData={movies.length}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
                removeClippedSubviews={false}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: 29 }}>
                        <MovieCard
                            title={item.title}
                            releaseDate={item.release_date}
                            overview={item.overview}
                            posterPath={item.poster_path}
                            onPress={() => navigation.navigate('Details', { movieId: item.id })}
                        />
                    </View>
                )}
                ListHeaderComponent={
                    <PageHeader
                        handleSearch={handleSearch}
                        submittedSearch={submittedSearch}
                    />
                }
                ListFooterComponent={renderFooter}
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
                contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
                style={{ flex: 1 }}
            />
        </Layout>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        paddingHorizontal: 29,
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadMoreButton: {
        backgroundColor: '#00B3E5',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    loadMoreButtonDisabled: {
        opacity: 0.8,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadMoreText: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'SourceSans3-Bold',
    },
});