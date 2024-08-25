import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../list.module.scss';
import { isCheck } from '../../../globalstyle/checkToken';
import TableSalary from './tablesalary';

const cx = classNames.bind(styles);

export default function View() {
    (async function () {
        await isCheck();
    })();

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
