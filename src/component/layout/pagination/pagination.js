import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'rsuite';
import 'rsuite/Pagination/styles/index.css';
// import './Pagination.css';

export const Page = ({ page, total, style }) => {
    const [activePage, setActivePage] = useState(page);
    const navigate = useNavigate();

    const handleChangePage = (page) => {
        setActivePage(page);
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        params.set('page', page);
        url.search = params.toString();
        navigate(url.pathname + url.search);
    };

    useEffect(() => {
        setActivePage(page);
    }, [page]);

    return (
        <div style={style}>
            {total ? (
                <Pagination
                    layout={['pager', 'skip']}
                    size={'md'}
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    total={total}
                    limit={30}
                    maxButtons={5}
                    activePage={activePage}
                    onChangePage={handleChangePage}
                />
            ) : (
                ''
            )}
        </div>
    );
};
