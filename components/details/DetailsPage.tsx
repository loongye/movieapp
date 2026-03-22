import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useMovieDetails, useMovieCredits, useMovieReleaseDates } from '../../hooks/useMovieQueries';
import Svg, { Circle, Path } from 'react-native-svg';
import { Layout } from '../common/Layout';
import { useAtom } from 'jotai';
import { watchlistAtom } from '../../store/atoms';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const UserScore = ({ percentage }: { percentage: number }) => {
  const radius = 38; // Total canvas radius
  const diskRadius = 36;
  const trackRadius = 30;
  const stroke = 4;
  const circumference = trackRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 70) return { active: '#21d07a', track: '#204529' };
    if (percentage >= 40) return { active: '#d2d531', track: '#423d0f' };
    return { active: '#db2360', track: '#571435' };
  };

  const colors = getColor();

  return (
    <View style={styles.scoreContainer}>
      <Svg height={radius * 2} width={radius * 2}>
        {/* Outer Disk */}
        <Circle
          fill="#081C22"
          r={diskRadius}
          cx={radius}
          cy={radius}
        />
        {/* Track Background */}
        <Circle
          stroke={colors.track}
          fill="transparent"
          strokeWidth={stroke}
          r={trackRadius}
          cx={radius}
          cy={radius}
        />
        {/* Active Progress */}
        <Circle
          stroke={colors.active}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={trackRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <View style={styles.scoreTextContainer}>
            <View style={styles.scoreTextRow}>
                <Text style={styles.scoreText}>{percentage}</Text>
                <Text style={styles.percentSymbol}>%</Text>
            </View>
        </View>
      </Svg>
      <Text style={styles.scoreLabel}>User Score</Text>
    </View>
  );
};

const CastCarousel = ({ cast }: { cast: any[] }) => {
  return (
    <View style={styles.castSection}>
      <Text style={styles.castTitle}>Top Billed Cast</Text>
      <FlatList
        data={cast.slice(0, 10)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.castCard}>
            <Image
              source={{
                uri: item.profile_path
                  ? `${IMAGE_BASE_URL}${item.profile_path}`
                  : 'https://via.placeholder.com/150',
              }}
              style={styles.castImage}
            />
            <View style={styles.castInfo}>
              <Text style={styles.castName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.castRole} numberOfLines={2}>
                {item.character}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.castList}
      />
    </View>
  );
};

export const DetailsPage = ({ route, navigation }: any) => {
  const { movieId } = route.params;
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const movieDetails = useMovieDetails(movieId);
  const movieCredits = useMovieCredits(movieId);
  const movieReleaseDates = useMovieReleaseDates(movieId);

  if (movieDetails.isLoading || movieCredits.isLoading || movieReleaseDates.isLoading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B3E5" />
        </View>
      </Layout>
    );
  }

  if (movieDetails.isError || !movieDetails.data) {
    return (
      <Layout>
        <View style={styles.errorContainer}>
          <Text>Error loading movie details.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  const movie = movieDetails.data;
  const credits = movieCredits.data;
  const releaseData = movieReleaseDates.data;

  // Find SG rating if available, otherwise fallback to US or first found
  const getRating = () => {
    if (!releaseData?.results) return 'NR';
    const sgRelease = releaseData.results.find((r: any) => r.iso_3166_1 === 'SG');
    const usRelease = releaseData.results.find((r: any) => r.iso_3166_1 === 'US');
    const release = sgRelease || usRelease || releaseData.results[0];
    return release?.release_dates?.[0]?.certification || 'NR';
  };

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : '';
    
  const directors = credits?.crew.filter((p: any) => p.job === 'Director') || [];
  const writers = credits?.crew.filter((p: any) => p.job === 'Writer' || p.job === 'Screenplay') || [];
  
  const keyCredits = [...directors, ...writers].slice(0, 4);

  const formatRuntime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <ScrollView style={[styles.scrollView, styles.container]}>
        {/* Header content in blue area */}
        <View style={styles.topContainer}>
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <Path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </Svg>
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                    {movie.title}
                </Text>
                <Text style={styles.headerYear}> ({releaseYear})</Text>
              </View>
              <View style={styles.headerRightPlaceholder} />
            </View>

            {/* Top Info Section */}
            <View style={styles.topInfoSection}>
            <View style={styles.posterShadow}>
                <Image
                    source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
                    style={styles.poster}
                />
            </View>
            <View style={styles.movieMetadata}>
                <View style={styles.ratingBox}>
                <Text style={styles.ratingText}>{getRating()}</Text>
                </View>
                <Text style={styles.metadataText}>
                {formatDate(movie.release_date)} (SG) • {formatRuntime(movie.runtime)}
                </Text>
                <Text style={styles.metadataText}>
                {movie.genres.map((g: any) => g.name).join(', ')}
                </Text>
                <Text style={styles.metadataText}>
                    <Text style={styles.boldLabel}>Status:</Text> {movie.status}
                </Text>
                <Text style={styles.metadataText}>
                    <Text style={styles.boldLabel}>Original Language:</Text> {movie.spoken_languages?.[0]?.english_name || movie.original_language}
                </Text>
            </View>
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.scoreAndCreditsRow}>
            <UserScore percentage={Math.round(movie.vote_average * 10)} />
            
            <View style={styles.creditsContainer}>
                {keyCredits.map((person, idx) => (
                    <View key={idx} style={styles.creditItem}>
                        <Text style={styles.creditName}>{person.name}</Text>
                        <Text style={styles.creditJob}>{person.job}</Text>
                    </View>
                ))}
            </View>
          </View>

          {movie.tagline ? (
            <Text style={styles.tagline}>{movie.tagline}</Text>
          ) : null}

          <Text style={styles.overviewTitle}>Overview</Text>
          <Text style={styles.overviewText}>{movie.overview}</Text>
          
          <TouchableOpacity 
            style={[
              styles.watchlistButton, 
              watchlist.some((m: any) => m.id === movie.id) && styles.watchlistButtonActive
            ]}
            onPress={() => {
              if (watchlist.some((m: any) => m.id === movie.id)) {
                setWatchlist(watchlist.filter((m: any) => m.id !== movie.id));
              } else {
                setWatchlist([...watchlist, movie]);
              }
            }}
          >
             <Svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <Path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" />
            </Svg>
            <Text style={styles.watchlistButtonText}>
              {watchlist.some((m: any) => m.id === movie.id) ? 'Remove From Watchlist' : 'Add To Watchlist'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cast Section */}
        {credits?.cast && <CastCarousel cast={credits.cast} />}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00B5E0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  backLink: {
    color: '#00B3E5',
    marginTop: 10,
    fontFamily: 'SourceSans3-Bold',
  },
  topContainer: {
    // Inherits base blue from container
  },
  overlay: {
    backgroundColor: '#00000026',
    paddingBottom: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'SourceSans3-Bold',
    color: 'white',
    flexShrink: 1,
  },
  headerYear: {
    fontSize: 24,
    fontFamily: 'SourceSans3-Regular',
    color: 'white',
    opacity: 0.8,
    flexShrink: 0,
  },
  scrollView: {
    flex: 1,
  },
  topInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: 25,
  },
  posterShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  movieMetadata: {
    flex: 1,
    paddingLeft: 20,
  },
  ratingBox: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 4,
    minWidth: 46,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SourceSans3-Bold',
  },
  metadataText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular',
    marginBottom: 8,
    lineHeight: 20,
  },
  boldLabel: {
    fontFamily: 'SourceSans3-Bold',
  },
  detailsSection: {
    padding: 25,
  },
  scoreAndCreditsRow: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: 35,
  },
  scoreTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  scoreText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'SourceSans3-Bold',
  },
  percentSymbol: {
    fontSize: 10,
    fontFamily: 'SourceSans3-Bold',
    color: 'white',
    marginTop: 6,
  },
  scoreLabel: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SourceSans3-Bold',
    marginTop: 10,
  },
  creditsContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  creditItem: {
    marginBottom: 16,
  },
  creditName: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SourceSans3-Bold',
    lineHeight: 22,
  },
  creditJob: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'SourceSans3-Regular',
    opacity: 0.9,
  },
  tagline: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'SourceSans3-Italic',
    marginBottom: 25,
    opacity: 0.9,
  },
  overviewTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'SourceSans3-Bold',
    marginBottom: 12,
  },
  overviewText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular',
    lineHeight: 24,
    marginBottom: 30,
  },
  watchlistButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  watchlistButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  watchlistButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SourceSans3-Bold',
    marginLeft: 10,
  },
  castSection: {
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  castTitle: {
    fontSize: 24,
    fontFamily: 'SourceSans3-Bold',
    color: '#000',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  castList: {
    paddingHorizontal: 20,
  },
  castCard: {
    width: 140,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  castImage: {
    width: '100%',
    height: 175,
  },
  castInfo: {
    padding: 12,
  },
  castName: {
    fontSize: 16,
    fontFamily: 'SourceSans3-Bold',
    color: '#000',
    marginBottom: 2,
  },
  castRole: {
    fontSize: 14,
    fontFamily: 'SourceSans3-Regular',
    color: '#4B5563',
  },
});
