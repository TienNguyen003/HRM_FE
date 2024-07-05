import classNames from 'classnames/bind';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { publicRoutes } from '../src/routes/routes';
import styles from './App.module.scss';
import Header from '../src/component/layout/header/header';
import Home from './pages/home/home';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function App() {
    const isLoginPage = window.location.pathname === '/login';    

    return (
        <>
            <BrowserRouter>
                {!isLoginPage && <Header />}
                <div className={cx('app')}>
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
