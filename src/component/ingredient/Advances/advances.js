import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../list.module.scss';
import routes from '../../../config/routes';
import Status from '../../globalstyle/Status/status';
import { BASE_URL } from '../../../config/config';
import { isCheck, decodeToken } from '../../globalstyle/checkToken';
import { Pagination } from '../../layout/pagination/pagination';
import { formatter } from '../ingredient';

const cx = classNames.bind(styles);

export default function Advances() {
    (async function () {
        await isCheck();
        decodeToken(token, 'ADV_VIEW', true);
    })();

    const [advances, setAdvances] = useState([]);
    const [pages, setPages] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/advances/approvals', 'approvals');
    const employee = JSON.parse(localStorage.getItem('employee')) || '';

    //lấy don ung luong
    const fetchData = async (id) => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search') || 1;
        const name = urlParams.get('name') || '';
        const status = urlParams.get('status') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#status').querySelector('option[value="' + status + '"]').selected = true;

        try {
            const response = await fetch(`${BASE_URL}advances?pageNumber=${searchParam}&name=${name}&status=${status}&id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            if (data.code === 303) {
                setPages(data.page);
                setAdvances(data.result);
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        (async function () {
            await new Promise((resolve) => setTimeout(resolve, 1));
            await fetchData(decodeToken(token, 'ROLE_NHÂN') ? employee.id : '');
        })();
    }, []);

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Ứng lương <small>Danh sách</small>
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
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input type="text" className={cx('form-control')} name="name" id="name" placeholder="Họ tên" />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} name="status" id="status">
                                                                    <option value="">-- Trạng thái --</option>
                                                                    <option value="0">Đang chờ duyệt</option>
                                                                    <option value="1">Đã phê duyệt</option>
                                                                    <option value="2">Đã từ chối</option>
                                                                    <option value="3">Đã huỷ</option>
                                                                </select>
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
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a href={routes.advanceCreate} className={cx('btn')}>
                                                    <i className={cx('fa fa-plus')}></i> Thêm mới
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>Họ tên</th>
                                                    <th className={cx('text-center', 'm-0')}>Thời gian yêu cầu</th>
                                                    <th className={cx('text-center')}>Số tiền</th>
                                                    <th className={cx('text-center')}>Người duyệt</th>
                                                    <th className={cx('text-center', 'm-0')}>Thời gian phê duyệt</th>
                                                    <th className={cx('text-center')}>Trạng thái</th>
                                                    <th className={cx('text-center')}>Sửa</th>
                                                </tr>
                                                {advances.map((item, index) => (
                                                    <tr className={cx('record-data')} key={index}>
                                                        <td className={cx('text-center')}>{(+pages.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center', 'm-0')}>
                                                            {item.requestTime.slice(0, 10)} {item.requestTime.slice(11, 16)}
                                                        </td>
                                                        <td className={cx('text-center')}>{formatter.format(item.money)}</td>
                                                        <td className={cx('text-center')}>{item.approvedBy}</td>
                                                        <td className={cx('text-center', 'm-0')}>
                                                            {item.approvalTime !== null
                                                                ? item.approvalTime.slice(0, 10) + ' ' + item.approvalTime.slice(11, 16)
                                                                : ''}
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <Status status={item.status} />
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            {path.includes('approvals') ? (
                                                                <a href={routes.advanceApprovalsEdit.replace(':name', item.id)}>
                                                                    <i className={cx('fas fa-eye')}></i>
                                                                </a>
                                                            ) : (
                                                                <a href={routes.advanceEdit.replace(':name', item.id)}>
                                                                    <i className={cx('fas fa-edit')}></i>
                                                                </a>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={cx('pagination', 'pc-12')}>
                                            <div className={cx('pc-10')}>
                                                <p>
                                                    Hiển thị <b>{pages.totalItemsPerPage}</b> dòng / tổng <b>{pages.totalItems}</b>
                                                </p>
                                            </div>
                                            <div className={cx('pc-2')}>
                                                <Pagination currentPage={pages.currentPage} totalPages={pages.totalPages} />
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
