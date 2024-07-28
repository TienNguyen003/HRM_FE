import React from 'react';
import classNames from 'classnames/bind';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from '../../ingredient/list.module.scss';

const cx = classNames.bind(styles);

export const Pagination = ({ currentPage, totalPages }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);

    const handlePageChange = (page) => {
        searchParams.set('page', page);
        navigate(`${path}?${searchParams.toString()}`);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(+currentPage + 1);
        }
    };

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <ul className={cx('pagination')}>
            {/* Nút trước */}
            <li className={cx('page-item')}>
                <a className={cx('page-link')} href={currentPage > 1 ? '' : undefined} onClick={handlePrevious}>
                    &laquo;
                </a>
            </li>

            {/* Nút cho từng trang */}
            {pages.map((page) => (
                <li key={page} className={cx('page-item')}>
                    <a
                        className={cx('page-link', { active: page === Number(currentPage) })}
                        href={page === Number(currentPage) ? undefined : ''}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </a>
                </li>
            ))}

            {/* Nút sau */}
            <li className={cx('page-item')}>
                <a className={cx('page-link')} href={currentPage < totalPages ? '' : undefined} onClick={handleNext}>
                    &raquo;
                </a>
            </li>
        </ul>
    );
};
