import { BASE_URL } from '../../config/config';

function redirectLogin() {
    return (window.location.href = '/login');
}

export const isCheck = async function checkToken() {
    const token = localStorage.getItem('authorizationData') || '';
    if (token != '') {
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

export const reloadAfterDelay = (delay) => {
    setTimeout(() => {
        window.location.reload();
    }, delay);
};
