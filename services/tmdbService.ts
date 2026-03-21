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

export const getNowPlayingMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/movie/now_playing?language=en-US&page=${page}`, getOptions);
  return handleResponse(response);
};

export const getPopularMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=${page}`, getOptions);
  return handleResponse(response);
};

export const getUpcomingMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?language=en-US&page=${page}`, getOptions);
  return handleResponse(response);
};

export const getMovieDetails = async (movieId: number) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?language=en-US`, getOptions);
  return handleResponse(response);
};

export const getMovieCredits = async (movieId: number) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/credits?language=en-US`, getOptions);
  return handleResponse(response);
};

export const getAccountDetails = async () => {
  const response = await fetch(`${BASE_URL}/account`, getOptions);
  return handleResponse(response);
};

export const getMovieRecommendations = async (movieId: number, page = 1) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/recommendations?language=en-US&page=${page}`, getOptions);
  return handleResponse(response);
};
