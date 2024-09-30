import React from 'react';
import classNames from 'classnames/bind';
import { useEffect } from 'react';

import styles from '../create.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { isCheck, reloadAfterDelay, decodeToken } from '../../globalstyle/checkToken';
import { handleAlert } from '../ingredient';

const cx = classNames.bind(styles);

export default function Create() {
    (async function () {
        await isCheck();
        decodeToken(token, 'HOLI_ADD', true)
    })();

    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/holidays/edit/', '');

    const getHoliday = async () => {
        if (path.includes('/holidays/create')) return;
        try {
            const response = await fetch(`${BASE_URL}holidays/day?holidayId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                document.querySelector('#name').value = data.result.name;
                document.querySelector('#start').value = data.result.startTime;
                document.querySelector('#end').value = data.result.endTime;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            await getHoliday();
        })();
    }, []);

    const handleSave = async (name, startTime, endTime, totalTime) => {
        try {
            const response = await fetch(`${BASE_URL}holidays`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, startTime, endTime, totalTime }),
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
    const handleUpdate = async (name, startTime, endTime, totalTime) => {
        try {
            const response = await fetch(`${BASE_URL}holidays?holidayId=${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, startTime, endTime, totalTime }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Cập nhật thành công!');
                reloadAfterDelay(500);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const saveHoliday = () => {
        const name = document.querySelector('#name').value;
        const start = document.querySelector('#start').value;
        const end = document.querySelector('#end').value;

        if (name === '') handleAlert('alert-danger', 'Tên không được để trống.');
        else if (start === '') handleAlert('alert-danger', 'Ngày bắt đầu không được để trống.');
        else if (end === '') handleAlert('alert-danger', 'Thời gian kết thúc không được để trống.');
        else if (end <= start) handleAlert('alert-danger', 'Thời gian nghỉ lễ không hợp lệ!');
        else {
            const totalTime = (new Date(end) - new Date(start)) / (1000 * 3600);
            if (path.includes('/holidays/create')) handleSave(name, start, end, totalTime);
            else handleUpdate(name, start, end, totalTime);
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
                                Nghỉ lễ <small>Thêm mới</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
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
                                                <label className={cx('pc-2', 'm-3')}>
                                                    Tên ngày nghỉ<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8')}>
                                                    <input className={cx('form-control')} type="text" id="name" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3')}>
                                                    Ngày bắt đầu nghỉ<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input type="date" className={cx('form-control')} id="start" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3')}>
                                                    Ngày kết thúc nghỉ<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input type="date" className={cx('form-control')} id="end" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button type="button" className={cx('close')} onClick={clickClose}>
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                <button
                                                    type="submit"
                                                    className={cx('btn', 'btn-success')}
                                                    onClick={saveHoliday}
                                                >
                                                    Lưu lại
                                                </button>
                                                <button type="reset" className={cx('btn', 'btn-default')}>
                                                    Nhập lại
                                                </button>
                                                <a href={routes.holidays}>
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
