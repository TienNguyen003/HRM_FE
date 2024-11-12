/* eslint-disable eqeqeq */
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import styles from './login.module.scss';
import { BASE_URL } from '../../../config/config';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Login() {
    const { login } = useAuth();

    const checkLogin = async (username, password) => {
        const response = await fetch(`${BASE_URL}auth/token`, {
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
        if (data.code === 303) {
            login(data.result);
        } else {
            const message = document.querySelector(`.${cx('text-danger')}`);
            message.textContent = data.message;
        }
    };

    const handleLogin = () => {
        const alert = document.querySelector(`.${cx('text-danger')}`);
        const username = document.querySelector(`.${cx('username')}`).value;
        const password = document.querySelector(`.${cx('password')}`).value;
        if (username.trim() === '') alert.textContent = 'Tên đăng nhập không được để trống!';
        else if (password.trim() === '') alert.textContent = 'Mật khẩu không được để trống!';
        else checkLogin(username.trim(), password.trim());
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
                                    <option defaultValue="vi" data-href="https://hnue.edu.vn/Portals/_default/skins/hnue_skin/img/VN.png">
                                        Tiếng Việt
                                    </option>
                                    <option
                                        defaultValue="en"
                                        data-href="https://res.cloudinary.com/dwn20guz0/image/upload/v1726558584/avatarUser/ensign_en_z1brlr.png"
                                    >
                                        English
                                    </option>
                                </select>
                                <div className={cx('input-group-append')}>
                                    <div className={cx('input-group-text')}>
                                        <img src="https://hnue.edu.vn/Portals/_default/skins/hnue_skin/img/VN.png" className={cx('mr-2')} />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('input-group', 'mb-3')}>
                                <input type="text" className={cx('form-control', 'username')} placeholder="Tên đăng nhập" />
                                <div className={cx('input-group-append')}>
                                    <div className={cx('input-group-text')}>
                                        <FontAwesomeIcon icon={faUser} className={cx('icon-location')} />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('input-group', 'mb-3')}>
                                <input type="password" className={cx('form-control', 'password')} placeholder="Mật khẩu" />
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
                                    <button type="button" onClick={handleLogin} className={cx('button', 'button-login')}>
                                        Đăng nhập
                                    </button>
                                </div>
                            </div>
                        </form>
                        <p className={cx('text-danger', 'text-center')}></p>
                        <div className={cx('info-account')}>
                            <p className={cx('text-center')}>- Thông tin -</p>
                            <p className={cx('mt-1')}>Quản trị:</p>
                            <p>&emsp;-&emsp;User: admin</p>
                            <p>&emsp;-&emsp;Pass: 123321</p>
                            <p className={cx('mt-1')}>Người dùng:</p>
                            <p>&emsp;-&emsp;User: demo.nhanvien</p>
                            <p>&emsp;-&emsp;Pass: 123321</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
