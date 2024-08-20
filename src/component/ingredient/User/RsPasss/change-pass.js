import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import { BASE_URL } from '../../../../config/config';
import { isCheck, reloadAfterDelay } from '../../../globalstyle/checkToken';
import Load from '../../../globalstyle/Loading/load';
import { tooglePass, changePassword, clickAutoPassword, handleAlert } from '../../ingredient';

const cx = classNames.bind(styles);

export default function ChangePass() {
    (async function () {
        await isCheck();
    })();

    const token = localStorage.getItem('authorizationData') || '';

    const handleChangePass = async (id, new_pass, old_pass) => {
        try {
            const response = await fetch(`${BASE_URL}users/change-pass`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id,
                    new_pass,
                    old_pass,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thêm dữ liệu thành công');
                localStorage.setItem('authorizationData', '');
                localStorage.setItem('employee', '');
                localStorage.setItem('idU', '');
                reloadAfterDelay(500);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    const changePass = () => {
        const old_pass = document.querySelector('#old_pass').value;
        const password = document.querySelector('#password').value;
        const comfirm_pass = document.querySelector('#comfirm_pass').value;
        const idU = localStorage.getItem('idU');

        if (old_pass === '') handleAlert('alert-danger', 'Vui lòng nhập mật khẩu cũ');
        else if (password === '') handleAlert('alert-danger', 'Mật khẩu mới không được để trống');
        else if (old_pass === password) handleAlert('alert-danger', 'Mật khẩu mới không được trùng mật khẩu cũ');
        else if (password.length < 6) handleAlert('alert-danger', 'Mật khẩu mới ít nhất 6 ký tự');
        else if (comfirm_pass === '') handleAlert('alert-danger', 'Mật khẩu nhập lại không được trống');
        else if (comfirm_pass.length < 6) handleAlert('alert-danger', 'Mật khẩu nhập lại ít nhất 6 ký tự');
        else if (comfirm_pass != password) handleAlert('alert-danger', 'Mật khẩu không khớp');
        else handleChangePass(idU, password, old_pass);
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    return (
        <>
            <div className={cx('load', 'hidden')} id="modal-load"></div>
            <Load className={cx('hidden')} id="load" />
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
                                            <label className={cx('pc-2', 'control-label')}>Mật khẩu cũ</label>
                                            <div className={cx('pc-8')}>
                                                <input className={cx('form-control')} type="password" id="old_pass" />
                                            </div>
                                        </div>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'control-label')}>
                                                Mật khẩu mới<span className={cx('text-red')}> *</span>
                                            </label>
                                            <div className={cx('pc-8')}>
                                                <div className={cx('input-group', 'row', 'no-gutters')}>
                                                    <div
                                                        className={cx('pc-10')}
                                                        style={{
                                                            border: '1px solid #ced4da',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            textAlign: 'center',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <input
                                                            type="password"
                                                            className={cx('form-control', 'pc-11', 'input-10')}
                                                            id="password"
                                                            placeholder="Nhập mật khẩu hoặc dùng tính năng tạo tự động"
                                                            onChange={(e) => changePassword(e)}
                                                            style={{ marginBottom: 0, border: 'unset' }}
                                                        />
                                                        <i
                                                            className={cx('fa-solid fa-eye', 'pc-1')}
                                                            id="iconShow"
                                                            onClick={() => tooglePass(true)}
                                                        ></i>
                                                        <i
                                                            className={cx('fa-solid fa-eye-slash', 'pc-1', 'hidden')}
                                                            id="iconHidden"
                                                            onClick={() => tooglePass(false)}
                                                        ></i>
                                                    </div>
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
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'control-label')}>Nhập lại mật khẩu</label>
                                            <div className={cx('pc-8')}>
                                                <input
                                                    className={cx('form-control')}
                                                    type="password"
                                                    id="comfirm_pass"
                                                />
                                            </div>
                                        </div>
                                        <div className={cx('alert')}>
                                            <ul className={cx('pc-11')}>
                                                <li className={cx('alert-content')}></li>
                                            </ul>
                                            <button type="button" className={cx('close', 'pc-1')} onClick={clickClose}>
                                                ×
                                            </button>
                                        </div>
                                        <div className={cx('box-footer', 'text-center')}>
                                            <button
                                                type="submit"
                                                className={cx('btn', 'btn-success')}
                                                onClick={changePass}
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
