import classNames from 'classnames/bind';
import { useEffect } from 'react';

import styles from '../../create.module.scss';
import Load from '../../../globalstyle/Loading/load';
import { BASE_URL } from '../../../../config/config';
import { reloadAfterDelay } from '../../../globalstyle/checkToken';
import { tooglePass, changePassword, clickAutoPassword, handleAlert } from '../../ingredient';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

function RsPass() {
    const { state, redirectLogin, checkRole } = useAuth();

    let path = window.location.pathname.replace('/users/reset-password/', '');
    let search = new URLSearchParams(window.location.search).get('token');
    search = search ? search.split('hrm') : '';

    const getUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}users/user?userId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
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
                    Authorization: `Bearer ${state.user}`,
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
        !state.isAuthenticated && redirectLogin();
        (async () => {
            await checkRole(state.account.role.permissions, 'USER_RSPASS', true);
            await getUsers();
            await updatePass();
        })();
    }, [state.isAuthenticated, state.loading]);

    const resetPass = () => {
        const email = document.querySelector('#email').textContent;
        const id = document.querySelector(`.${cx('employee_name')}`).textContent;
        const pass = document.querySelector('#password').value;

        if (path === '' || pass.length < 6) handleAlert('alert-danger', 'Mật khẩu không được để trống và phải lớn hơn 6 ký tự');
        else if (!path.includes('token')) handleRsPass(path, pass, email);
    };

    const handleRsPass = async (id, new_pass, email) => {
        const modalLoad = document.querySelector('#modal-load');
        const load = document.querySelector('#load');
        try {
            load.classList.toggle(`${cx('hidden')}`);
            modalLoad.classList.toggle(`${cx('hidden')}`);
            const response = await fetch(`${BASE_URL}users/rs-pass`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({
                    id,
                    new_pass,
                    email,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                load.classList.toggle(`${cx('hidden')}`);
                modalLoad.classList.toggle(`${cx('hidden')}`);
                alert(data.result);
                reloadAfterDelay(400);
            }
        } catch (error) {
            console.error('Error fetching offices:', error.message);
        }
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    return (
        <>
            <Load />
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
                                            Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt buộc
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
                                                        <i className={cx('fa-solid fa-eye', 'pc-1')} id="iconShow" onClick={() => tooglePass(true)}></i>
                                                        <i
                                                            className={cx('fa-solid fa-eye-slash', 'pc-1', 'hidden')}
                                                            id="iconHidden"
                                                            onClick={() => tooglePass(false)}
                                                        ></i>
                                                    </div>
                                                    <span className={cx('input-group-btn', 'pc-2')}>
                                                        <button onClick={clickAutoPassword} className={cx('btn', 'btn-primary', 'button-2')}>
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
                                        <div className={cx('alert')}>
                                            <ul className={cx('pc-11')}>
                                                <li className={cx('alert-content')}>Tên không được để trống.</li>
                                            </ul>
                                            <button type="button" className={cx('close', 'pc-1')} onClick={clickClose}>
                                                ×
                                            </button>
                                        </div>
                                        <div className={cx('box-footer', 'text-center')}>
                                            <button type="submit" className={cx('btn', 'btn-success')} onClick={resetPass}>
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
