import classNames from 'classnames/bind';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { registerLicense } from '@syncfusion/ej2-base';

import { publicRoutes } from '../src/routes/routes';
import styles from './App.module.scss';
import Header from '../src/component/layout/header/header';
import Error from './component/layout/404/404.js';

import "../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";

const cx = classNames.bind(styles);

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1NpR2VGfV5ycEVFallQTnZdUiweQnxTdEFjUH1YcHdQR2BYUUVxXQ==');

function App() {
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

    console.log('cài đặt, bảng tg chấm công, "Phân quyền người dùng vào web", "check trong db", "response"');

    return (
        <>
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
        </>
    );
}

export default App;
