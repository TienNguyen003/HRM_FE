import classNames from 'classnames/bind';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { registerLicense } from '@syncfusion/ej2-base';
import { jwtDecode } from 'jwt-decode';

import '../src/config/config_translation.js';
import styles from './App.module.scss';
import Header from '../src/component/layout/header/header';
import Error from './component/layout/404/404.js';
import { publicRoutes } from '../src/routes/routes';
import { BASE_URL } from './config/config.js';
import { AuthProvider } from './untils/AuthContext.js';

import '../node_modules/@syncfusion/ej2-base/styles/material.css';
import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';
import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../node_modules/@syncfusion/ej2-react-schedule/styles/material.css';

const cx = classNames.bind(styles);

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWGtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH5edHZVQmVZUEZ0V0U=');

function App() {
    const [userActive, setUserActive] = useState(false);

    const token = localStorage.getItem('authorizationData') || '';
    const isLoginPage = window.location.pathname === '/login';
    const isValidPath = (path) => {
        return publicRoutes.some((route) => {
            const regex = new RegExp(`^${route.path.replace(/:\w+/g, '[^/]+')}$`);
            return regex.test(path);
        });
    };

    const [headerClicked, setHeaderClicked] = useState(false);

    const handleHeaderClick = () => {
        setHeaderClicked((prevHeaderClicked) => !prevHeaderClicked);
    };

    const refreshToken = async () => {
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
                localStorage.setItem('authorizationData', data.result.token);
            }
            setUserActive(false);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    const handleUserActivity = () => {
        setUserActive(true);
    };

    useEffect(() => {
        let time;
        if (token) time = jwtDecode(token).exp;

        setTimeout(() => {
            document.addEventListener('mousemove', handleUserActivity);
            document.addEventListener('keypress', handleUserActivity);
            document.addEventListener('scroll', handleUserActivity);
            document.addEventListener('click', handleUserActivity);
            userActive && window.location.pathname != '/login' && refreshToken();
        }, time - 300);

        return () => {
            document.removeEventListener('mousemove', handleUserActivity);
            document.removeEventListener('keypress', handleUserActivity);
            document.removeEventListener('scroll', handleUserActivity);
            document.removeEventListener('click', handleUserActivity);
        };
    }, [userActive]);

    console.log('cài đặt, message, jira, toi uu code');

    return (
        <AuthProvider>
            <BrowserRouter>
                {!isLoginPage && isValidPath(window.location.pathname) && <Header onClick={handleHeaderClick} />}
                <div className={cx('app', { 'header-clicked': headerClicked })}>
                    <Routes>
                        {publicRoutes.map((item, index) => {
                            const Page = item.component;
                            return <Route key={index} path={item.path} element={<Page />} />;
                        })}
                        <Route path="*" element={<Error />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
