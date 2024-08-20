import React from 'react';
import classNames from 'classnames/bind';

import styles from './status.module.scss';

const cx = classNames.bind(styles);

export function Status({ id, isStatus, handleChange }) {
    return (
        <div className={cx('onoffswitch')}>
            <input
                type="checkbox"
                className={cx('onoffswitch-checkbox')}
                id={id}
                defaultChecked={isStatus}
                onChange={handleChange}
            />
            <label className={cx('onoffswitch-label')} htmlFor={id}>
                <span className={cx('onoffswitch-inner')}></span>
                <span className={cx('onoffswitch-switch')}></span>
            </label>
        </div>
    );
}
