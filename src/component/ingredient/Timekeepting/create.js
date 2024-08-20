import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../create.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { isCheck, reloadAfterDelay } from '../../globalstyle/checkToken';
import { getAllUser, handleAlert } from '../ingredient';

const cx = classNames.bind(styles);

export default function Create() {
    (async function () {
        await isCheck();
    })();

    const date = new Date();
    const day = date.toISOString().split('T')[0];
    const time = date.toLocaleTimeString('vi-VN');

    const [user, setUser] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/checks/edit/', '');

    const getTimeKeeping = async () => {
        if (path.includes('/checks/create')) return;
        try {
            const response = await fetch(`${BASE_URL}checks/time?id=${path}`, {
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
                const dataRs = data.result;

                document
                    .querySelector('#user_id')
                    .querySelector('option[value="' + dataRs.employee.id + '"]').selected = true;
                document.querySelector('#start').value = dataRs.date;
                document.querySelector('#time').value = dataRs.time;
                document.querySelector(`.${cx('message')}`).value = dataRs.reason;
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        (async function () {
            await getAllUser(token).then((result) => setUser(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getTimeKeeping();
        })();
    }, []);

    const saveTimeKeeping = async (employeeId, date, time, reason, method) => {
        let url = `${BASE_URL}checks`;
        if (method === 'PUT') url += `?id=${path}`;

        try {
            const response = await fetch(`${url}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    time,
                    date,
                    reason,
                    employeeId,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thêm thành công');
                reloadAfterDelay(500);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    const handleCheck = () => {
        const user = document.querySelector('#user_id').value;
        const start = document.querySelector('#start').value;
        const time = document.querySelector('#time').value;
        const message = document.querySelector(`.${cx('message')}`).value;

        if (start === '') handleAlert('alert-danger', 'Ngày không được để trống');
        else if (time === '') handleAlert('alert-danger', 'Thời gian không được để trống');
        else {
            if (path.includes('/checks/create')) saveTimeKeeping(user, start, time, message, 'POST');
            else saveTimeKeeping(user, start, time, message, 'PUT');
        }
    };

    const clickAddTimeKeeping = async () => {
        handleCheck();
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Chấm công <small>Thêm mới</small>
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

                                    <form onSubmit={(e) => handleSubmitForm(e)}>
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Họ tên<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <select id="user_id" className={cx('form-control', 'select')}>
                                                        {user.map((item) => (
                                                            <option
                                                                data-vacationhours={item.employee.vacationHours}
                                                                key={item.id}
                                                                value={item.employee.id}
                                                            >
                                                                {item.employee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Thời gian<span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-5')}>
                                                    <div className={cx('input-group')}>
                                                        <input
                                                            className={cx('form-control')}
                                                            type="date"
                                                            id="start"
                                                            defaultValue={day}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className={cx('pc-3')}>
                                                    <div className={cx('input-group', 'date')}>
                                                        <input
                                                            className={cx('form-control')}
                                                            type="text"
                                                            id="time"
                                                            defaultValue={time}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>Ghi chú</label>
                                                <div className={cx('pc-8')}>
                                                    <textarea
                                                        className={cx('form-control', 'message')}
                                                        rows="6"
                                                        placeholder=""
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11')}>
                                                    <li className={cx('alert-content')}></li>
                                                </ul>
                                                <button type="button" className={cx('close')} onClick={clickClose}>
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                {path.includes('/day_off_letters/create') ? (
                                                    <button
                                                        type="submit"
                                                        className={cx('btn', 'btn-success')}
                                                        onClick={clickAddTimeKeeping}
                                                    >
                                                        Thêm mới
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        className={cx('btn', 'btn-success')}
                                                        onClick={clickAddTimeKeeping}
                                                    >
                                                        Lưu
                                                    </button>
                                                )}
                                                <button type="reset" className={cx('btn', 'btn-default')}>
                                                    Nhập lại
                                                </button>

                                                <a href={routes.checks}>
                                                    <button type="button" className={cx('btn', 'btn-danger')}>
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
