import axios from 'axios';
import { API_URL } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getProfile = ctx =>
  api
    .get('/profile', {
      headers: {
        cookie: ctx?.req?.headers?.cookie,
      },
    })
    .then(res => res.data);

export const logout = () =>
  api
    .put('/logout')
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const getPlatforms = () => api.get('/platforms').then(res => res.data);

export const getFollowers = () => api.get('/followers').then(res => res.data);

export const getCategories = () => api.get('/categories').then(res => res.data);

export const getPrices = () => api.get('/prices').then(res => res.data);

export const getInfluencers = options => api.get('/influencers', options).then(res => res.data);
