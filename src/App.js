import classNames from 'classnames/bind';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import { publicRoutes } from '../src/routes/routes';
import styles from './App.module.scss';
import Header from '../src/component/layout/header/header';

const cx = classNames.bind(styles);

function App() {
    const isLoginPage = window.location.pathname === '/login';

    const [headerClicked, setHeaderClicked] = useState(false);

    const handleHeaderClick = () => {
        setHeaderClicked((prevHeaderClicked) => !prevHeaderClicked);
    };

    console.log('nhân viên phần update, đổi mật khẩu và show mật khẩu, them moi ltt lcd');

    return (
        <>
            <BrowserRouter>
                {!isLoginPage && <Header onClick={handleHeaderClick} />}
                <div className={cx('app', { 'header-clicked': headerClicked })}>
                    <Routes>
                        {publicRoutes.map((item, index) => {
                            const Page = item.component;
                            return <Route key={index} path={item.path} element={<Page />} />;
                        })}
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    );
}

export default App;
