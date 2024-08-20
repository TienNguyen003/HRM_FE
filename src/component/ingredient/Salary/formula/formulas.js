import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../list.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';
import { Pagination } from '../../../layout/pagination/pagination';
import { Status } from '../../../layout/status/status';

const cx = classNames.bind(styles);

export default function Formulas() {
    (async function () {
        await isCheck();
    })();

    const [formula, setFormula] = useState([]);
    const [page, setPage] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

    const getFormula = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 1;
        const name = urlParams.get('name') || '';
        const status = urlParams.get('status') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#status').querySelector('option[value="' + status + '"]').selected = true;

        try {
            const response = await fetch(
                `${BASE_URL}salary_formulas?pageNumber=${page}&name=${name}&status=${status}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();
            if (data.code === 303) {
                setFormula(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async function () {
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getFormula();
        })();
    }, []);

    const clickDelete = (id) => {
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(id);
    };

    const handleClickDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}salary_formulas?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const changeStatus = (e) => {
        let isCheck = e.target.checked ? 1 : 0;
        handleChangeStt(isCheck, e.target.id);
    };

    const handleChangeStt = async (status, id) => {
        try {
            const response = await fetch(`${BASE_URL}salary_formulas/stt?id=${id}&status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Công thức tính lương <small>Danh sách</small>
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
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    name="name"
                                                                    id="name"
                                                                    placeholder="Tên loại lương"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <select
                                                                    className={cx('form-control', 'select')}
                                                                    name="status"
                                                                    id="status"
                                                                >
                                                                    <option value="">-- Trạng thái --</option>
                                                                    <option value="1">Hoạt động</option>
                                                                    <option value="0">Không hoạt động</option>
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> Tìm kiếm
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a href={routes.salaryFormulasCreate} className={cx('btn')}>
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
                                                    <th className={cx('text-center')}>Tên công thức</th>
                                                    <th className={cx('text-center')}>Công thức tính</th>
                                                    <th className={cx('text-center')}>Trạng thái</th>
                                                    <th className={cx('text-center')}>Sửa</th>
                                                    <th className={cx('text-center')}>Xóa</th>
                                                </tr>
                                                {formula.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className={cx('text-center')}>
                                                            {(+page.currentPage - 1) * 30 + index + 1}
                                                        </td>
                                                        <td className={cx('text-center')}>{item.name}</td>
                                                        <td className={cx('text-center')}>{item.salaryFormula}</td>
                                                        <td
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                border: 'none',
                                                            }}
                                                        >
                                                            <Status
                                                                id={item.id}
                                                                isStatus={item.status}
                                                                handleChange={(e) => changeStatus(e)}
                                                            />
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a
                                                                href={routes.salaryFormulasEdit.replace(
                                                                    ':name',
                                                                    item.id,
                                                                )}
                                                                className={cx('edit-record')}
                                                            >
                                                                <i className={cx('fas fa-edit')}></i>
                                                            </a>
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a
                                                                className={cx('delete-record')}
                                                                onClick={() => clickDelete(item.id)}
                                                            >
                                                                <i className={cx('far fa-trash-alt text-red')}></i>
                                                            </a>
                                                        </td>
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
