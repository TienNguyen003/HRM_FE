import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import { BASE_URL } from '../../../../config/config';
import { isCheck, reloadAfterDelay } from '../../../globalstyle/checkToken';
import { changePassword, clickAutoPassword, handleAlert } from '../../ingredient';

const cx = classNames.bind(styles);

function RsPass() {
    (async function () {
        await isCheck();
    })();

    const token = localStorage.getItem('authorizationData') || '';
    let path = window.location.pathname.replace('/users/reset-password/', '');
    let search = new URLSearchParams(window.location.search).get('token');
    search = search ? search.split('hrm') : '';

    const getUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}users/user?userId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch offices');
            }

            const data = await response.json();
            if (data.code === 303) {
                document.querySelector(`.${cx('employee_name')}`).textContent = data.result.employee.name;
                document.querySelector('#email').textContent = data.result.employee.email;
            }
        } catch (error) {
            console.error('Error fetching offices:', error.message);
        }
    };

    const updatePass = async () => {
        const date = search ? new Date(search[1]) : 0;
        if (date < new Date() && !path.includes('token')) return;
        try {
            const response = await fetch(`${BASE_URL}users/update-pass?userId=${path}&new_pass=${search[2]}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                alert('Cập nhật thành công');
                reloadAfterDelay(500);
                localStorage.setItem('authorizationData', '');
                localStorage.setItem('employee', '');
            } else alert(data.message);
        } catch (error) {
            console.error('Error fetching offices:', error.message);
        }
    };

    useEffect(() => {
        (async () => {
            await getUsers();
            await updatePass();
        })();
    }, []);

    const resetPass = () => {
        const email = document.querySelector('#email').textContent;
        const id = document.querySelector(`.${cx('employee_name')}`).textContent;
        const pass = document.querySelector('#password').value;

        if (pass !== '' && !path.includes('token')) handleRsPass(path, pass, email);
    };

    const handleRsPass = async (id, new_pass, email) => {
        try {
            const response = await fetch(`${BASE_URL}users/rs-pass`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id,
                    new_pass,
                    email,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                alert(data.result);
                reloadAfterDelay(500);
            }
        } catch (error) {
            console.error('Error fetching offices:', error.message);
        }
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>Thay đổi mật khẩu</h1>
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
                                    <div className={cx('card-body')}>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2')}>Người dùng</label>
                                            <div className={cx('pc-8')}>
                                                <div className={cx('employee_name')}></div>
                                                <div id="email" style={{ display: 'none' }}></div>
                                            </div>
                                        </div>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'control-label')}>
                                                Mật khẩu<span className={cx('text-red')}> *</span>
                                            </label>
                                            <div className={cx('pc-8')}>
                                                <div className={cx('input-group', 'row', 'no-gutters')}>
                                                    <input
                                                        type="password"
                                                        className={cx('form-control', 'pc-10', 'input-10')}
                                                        id="password"
                                                        placeholder="Nhập mật khẩu hoặc dùng tính năng tạo tự động"
                                                        onChange={(e) => changePassword(e)}
                                                    />
                                                    <span className={cx('input-group-btn', 'pc-2')}>
                                                        <button
                                                            onClick={clickAutoPassword}
                                                            className={cx('btn', 'btn-primary', 'button-2')}
                                                        >
                                                            Tạo tự động
                                                        </button>
                                                    </span>
                                                </div>
                                                <div id="strength">
                                                    <span className={cx('result')}></span>
                                                    <span className={cx('str-box')}>
                                                        <div className={cx('strong-pass')}></div>
                                                    </span>
                                                    <span className={cx('str-box')}>
                                                        <div className={cx('strong-pass')}></div>
                                                    </span>
                                                    <span className={cx('str-box')}>
                                                        <div className={cx('strong-pass')}></div>
                                                    </span>
                                                    <span className={cx('str-box')}>
                                                        <div className={cx('strong-pass')}></div>
                                                    </span>
                                                    <span className={cx('str-box')}>
                                                        <div className={cx('strong-pass')}></div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('box-footer', 'text-center')}>
                                            <button
                                                type="submit"
                                                className={cx('btn', 'btn-success')}
                                                onClick={resetPass}
                                            >
                                                Cập nhật mật khẩu
                                            </button>
                                            &nbsp;
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

export default RsPass;
