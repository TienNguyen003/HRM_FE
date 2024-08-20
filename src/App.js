import classNames from 'classnames/bind';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import { publicRoutes } from '../src/routes/routes';
import styles from './App.module.scss';
import Header from '../src/component/layout/header/header';
import Error from './component/layout/404/404.js';

const cx = classNames.bind(styles);

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

    console.log('nhân viên phần update, cài đặt, bảng lương, bảng tg chấm công, "Phân quyền người dùng vào web"');

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
