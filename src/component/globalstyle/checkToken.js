import { BASE_URL } from '../../config/config';

const redirectLogin = () => {
    return (window.location.href = '/login');
};

export const isCheck = async () => {
    const token = localStorage.getItem('authorizationData') || '';
    if (token) {
        const response = await fetch(`${BASE_URL}auth/introspect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
            }),
        });

        const data = await response.json();
        if (data.code === 303 && data.result.valid === false) {
            redirectLogin();
        }
    } else {
        redirectLogin();
    }
};

export const introspect = async (token) => {
    if (token) {
        const response = await fetch(`${BASE_URL}auth/introspect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
            }),
        });

        const data = await response.json();
        return data;
    }
};

export const getMyInfo = async (token) => {
    if (token) {
        const response = await fetch(`${BASE_URL}users/myInfo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return data.result;
    }
};

export const reloadAfterDelay = (delay) => {
    setTimeout(() => {
        window.location.reload();
    }, delay);
};

export const refreshToken = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                token,
            }),
        });

        const data = await response.json();
        if (data.code === 303) {
            return data.result.token;
        }
    } catch (error) {
        console.error('Error fetching roles:', error.message);
    }
};
