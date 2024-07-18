import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../Create/create.module.scss';
import { isCheck } from '../../../globalstyle/checkToken';
import { changePassword, clickAutoPassword } from '../PasswordUtils';

const cx = classNames.bind(styles);

function RsPass() {
    (async function () {
        await isCheck();
    })();

    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/users/reset-password/', '');

    async function getUsers() {
        try {
            const response = await fetch(`http://localhost:8083/api/users/user?userId=${path}`, {
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
            }
        } catch (error) {
            console.error('Error fetching offices:', error.message);
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

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
                                                <div className={cx('employee_name')}>Nguyễn Cao Tú</div>
                                            </div>
                                        </div>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'control-label')}>Mật khẩu cũ</label>
                                            <div className={cx('pc-8')}>
                                                <input
                                                    id="oll_password"
                                                    className={cx('form-control')}
                                                    type="password"       
                                                    placeholder='Nhập mật khẩu cũ'                                             
                                                />
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
