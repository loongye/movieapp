import { useQuery } from '@tanstack/react-query';
import * as tmdbService from '../services/tmdbService';

export const useNowPlayingMovies = (page = 1, sortBy = 'popularity.desc', enabled = true) => {
  return useQuery({
    queryKey: ['movies', 'now_playing', sortBy, page],
    queryFn: () => tmdbService.getNowPlayingMovies(page, sortBy),
    enabled,
  });
};

export const usePopularMovies = (page = 1, sortBy = 'popularity.desc', enabled = true) => {
  return useQuery({
    queryKey: ['movies', 'popular', sortBy, page],
    queryFn: () => tmdbService.getPopularMovies(page, sortBy),
    enabled,
  });
};

export const useUpcomingMovies = (page = 1, sortBy = 'popularity.desc', enabled = true) => {
  return useQuery({
    queryKey: ['movies', 'upcoming', sortBy, page],
    queryFn: () => tmdbService.getUpcomingMovies(page, sortBy),
    enabled,
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => tmdbService.getMovieDetails(movieId),
    enabled: !!movieId,
  });
};

export const useMovieCredits = (movieId: number) => {
  return useQuery({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: () => tmdbService.getMovieCredits(movieId),
    enabled: !!movieId,
  });
};

export const useMovieReleaseDates = (movieId: number) => {
  return useQuery({
    queryKey: ['movie', movieId, 'release_dates'],
    queryFn: () => tmdbService.getMovieReleaseDates(movieId),
    enabled: !!movieId,
  });
};

export const useAccountDetails = () => {
  return useQuery({
    queryKey: ['account'],
    queryFn: () => tmdbService.getAccountDetails(),
  });
};

export const useMovieRecommendations = (movieId: number, page = 1) => {
  return useQuery({
    queryKey: ['movie', movieId, 'recommendations', page],
    queryFn: () => tmdbService.getMovieRecommendations(movieId, page),
    enabled: !!movieId,
  });
};

export const useSearchMovies = (query: string, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ['movies', 'search', query, page],
    queryFn: () => tmdbService.searchMovies(query, page),
    enabled: enabled && !!query,
  });
};


export const useDiscoverMovies = (sortBy: string, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ['movies', 'discover', sortBy, page],
    queryFn: () => tmdbService.getDiscoverMovies(sortBy, page),
    enabled,
  });
};



