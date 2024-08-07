import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck, reloadAfterDelay } from '../../../globalstyle/checkToken';
import { handleAlert } from '../../ingredient';

const cx = classNames.bind(styles);

export default function Create() {
    (async function () {
        await isCheck();
    })();

    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/salary/categories/edit/', '');

    const getSalaCate = async () => {
        if (path.includes('/salary/categories/create')) return;
        try {
            const response = await fetch(`${BASE_URL}salary_categories/wages?wageCateId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                document.querySelector('#name').value = data.result.name;
                document.querySelector('#symbol').value = data.result.symbol;
                document
                    .querySelector('#type')
                    .querySelector('option[value="' + data.result.salaryType + '"]').selected = true;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async function () {
            await getSalaCate();
        })();
    }, []);

    const handleSaveCate = async (name, symbol, salaryType) => {
        try {
            const response = await fetch(`${BASE_URL}salary_categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, symbol, salaryType }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thêm thành công');
                reloadAfterDelay(500);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpdateCate = async (name, symbol, salaryType) => {
        try {
            const response = await fetch(`${BASE_URL}salary_categories?wageCateId=${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, symbol, salaryType }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Cập nhật dữ liệu thành công!');
                reloadAfterDelay(500);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const saveCateSalary = () => {
        const name = document.querySelector('#name').value;
        const symbol = document.querySelector('#symbol').value;
        const type = document.querySelector('#type').value;

        if (name === '') handleAlert('alert-danger', 'Tên không được để trống.');
        else if (symbol === '') handleAlert('alert-danger', 'Ký hiệu không được để trống.');
        else {
            if (path.includes('/salary/categories/create')) handleSaveCate(name, symbol, type);
            else handleUpdateCate(name, symbol, type);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    return (
        <>
            <div>
                <div className={cx('content-wrapper')}>
                    <section className={cx('content')}>
                        <div className={cx('container-fluid')}>
                            <section className={cx('content-header')}>
                                <h1>
                                    Danh mục lương <small>Sửa</small>
                                </h1>
                            </section>
                            <div className={cx('row', 'no-gutters')}>
                                <div className={cx('pc-12')}>
                                    <div className={cx('card')}>
                                        <div className={cx('card-header')}>
                                            <p className={cx('card-title')}>
                                                Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt
                                                buộc
                                            </p>
                                        </div>

                                        <form onSubmit={(e) => handleSubmit(e)}>
                                            <div className={cx('card-body')}>
                                                <div className={cx('row', 'no-gutters', 'form-group')}>
                                                    <label className={cx('pc-2')}>
                                                        Tên loại lương<span className={cx('text-red')}> *</span>
                                                    </label>
                                                    <div className={cx('pc-8')}>
                                                        <input className={cx('form-control')} type="text" id="name" />
                                                    </div>
                                                </div>
                                                <div className={cx('row', 'no-gutters', 'form-group')}>
                                                    <label className={cx('pc-2')}>
                                                        Ký hiệu<span className={cx('text-red')}> *</span>
                                                    </label>
                                                    <div className={cx('pc-8')}>
                                                        <input className={cx('form-control')} type="text" id="symbol" />
                                                    </div>
                                                </div>
                                                <div className={cx('row', 'no-gutters', 'form-group')}>
                                                    <label className={cx('pc-2')}>Loại lương</label>
                                                    <div className={cx('pc-8')}>
                                                        <select id="type" className={cx('form-control', 'select')}>
                                                            <option value="Lương cố định">Lương cố định</option>
                                                            <option value="Lương theo tháng">Lương theo tháng</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className={cx('alert')}>
                                                    <ul className={cx('pc-11')}>
                                                        <li className={cx('alert-content')}>
                                                            Tên không được để trống.
                                                        </li>
                                                    </ul>
                                                    <button
                                                        type="button"
                                                        className={cx('close', 'pc-1')}
                                                        onClick={clickClose}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <div className={cx('text-center')}>
                                                    <button
                                                        type="submit"
                                                        className={cx('btn', 'btn-success')}
                                                        onClick={saveCateSalary}
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button type="reset" className={cx('btn', 'btn-danger')}>
                                                        Nhập lại
                                                    </button>
                                                    <a href={routes.salaryCategories}>
                                                        <button type="button" className={cx('btn', 'btn-default')}>
                                                            Thoát
                                                        </button>
                                                    </a>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
