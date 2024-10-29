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
        navigate(`?page=${page}`);
    };

    useEffect(() => {
        console.log(page, total);
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
