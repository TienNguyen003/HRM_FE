/* eslint-disable eqeqeq */
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ButtonCustom from '../../component/globalstyle/Button/button';
import styles from './login.module.scss';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Login() {
    const login = () => {
        const username = document.querySelector(`.${cx('username')}`);
        const password = document.querySelector(`.${cx('password')}`);
        const alert = document.querySelector(`.${cx('text-danger')}`);
        if (username.value == '') alert.textContent = 'Tên đăng nhập không được để trống!';
        else if (password.value == '') alert.textContent = 'Mật khẩu không được để trống!';
        else {
            fetch('http://localhost:8083/api/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if(data.code == 303) {
                        localStorage.setItem("authorizationData", data.result.token);
                        window.location.href = "/";
                    }
                });
        }
    };

    return (
        <div className={cx('login-box')}>
            <div className={cx('login')}>
                <div className={cx('login-logo')}>
                    <a href="/">
                        <b className={cx('title')}>HRM</b>
                    </a>
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-body', 'login-card-body')}>
                        <p className={cx('login-box-msg')}>Đăng nhập hệ thống</p>
                        <form>
                            <div className={cx('input-group', 'mb-3')}>
                                <select id="language" className={cx('form-control')}>
                                    <option defaultValue="vi" selected="" data-href="https://demo.hrm.one/language/vi">
                                        Tiếng Việt
                                    </option>
                                    <option defaultValue="en" data-href="https://demo.hrm.one/language/en">
                                        English
                                    </option>
                                </select>
                                <div className={cx('input-group-append')}>
                                    <div className={cx('input-group-text')}>
                                        <img src="/img/ensign_vi.png" className={cx('mr-2')} />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('input-group', 'mb-3')}>
                                <input
                                    type="text"
                                    className={cx('form-control', 'username')}
                                    placeholder="Tên đăng nhập"
                                />
                                <div className={cx('input-group-append')}>
                                    <div className={cx('input-group-text')}>
                                        <FontAwesomeIcon icon={faUser} className={cx('icon-location')} />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('input-group', 'mb-3')}>
                                <input
                                    type="password"
                                    className={cx('form-control', 'password')}
                                    placeholder="Mật khẩu"
                                />
                                <div className={cx('input-group-append')}>
                                    <div className={cx('input-group-text')}>
                                        <FontAwesomeIcon icon={faLock} className={cx('icon-location')} />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('row')}>
                                <div className={cx('col-6')}>
                                    <div className={cx('icheck-primary')}>
                                        <input type="checkbox" id="remember" name="remember" />
                                        <label htmlFor="remember">Nhớ mật khẩu</label>
                                    </div>
                                </div>
                                <div className={cx('col-6')}>
                                    <ButtonCustom type="button" onClick={login} className={cx('button')}>
                                        Đăng nhập
                                    </ButtonCustom>
                                </div>
                            </div>
                        </form>
                        <p className={cx('text-danger', 'text-center')}></p>
                        <div className={cx('info-account')}>
                            <p className={cx('text-center')}>- Thông tin -</p>
                            <p className={cx('mt-1')}>Quản trị:</p>
                            <p>&emsp;-&emsp;User: admin</p>
                            <p>&emsp;-&emsp;Pass: 123</p>
                            <p className={cx('mt-1')}>Người dùng:</p>
                            <p>&emsp;-&emsp;User: nhanvien</p>
                            <p>&emsp;-&emsp;Pass: 123456</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
