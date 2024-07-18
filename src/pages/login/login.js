/* eslint-disable eqeqeq */
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import ButtonCustom from '../../component/globalstyle/Button/button';
import styles from './login.module.scss';

const cx = classNames.bind(styles);

function Login() {
    const vietnameseRegex = /^[^\u0300\u0301\u0303\u0309\u0323\u0302\u0306\u031B\u030A\u0301\u1EA0-\u1EF9]+$/;

    async function checkLogin(username, password) {
        const response = await fetch('http://localhost:8083/api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await response.json();
        if (data.code == 303) {
            localStorage.setItem('authorizationData', data.result.token);
            window.location.href = '/';
        } else {
            const message = document.querySelector(`.${cx('text-danger')}`);
            message.textContent = data.message;
        }
    }

    const login = () => {
        const alert = document.querySelector(`.${cx('text-danger')}`);
        const username = document.querySelector(`.${cx('username')}`).value;
        const password = document.querySelector(`.${cx('password')}`).value;
        if (username == '') alert.textContent = 'Tên đăng nhập không được để trống!';
        else if (password == '') alert.textContent = 'Mật khẩu không được để trống!';
        else checkLogin(username, password)
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
                                    <option
                                        defaultValue="vi"
                                        data-href="https://demo.hrm.one/img/ensign_vi.png"
                                    >
                                        Tiếng Việt
                                    </option>
                                    <option defaultValue="en" data-href="https://demo.hrm.one/img/ensign_en.png">
                                        English
                                    </option>
                                </select>
                                <div className={cx('input-group-append')}>
                                    <div className={cx('input-group-text')}>
                                        <img src="https://demo.hrm.one/img/ensign_vi.png" className={cx('mr-2')} />
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
