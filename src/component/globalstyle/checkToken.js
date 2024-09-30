import { BASE_URL } from '../../config/config';
import { jwtDecode } from 'jwt-decode';

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

export const decodeToken = (token, permission, isCheck) => {
    let flag = false;
    const scope = jwtDecode(token).scope.split(' ');
    flag = scope.includes(permission.trim()) ? true : false;
    if (isCheck) if (!flag) window.location.href = window.location.href + '/404';
    return flag;
};

export const checkPermission = (token, permission) => {
    let flag = false;
    const scope = jwtDecode(token).scope.split(' ');
    flag = permission.some(p => scope.includes(p.trim()));
    return flag;
};
