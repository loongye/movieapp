import { TMDB_API_READ_ACCESS_TOKEN } from "../config";

const BASE_URL = "https://api.themoviedb.org/3";

const getOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
  },
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.status_message || "API request failed");
  }
  return response.json();
};

const fetchFromTMDB = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, getOptions);
  return handleResponse(response);
};


const getTodayDate = () => new Date().toISOString().split('T')[0];
const getOneMonthAgoDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split('T')[0];
};
const getThreeMonthsFromNowDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().split('T')[0];
};

export const getNowPlayingMovies = async (page = 1, sortBy = 'popularity.desc') => {
  const today = getTodayDate();
  const oneMonthAgo = getOneMonthAgoDate();
  return fetchFromTMDB(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortBy}&with_release_type=2|3&release_date.gte=${oneMonthAgo}&release_date.lte=${today}`);
};

export const getPopularMovies = async (page = 1, sortBy = 'popularity.desc') => {
  return fetchFromTMDB(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortBy}`);
};

export const getUpcomingMovies = async (page = 1, sortBy = 'popularity.desc') => {
  const today = getTodayDate();
  const threeMonthsFromNow = getThreeMonthsFromNowDate();
  return fetchFromTMDB(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortBy}&with_release_type=2|3&release_date.gte=${today}&release_date.lte=${threeMonthsFromNow}`);
};


export const getMovieDetails = async (movieId: number) => {
  return fetchFromTMDB(`/movie/${movieId}?language=en-US`);
};

export const getMovieCredits = async (movieId: number) => {
  return fetchFromTMDB(`/movie/${movieId}/credits?language=en-US`);
};

export const getMovieReleaseDates = async (movieId: number) => {
  return fetchFromTMDB(`/movie/${movieId}/release_dates`);
};

export const getDiscoverMovies = async (sortBy = 'popularity.desc', page = 1) => {
  return fetchFromTMDB(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortBy}`);
};

export const getAccountDetails = async () => {
  return fetchFromTMDB(`/account`);
};

export const getMovieRecommendations = async (movieId: number, page = 1) => {
  return fetchFromTMDB(`/movie/${movieId}/recommendations?language=en-US&page=${page}`);
};

export const searchMovies = async (query: string, page = 1) => {
  return fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`);
};



