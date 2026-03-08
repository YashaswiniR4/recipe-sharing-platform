import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to headers for authenticated requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },
    getCurrentUser: () => JSON.parse(localStorage.getItem('user')),
    getProfile: () => api.get('/auth/profile'),
};

export const recipeService = {
    getRecipes: (params) => api.get('/recipes', { params }),
    getRecipeById: (id) => api.get(`/recipes/${id}`),
    createRecipe: (formData) => api.post('/recipes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateRecipe: (id, formData) => api.put(`/recipes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteRecipe: (id) => api.delete(`/recipes/${id}`),
};

export const favoriteService = {
    getFavorites: () => api.get('/favorites'),
    addFavorite: (recipe_id) => api.post('/favorites', { recipe_id }),
    removeFavorite: (recipe_id) => api.delete(`/favorites/${recipe_id}`),
};

export const ratingService = {
    rateRecipe: (recipe_id, rating) => api.post('/ratings', { recipe_id, rating }),
};

export const commentService = {
    getComments: (recipe_id) => api.get(`/comments/${recipe_id}`),
    addComment: (data) => api.post('/comments', data),
};

export const userService = {
    getProfile: () => api.get('/user/profile'),
};

export default api;
