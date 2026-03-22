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
             <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <Path d="M18 6L6 18M6 6L18 18" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
    borderRadius: 8,
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
    overflow: 'hidden',
  },
  posterContainer: {
    width: 100,
    height: '100%',
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
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'SourceSans3-Bold',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  date: {
    fontSize: 14,
    fontFamily: 'SourceSans3-Regular',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    fontFamily: 'SourceSans3-Regular',
    color: '#4B5563',
    lineHeight: 18,
  },
});
