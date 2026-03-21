import { useQuery } from '@tanstack/react-query';
import * as tmdbService from '../services/tmdbService';

export const useNowPlayingMovies = (page = 1) => {
  return useQuery({
    queryKey: ['movies', 'now_playing', page],
    queryFn: () => tmdbService.getNowPlayingMovies(page),
  });
};

export const usePopularMovies = (page = 1) => {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => tmdbService.getPopularMovies(page),
  });
};

export const useUpcomingMovies = (page = 1) => {
  return useQuery({
    queryKey: ['movies', 'upcoming', page],
    queryFn: () => tmdbService.getUpcomingMovies(page),
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

export const useSearchMovies = (query: string, page = 1) => {
  return useQuery({
    queryKey: ['movies', 'search', query, page],
    queryFn: () => tmdbService.searchMovies(query, page),
    enabled: !!query,
  });
};

