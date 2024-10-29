import React from 'react';
import classNames from 'classnames/bind';

import styles from './load.module.scss';

const cx = classNames.bind(styles);

export default function Load({className}) {
    return (
        <div className={cx(className)}>
            <div className={cx('load')} id="modal-load"></div>
            <div className={cx('loader')}></div>
        </div>
    );
}
