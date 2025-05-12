import React from 'react';
import classNames from 'classnames/bind';
import { useEffect } from 'react';

import styles from '../create.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { handleAlert } from '../ingredient';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

export default function Create() {
    const { state, redirectLogin, checkRole } = useAuth();
    const path = window.location.pathname.replace('/holidays/day_off/edit/', '');

    const getHoliday = async () => {
        if (path.includes('/holidays/day_off/create')) return;
        try {
            const response = await fetch(`${BASE_URL}day_off_categories/day?dayOffId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                document.querySelector('#name').value = data.result.nameDay;
                document.querySelector('#time').value = data.result.timeDay;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async () => {
            await checkRole(state.account.role.permissions, 'LEAV_ADD', true);
            await getHoliday();
        })();
    }, [state.isAuthenticated, state.loading]);

    const handleSave = async (nameDay, timeDay, method = 'POST') => {
        let url = `${BASE_URL}day_off_categories`;
        if (method == 'PUT') url += `?dayOffId=${path}`;
        try {
            const response = await fetch(`${url}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({ nameDay, timeDay }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thành công');
                setTimeout(() => {
                    if (method === 'POST') {
                        document.querySelector('#formReset').reset();
                    }
                    clickClose();
                }, 3000);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const saveHoliday = () => {
        const name = document.querySelector('#name').value;
        const time = document.querySelector('#time').value;

        if (name === '') handleAlert('alert-danger', 'Tên không được để trống.');
        else if (time === '') handleAlert('alert-danger', 'Thời gian không được để trống, chỉ được chứa số.');
        else {
            if (path.includes('/holidays/day_off/create')) handleSave(name, time);
            else handleSave(name, time, 'PUT');
        }
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Danh mục nghỉ <small>Thêm mới</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>
                                            Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt buộc
                                        </p>
                                    </div>

                                    <form onSubmit={(e) => handleSubmitForm(e)} id="formReset">
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    Tên danh mục nghỉ<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" id="name" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    Giới hạn giờ nghỉ<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" id="time" />
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11', 't-11', 'm-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button type="button" className={cx('close')} onClick={clickClose}>
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                {path.includes('/holidays/day_off/create') ? (
                                                    <button type="submit" className={cx('btn', 'btn-success')} onClick={saveHoliday}>
                                                        Thêm mới
                                                    </button>
                                                ) : (
                                                    <button type="submit" className={cx('btn', 'btn-info')} onClick={saveHoliday}>
                                                        Lưu lại
                                                    </button>
                                                )}
                                                <button type="reset" className={cx('btn', 'btn-danger')}>
                                                    Nhập lại
                                                </button>
                                                <a href={routes.holidayDayOff}>
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
        </>
    );
}
