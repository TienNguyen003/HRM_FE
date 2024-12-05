import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames/bind';

import styles from './status.module.scss';

const cx = classNames.bind(styles);

export default function Status({ status }) {
    let statusText;
    let statusClass;
    const { t } = useTranslation();

    switch (status) {
        case 1:
            statusText = `${t('common.Approval')}`;
            statusClass = cx({ approved: true });
            break;
        case 2:
            statusText = `${t('common.Rejected')}`;
            statusClass = cx({ rejected: true });
            break;
        case 3:
            statusText = `${t('common.Cancelled')}`;
            statusClass = cx({ rejected: true });
            break;
        default:
            statusText = `${t('common.Pending')}`;
            statusClass = cx({ pending: true });
    }

    return <small className={cx(statusClass, 'badge')}>{statusText}</small>;
}
