import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAtom } from 'jotai';
import { watchlistAtom } from '../../store/atoms';
import { WatchlistMovieCard } from './WatchlistMovieCard';
import { Layout } from '../common/Layout';
import { useAccountDetails } from '../../hooks/useMovieQueries';
import Svg, { Path, Circle } from 'react-native-svg';

export const WatchlistPage = ({ navigation }: any) => {
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const { data: account, isLoading: isAccountLoading } = useAccountDetails();

  const renderProfileHeader = () => {
    if (isAccountLoading) {
      return (
        <View style={[styles.profileHeader, { height: 150, justifyContent: 'center' }]}>
          <ActivityIndicator color="white" />
        </View>
      );
    }

    const username = account?.username || account?.name || 'User';
    // TMDB doesn't provide a 'joined date' in v3, so we use a fallback if not available
    // or just display the username as requested.
    const displayName = account?.name || account?.username || 'Member';

    return (
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <View style={styles.profileInfoRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{username.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileMemberSince}>Member</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Layout>
      <FlatList
        data={watchlist}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            {renderProfileHeader()}
            <View style={styles.contentPadding}>
              <Text style={styles.watchlistTitle}>My Watchlist</Text>

              <View style={styles.controlsRow}>
                <View style={styles.filterContainer}>
                  <Text style={styles.controlLabel}>Filter by:</Text>
                  <TouchableOpacity style={styles.dropdownButton}>
                    <Text style={styles.dropdownText}>Rating</Text>
                    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <Path d="M6 9L12 15L18 9" stroke="#00B3E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>

                <View style={styles.orderContainer}>
                  <Text style={styles.controlLabel}>Order:</Text>
                  <TouchableOpacity style={styles.orderButton}>
                    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <Path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.contentPadding}>
            <WatchlistMovieCard
              title={item.title}
              releaseDate={item.release_date}
              overview={item.overview}
              posterPath={item.poster_path}
              onPress={() => navigation.navigate('Details', { movieId: item.id })}
              onRemove={() => setWatchlist(watchlist.filter((m: any) => m.id !== item.id))}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your watchlist is empty.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{ flex: 1 }}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: '#032541',
    paddingTop: 10,
    paddingBottom: 35,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9033FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarInitial: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'SourceSans3-Bold',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'SourceSans3-Bold',
    marginBottom: 2,
  },
  profileMemberSince: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'SourceSans3-Regular',
  },
  contentPadding: {
    paddingHorizontal: 29,
  },
  watchlistTitle: {
    fontSize: 22,
    fontFamily: 'SourceSans3-Bold',
    color: '#000',
    marginBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular',
    color: '#9CA3AF',
    marginRight: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#00B3E5',
    paddingBottom: 2,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'SourceSans3-Bold',
    color: '#00B3E5',
    marginRight: 5,
  },
  orderButton: {
    padding: 2,
  },
  emptyContainer: {
    padding: 29,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'SourceSans3-Regular',
    color: '#9CA3AF',
    fontSize: 16,
  },
});
