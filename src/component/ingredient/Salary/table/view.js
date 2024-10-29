import React, { useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from '../../list.module.scss';
import TableSalary from './tablesalary';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

export default function View() {
    const { state, redirectLogin } = useAuth();

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
    }, [state.isAuthenticated, state.loading]);

    return (
        <div className={cx('content-wrapper')}>
            <section className={cx('content')}>
                <div className={cx('container-fluid')}>
                    <section className={cx('content-header')}>
                        <h1>
                            Bảng lương <small id="name"></small>
                        </h1>
                    </section>
                    <TableSalary isFlag={true}/>
                </div>
            </section>
        </div>
    );
}
