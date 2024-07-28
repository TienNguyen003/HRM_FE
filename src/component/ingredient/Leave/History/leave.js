import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../list.module.scss';
import { BASE_URL } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';
import { Pagination } from '../../../layout/pagination/pagination';

const cx = classNames.bind(styles);

function Leave() {
    (async function () {
        await isCheck();
    })();

    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

    // lay lich su
    const getLeaveLogs = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageNumber = urlParams.get('search') || 1;
        const name = urlParams.get('name') || '';

        document.querySelector('#name').value = name;

        try {
            const response = await fetch(`${BASE_URL}sabbatical_leave_logs?pageNumber=${pageNumber}&name=${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                setLogs(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async function () {
            await getLeaveLogs();
        })();
    }, []);

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Lịch sử nghỉ phép <small>Danh sách</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10')}>
                                                <div id="search">
                                                    <form>
                                                        <input type="hidden" name="search" value="1" />
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    name="name"
                                                                    id="name"
                                                                    placeholder="Họ tên"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3')}>
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

                                    <div className={cx('card-body')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>Họ tên</th>
                                                    <th className={cx('text-center')}>Thời gian cập nhật</th>
                                                    <th className={cx('text-center')}>Thời gian biến động</th>
                                                    <th className={cx('text-center')}>Thời gian còn lại</th>
                                                    <th className={cx('text-center')}>Nội dung</th>
                                                </tr>
                                                {logs.map((item, index) => (
                                                    <tr key={index} className={cx('record-data')}>
                                                        <td className={cx('text-center')}>{index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center')}>
                                                            {new Date(item.updateTime)
                                                                .toISOString()
                                                                .replace('T', ' ')
                                                                .slice(0, 16)}
                                                        </td>
                                                        <td className={cx('text-center')}>{item.fluctuatesTime} h</td>
                                                        <td className={cx('text-center')}>
                                                            {item.employee.vacationHours} h
                                                        </td>
                                                        <td>{item.content}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={cx('pagination', 'pc-12')}>
                                            <div className={cx('pc-10')}>
                                                <p>
                                                    Hiển thị <b>{page.totalItemsPerPage}</b> dòng / tổng{' '}
                                                    <b>{page.totalItems}</b>
                                                </p>
                                            </div>
                                            <div className={cx('pc-2')}>
                                                <Pagination
                                                    currentPage={page.currentPage}
                                                    totalPages={page.totalPages}
                                                />
                                            </div>
                                        </div>
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

export default Leave;
