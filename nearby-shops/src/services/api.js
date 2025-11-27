// src/services/api.js
import axios from "axios";
const API = "http://localhost:5000/api";

export const getShops = () => axios.get(`${API}/shops`).then(r => r.data);
export const getVendorShops = (vendorEmail) =>
  axios.get(`${API}/shops`, { params: { vendorEmail } }).then(r => r.data);
export const createShop = (payload) => axios.post(`${API}/shops`, payload).then(r => r.data);
export const updateShop = (id, payload) => axios.put(`${API}/shops/${id}`, payload).then(r => r.data);
export const deleteShop = (id) => axios.delete(`${API}/shops/${id}`).then(r => r.data);

export const addReview = (shopId, payload) =>
  axios.post(`${API}/shops/${shopId}/reviews`, payload).then(r => r.data);
export const getReviews = (shopId) =>
  axios.get(`${API}/shops/${shopId}/reviews`).then(r => r.data);
