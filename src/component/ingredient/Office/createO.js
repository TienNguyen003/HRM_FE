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
    const path = window.location.pathname.replace('/offices/edit/', '');

    const getOffices = async () => {
        if (path.includes('/offices/create')) return;
        try {
            const response = await fetch(`${BASE_URL}offices/office?officeId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                document.querySelector('#name').value = data.result.name;
                document.querySelector('#address').value = data.result.address;
                document.querySelector('#email').value = data.result.email;
                document.querySelector('#phone').value = data.result.phone;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async () => {
            await checkRole(state.account.role.permissions, 'OFF_ADD', true);
            await getOffices();
        })();
    }, [state.isAuthenticated, state.loading]);

    const handleSave = async (name, address, phone, email, method) => {
        let url = `${BASE_URL}offices`;
        if (method == 'PUT') url += `?officeId=${path}`;
        try {
            const response = await fetch(`${url}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({ name, address, phone, email }),
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
        const address = document.querySelector('#address').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#phone').value;

        if (name === '') handleAlert('alert-danger', 'Tên không được để trống.');
        else {
            if (path.includes('/offices/create')) handleSave(name, address, phone, email, 'POST');
            else handleSave(name, address, phone, email, 'PUT');
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
                                Thông tin văn phòng <small>Thêm mới</small>
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
                                                    Tên văn phòng<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" id="name" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>Địa chỉ</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" id="address" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>Email</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" id="email" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>Số điện thoại</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" id="phone" />
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
                                                {path.includes('/offices/create') ? (
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
                                                <a href={routes.offices}>
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
