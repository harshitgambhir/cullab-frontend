import axios from 'axios';
import { API_URL } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const sendOtp = data =>
  api
    .post('/influencers/send-otp', data)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const login = data =>
  api
    .post('/influencers/login', data)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const editProfile = data =>
  api
    .put('/influencers/profile', data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const getPublicInfluencer = username => api.get(`/influencers/influencers/${username}`).then(res => res.data);

export const getOrders = ctx =>
  api
    .get(`/influencers/orders`, {
      headers: {
        cookie: ctx?.req?.headers?.cookie,
      },
    })
    .then(res => res.data);

export const acceptOrder = ({ id }) =>
  api
    .put(`/influencers/orders/${id}/accept`)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const completeOrder = ({ id }) =>
  api
    .put(`/influencers/orders/${id}/complete`)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });

export const getChats = ctx =>
  api
    .get(`/influencers/chats`, {
      headers: {
        cookie: ctx?.req?.headers?.cookie,
      },
    })
    .then(res => res.data);

export const getChat = (brandId, ctx) =>
  api
    .get(`/influencers/chats/${brandId}`, {
      headers: {
        cookie: ctx?.req?.headers?.cookie,
      },
    })
    .then(res => res.data);

export const sendMessage = ({ brandId, data }) =>
  api
    .post(`/influencers/chats/${brandId}/message`, data)
    .then(res => res.data)
    .catch(error => {
      throw error.response.data;
    });
