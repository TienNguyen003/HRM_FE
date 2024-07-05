function redirectLogin() {
    return window.location.href = '/login';
}

export const isCheck = async function checkToken() {
    const token = localStorage.getItem('authorizationData') ? localStorage.getItem('authorizationData') : '';
    if (token != '') {
        const response = await fetch('http://localhost:8083/api/auth/introspect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
            }),
        });

        const data = await response.json();

        if (data.code == 303 && data.result.valid === false) {
            redirectLogin();
        }
    } else {
        redirectLogin();
    }
}