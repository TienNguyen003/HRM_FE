import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from '../list.module.scss';
import { useAuth } from '../../../untils/AuthContext';
import { BASE_URL } from '../../../config/config';

const cx = classNames.bind(styles);

export default function Listcv() {
    const { state } = useAuth();
    const [disqualified, setDisqualified] = useState([]);

    const getDisqualified = async () => {
        try {
            const response = await fetch(`${BASE_URL}disqualified`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();

            if (data.code === 303) setDisqualified(data.result);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        (async () => {
            await getDisqualified();
        })();
    }, []);

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Danh sách CV đã loại <small>Danh sách</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10', 'm-12')}>
                                                <div id="search">
                                                    <form>
                                                        <div className={cx('row', 'no-gutters', 'form-group')}>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input type="text" id="email" className={cx('form-control')} name="email" placeholder="Email" />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    id="phone"
                                                                    className={cx('form-control')}
                                                                    name="phone"
                                                                    placeholder="Số điện thoại"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-2')} style={{ height: '36.6px' }}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> Tìm kiếm
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body', 'table-responsive')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>Email</th>
                                                    <th className={cx('text-center')}>Số điện thoại</th>
                                                    <th className={cx('text-center', 'm-0')}>Ngày sinh</th>
                                                    <th className={cx('text-center', 'm-0')}>Link file</th>
                                                </tr>
                                                {disqualified.map((item, index) => (
                                                    <tr className={cx('record-data')} key={index}>
                                                        <td className={cx('text-center')}>{index + 1}</td>
                                                        <td className={cx('text-center')}>{item.email}</td>
                                                        <td className={cx('text-center')}>{item.phone}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.dob}</td>
                                                        <td className={cx('text-center', 'm-0')}>
                                                            <a target="blank" href={item.linkFile}>
                                                                Link
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* <div className={cx('pagination', 'pc-12')}>
                                            <div className={cx('pc-7')}>
                                                <p>
                                                    Hiển thị <b>{page.totalItemsPerPage}</b> / <b>{page.totalItems}</b> dòng 
                                                </p>
                                            </div>
                                            <div className={cx('pc-2')}>
                                                <Page page={page.currentPage} total={page.totalPages} />
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
