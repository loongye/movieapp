import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import * as tmdbService from '../services/tmdbService';

export const useNowPlayingMovies = (page = 1, sortBy = 'popularity.desc', enabled = true) => {
  return useQuery({
    queryKey: ['movies', 'now_playing', sortBy, page],
    queryFn: () => tmdbService.getNowPlayingMovies(page, sortBy),
    enabled,
  });
};

export const useInfiniteNowPlayingMovies = (sortBy = 'popularity.desc', enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['movies', 'now_playing', 'infinite', sortBy],
    queryFn: ({ pageParam = 1 }) => tmdbService.getNowPlayingMovies(pageParam, sortBy),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
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

export const useInfinitePopularMovies = (sortBy = 'popularity.desc', enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['movies', 'popular', 'infinite', sortBy],
    queryFn: ({ pageParam = 1 }) => tmdbService.getPopularMovies(pageParam, sortBy),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
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

export const useInfiniteUpcomingMovies = (sortBy = 'popularity.desc', enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['movies', 'upcoming', 'infinite', sortBy],
    queryFn: ({ pageParam = 1 }) => tmdbService.getUpcomingMovies(pageParam, sortBy),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled,
  });
};

export const useSearchMovies = (query: string, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ['movies', 'search', query, page],
    queryFn: () => tmdbService.searchMovies(query, page),
    enabled: enabled && !!query,
  });
};

export const useInfiniteSearchMovies = (query: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['movies', 'search', 'infinite', query],
    queryFn: ({ pageParam = 1 }) => tmdbService.searchMovies(query, pageParam),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
      console.log('[DEBUG] getNextPageParam - lastPage.page:', lastPage.page, 'total_pages:', lastPage.total_pages, 'nextPage:', nextPage);
      return nextPage;
    },
    initialPageParam: 1,
    enabled: enabled && !!query,
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

export const useDiscoverMovies = (sortBy: string, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ['movies', 'discover', sortBy, page],
    queryFn: () => tmdbService.getDiscoverMovies(sortBy, page),
    enabled,
  });
};



