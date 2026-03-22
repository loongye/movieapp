import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface WatchlistMovieCardProps {
  title: string;
  releaseDate: string;
  overview: string;
  posterPath: string | null;
  onPress: () => void;
  onRemove: () => void;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const WatchlistMovieCard: React.FC<WatchlistMovieCardProps> = ({
  title,
  releaseDate,
  overview,
  posterPath,
  onPress,
  onRemove,
}) => {
  const imageUrl = posterPath ? `${IMAGE_BASE_URL}${posterPath}` : null;

  // Format date to be like "19 July 2023"
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.posterContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={[styles.poster, styles.placeholderPoster]}>
             <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
               <Path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </Svg>
             <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <Path 
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d="M6.18462 14.9923H5.75385C5.65385 14.8832 5.53077 14.8832 5.32308 14.6649C5.22308 14.5558 5 14.1193 5 13.9089C5 13.5815 5.22308 13.2464 5.32308 13.1451L8.43846 9.98836L5.33077 6.83946C5.23077 6.73813 5.00769 6.40298 5.00769 6.08341C5.00769 5.86517 5.23077 5.53781 5.33077 5.31957C5.65385 5.10133 5.86154 5 6.18462 5C6.50769 5 6.71538 5.10133 6.93846 5.31957L10.0538 8.35935L13.0692 5.31957C13.2769 5.10133 13.6 5 13.8231 5C14.1462 5 14.4538 5.10133 14.6769 5.31957C14.8846 5.53781 15 5.86517 15 6.08341C15 6.40298 14.8769 6.73034 14.6769 6.83946L11.5615 9.99615L14.6769 13.1528C14.8846 13.2542 15 13.5893 15 13.9167C15 14.1271 14.8769 14.5558 14.6769 14.6727C14.5769 14.891 14.4538 14.891 14.3538 15.0001H13.5C13.2769 14.891 13.1769 14.891 13.0692 14.6727L10.0538 11.633L6.93846 14.6727C6.83846 14.891 6.71538 14.891 6.61538 15.0001H6.18462V14.9923Z" 
                        fill="#595959"
                    />
                </Svg>
            </TouchableOpacity>
        </View>
        <Text style={styles.date}>{formatDate(releaseDate)}</Text>
        <Text style={styles.overview} numberOfLines={2}>{overview}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    height: 151,
    borderWidth: 1.5,
    borderColor: '#E3E3E3',
  },
  posterContainer: {
    width: 100,
    height: '100%',
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  placeholderPoster: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  title: {
    fontSize: 21,
    fontFamily: 'SourceSans3-Bold',
    fontWeight: '700',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'SourceSans3-Regular',
    fontWeight: '400',
    color: '#9CA3AF',
    marginBottom: 20,
  },
  overview: {
    fontSize: 15,
    fontFamily: 'SourceSans3-Regular',
    fontWeight: '400',
    color: '#595959',
    lineHeight: 20,
  },
});
