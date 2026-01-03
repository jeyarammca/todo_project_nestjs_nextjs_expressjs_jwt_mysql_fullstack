const API_URL = 'http://localhost:3001';

export const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    },

    auth: {
        login: (credentials) => api.request('/auth/signin', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
        register: (userData) => api.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),
    },

    todos: {
        getAll: () => api.request('/todos'),
        create: (todo) => api.request('/todos', {
            method: 'POST',
            body: JSON.stringify(todo),
        }),
        update: (id, todo) => api.request(`/todos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(todo),
        }),
        delete: (id) => api.request(`/todos/${id}`, {
            method: 'DELETE',
        }),
    },
};
