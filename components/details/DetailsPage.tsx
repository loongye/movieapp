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
import ISO6391 from 'iso-639-1';
import { useMovieDetails, useMovieCredits, useMovieReleaseDates, useMovieRecommendations } from '../../hooks/useMovieQueries';
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

const PlaceholderImage = ({ style, text }: { style: any, text?: string }) => (
  <View style={[style, styles.placeholderContainer]}>
    <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <Path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
    {text && <Text style={styles.placeholderText}>{text}</Text>}
  </View>
);

const CastCarousel = ({ cast }: { cast: any[] }) => {
  return (
    <View style={styles.castSection}>
      <Text style={styles.castTitle}>Top Billed Cast</Text>
      <FlatList
        data={cast.slice(0, 10)}
        horizontal
        showsHorizontalScrollIndicator={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.castCard}>
            <View style={styles.castImageContainer}>
                {item.profile_path ? (
                <Image
                    source={{ uri: `${IMAGE_BASE_URL}${item.profile_path}` }}
                    style={styles.castImage}
                />
                ) : (
                <PlaceholderImage style={styles.castImage} />
                )}
            </View>
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

const RecommendationsCarousel = ({ recommendations, navigation }: { recommendations: any[], navigation: any }) => {
  return (
    <View style={styles.recommendationsSection}>
      <Text style={styles.recommendationsTitle}>Recommendations</Text>
      <FlatList
        data={recommendations.slice(0, 10)}
        horizontal
        showsHorizontalScrollIndicator={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.recommendationCard}
            onPress={() => navigation.push('Details', { movieId: item.id })}
          >
            <View style={styles.recommendationImageContainer}>
                {item.backdrop_path ? (
                  <Image
                    source={{ uri: `${IMAGE_BASE_URL}${item.backdrop_path}` }}
                    style={styles.recommendationImage}
                  />
                ) : (
                  <PlaceholderImage style={styles.recommendationImage} />
                )}
            </View>
            <View style={styles.recommendationInfo}>
              <Text style={styles.recommendationName} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.recommendationPercent}>
                {Math.round(item.vote_average * 10)}%
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.recommendationsList}
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
  const recommendationsQuery = useMovieRecommendations(movieId);

  if (movieDetails.isLoading || movieCredits.isLoading || movieReleaseDates.isLoading || recommendationsQuery.isLoading) {
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
  const recommendations = recommendationsQuery.data?.results || [];

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
                {movie.poster_path ? (
                  <Image
                      source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
                      style={styles.poster}
                  />
                ) : (
                  <PlaceholderImage style={styles.poster} text="No Poster" />
                )}
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
                    <Text style={styles.boldLabel}>Original Language:</Text> {ISO6391.getName(movie.original_language) || movie.spoken_languages?.find((lang: any) => lang.iso_639_1 === movie.original_language)?.english_name || movie.original_language}
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
             <Svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                <Path d="M10.7031 0C11.4592 0 12.0732 0.622181 12.0732 1.3584V15.0908C12.0732 15.7187 11.7178 16 11.3535 16C11.1381 16 10.9239 15.9035 10.7109 15.7217L6.57129 12.1963C6.44265 12.0866 6.25871 12.0234 6.06738 12.0234C5.8759 12.0235 5.69169 12.0868 5.56348 12.1963L1.41016 15.7227C1.19798 15.9039 0.967745 16 0.751953 16C0.523885 15.9999 0.310815 15.8907 0.178711 15.7012C0.0683597 15.5426 0 15.337 0 15.0908V1.3584C0 0.622181 0.66386 0 1.41992 0H10.7031Z" fill="white" />
                <Path d="M10.7031 0C11.4592 0 12.0732 0.622181 12.0732 1.3584V15.0908C12.0732 15.7187 11.7178 16 11.3535 16C11.1381 16 10.9239 15.9035 10.7109 15.7217L6.57129 12.1963C6.44265 12.0866 6.25871 12.0234 6.06738 12.0234C5.8759 12.0235 5.69169 12.0868 5.56348 12.1963L1.41016 15.7227C1.19798 15.9039 0.967745 16 0.751953 16C0.523885 15.9999 0.310815 15.8907 0.178711 15.7012C0.0683597 15.5426 0 15.337 0 15.0908V1.3584C0 0.622181 0.66386 0 1.41992 0H10.7031Z" stroke="#042541" />
            </Svg>
            <Text style={styles.watchlistButtonText}>
              {watchlist.some((m: any) => m.id === movie.id) ? 'Remove From Watchlist' : 'Add To Watchlist'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cast Section */}
        {credits?.cast && <CastCarousel cast={credits.cast} />}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <RecommendationsCarousel recommendations={recommendations} navigation={navigation} />
        )}
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
    fontWeight: 'bold',
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
    fontFamily: 'SourceSans3-SemiBold',
    fontWeight: '600',
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
  poster: {
    width: 111.87,
    height: 145,
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
    color: '#FFFFFFB2',
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular',
    fontWeight: '400',
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
    fontWeight: 'bold',
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
    flex: 1,
    alignItems: 'flex-start',
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
    fontWeight: 'bold',
  },
  percentSymbol: {
    fontSize: 10,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: 'bold',
    color: 'white',
    marginTop: 6,
  },
  scoreLabel: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontStyle: 'italic',
    marginBottom: 25,
    opacity: 0.9,
  },
  overviewTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
  watchlistButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  watchlistButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  castSection: {
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  castTitle: {
    fontSize: 24,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: 'bold',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 15,
  },
  castImageContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  castImage: {
    width: '100%',
    height: 150,
  },
  castInfo: {
    padding: 12,
  },
  castName: {
    fontSize: 16,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  castRole: {
    fontSize: 14,
    fontFamily: 'SourceSans3-Regular',
    color: '#4B5563',
  },
  placeholderContainer: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'SourceSans3-Regular',
    marginTop: 5,
  },
  recommendationsSection: {
    paddingVertical: 30,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  recommendationsTitle: {
    fontSize: 24,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  recommendationsList: {
    paddingHorizontal: 20,
  },
  recommendationCard: {
    width: 250,
    marginHorizontal: 8,
    marginBottom: 15,
  },
  recommendationImageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  recommendationImage: {
    width: '100%',
    height: 140,
  },
  recommendationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendationName: {
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular',
    color: '#000',
    flex: 1,
    marginRight: 10,
  },
  recommendationPercent: {
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular',
    color: '#000',
  },
});
