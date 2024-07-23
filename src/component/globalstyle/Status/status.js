import React from 'react';
import classNames from 'classnames/bind';
import styles from './status.module.scss';

const cx = classNames.bind(styles);

export default function Status({ status }) {
    let statusText;
    let statusClass;

    switch (status) {
        case 1:
            statusText = 'Đã duyệt';
            statusClass = cx({ approved: true });
            break;
        case 2:
            statusText = 'Đã từ chối';
            statusClass = cx({ rejected: true });
            break;
        case 3:
            statusText = 'Đã hủy';
            statusClass = cx({ rejected: true });
            break;
        default:
            statusText = 'Chưa duyệt';
            statusClass = cx({ pending: true });
    }

    return <small className={cx(statusClass, 'badge')}>{statusText}</small>;
}
