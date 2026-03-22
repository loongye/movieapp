import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAtom } from 'jotai';
import { watchlistAtom, watchlistSortAtom, watchlistOrderAtom } from '../../store/atoms';
import { WatchlistMovieCard } from './WatchlistMovieCard';
import { WatchlistSortDropdown } from './WatchlistSortDropdown';
import { Layout } from '../common/Layout';
import { useAccountDetails } from '../../hooks/useMovieQueries';
import Svg, { Path } from 'react-native-svg';

export const WatchlistPage = ({ navigation }: any) => {
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const [sortValue] = useAtom(watchlistSortAtom);
  const [orderValue, setOrderValue] = useAtom(watchlistOrderAtom);
  const { data: account, isLoading: isAccountLoading } = useAccountDetails();

  const sortedWatchlist = React.useMemo(() => {
    const list = [...watchlist];
    list.sort((a, b) => {
      let comparison = 0;
      if (sortValue === 'Alphabetical') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortValue === 'Rating') {
        comparison = a.vote_average - b.vote_average;
      } else if (sortValue === 'Release Date') {
        const dateA = new Date(a.release_date || 0).getTime();
        const dateB = new Date(b.release_date || 0).getTime();
        comparison = dateA - dateB;
      }
      return orderValue === 'asc' ? comparison : -comparison;
    });
    return list;
  }, [watchlist, sortValue, orderValue]);

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
        <TouchableOpacity onPress={() => navigation.navigate('HomeTab')} style={styles.backButton}>
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
        data={sortedWatchlist}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            {renderProfileHeader()}
            <View style={styles.contentPadding}>
              <Text style={styles.watchlistTitle}>My Watchlist</Text>

              <View style={styles.controlsRow}>
                <View style={styles.filterContainer}>
                  <Text style={styles.controlLabel}>Filter by:</Text>
                  <WatchlistSortDropdown />
                </View>

                <View style={styles.orderContainer}>
                  <Text style={styles.controlLabel}>Order:</Text>
                  <TouchableOpacity 
                    style={styles.orderButton}
                    onPress={() => setOrderValue(orderValue === 'asc' ? 'desc' : 'asc')}
                  >
                    <Svg 
                      width="10" 
                      height="15" 
                      viewBox="0 0 10 15" 
                      fill="none"
                      style={{ transform: [{ rotate: orderValue === 'asc' ? '0deg' : '180deg' }] }}
                    >
                        <Path 
                          fillRule="evenodd" 
                          clipRule="evenodd" 
                          d="M5.88413 0.295652L9.61713 3.51739C10.1159 3.94783 10.1159 4.63043 9.61713 5.06087C9.11839 5.46957 8.30227 5.46957 7.82872 5.06087L6.2267 3.72174V13.9087C6.2267 14.4783 5.67254 14.9957 4.99244 14.9957C4.31234 14.9957 3.733 14.4739 3.733 13.9087V3.72174L2.15617 5.06087C1.65743 5.46957 0.866499 5.46957 0.367758 5.06087C0.130982 4.83478 0 4.58261 0 4.31304C0 4.01739 0.130982 3.74783 0.367758 3.51739L4.09572 0.295652C4.2267 0.182609 4.33249 0.113043 4.51889 0.0695652C4.67506 0.026087 4.80605 0 4.99244 0C5.33501 0 5.64736 0.0913044 5.88413 0.295652Z" 
                          fill="black"
                        />
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
    fontWeight: 'bold',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: 'bold',
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
    fontSize: 18,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: '700',
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
    marginRight: 20,
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular',
    fontWeight: '400',
    color: '#9CA3AF',
    marginRight: 10,
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
