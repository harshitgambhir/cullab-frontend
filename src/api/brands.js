import axios from 'axios';
import { API_URL } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const logout = () =>
  api
    .put('/logout')
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const sendOtp = data =>
  api
    .post('/brands/send-otp', data)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const login = data =>
  api
    .post('/brands/login', data)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const getProfile = ctx =>
  api
    .get('/profile', {
      headers: {
        cookie: ctx?.req?.headers?.cookie,
      },
    })
    .then(res => res.data);

export const editProfile = data =>
  api
    .put('/brands/profile', data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const placeOrder = data =>
  api
    .post('/brands/orders', data)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const getOrders = ctx =>
  api
    .get(`/brands/orders`, {
      headers: {
        cookie: ctx?.req?.headers?.cookie,
      },
    })
    .then(res => res.data);

export const approveOrder = ({ id }) =>
  api
    .put(`/brands/orders/${id}/approve`)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const getChats = ctx =>
  api
    .get(`/brands/chats`, {
      headers: {
        cookie: ctx?.req?.headers?.cookie,
      },
    })
    .then(res => res.data);

export const getChat = (influencerId, ctx) =>
  api
    .get(`/brands/chats/${influencerId}`, {
      headers: {
        cookie: ctx?.req?.headers?.cookie,
      },
    })
    .then(res => res.data);

export const sendMessage = ({ influencerId, data }) =>
  api
    .post(`/brands/chats/${influencerId}/message`, data)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });
