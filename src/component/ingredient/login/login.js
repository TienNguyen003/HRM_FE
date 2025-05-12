import classNames from 'classnames/bind';
import i18next from 'i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import styles from './login.module.scss';
import { BASE_URL } from '../../../config/config';
import { useAuth } from '../../../untils/AuthContext';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function Login() {
    const { login } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        const languageSet = localStorage.getItem('language') || 'vi';
        document.querySelector('#language').querySelector('option[value="' + languageSet + '"]').selected = true;
        if (languageSet === 'en') document.querySelector('#image_language').src = 'https://globalconsent.vn/public/frontend/wetech/img/lang/en.svg?v=6.3.0';
    }, []);

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

    const handleLanguage = (e) => {
        const selectElement = e.target;
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const img = selectedOption.getAttribute('data-href');

        document.querySelector('#image_language').src = img;
        i18next.changeLanguage(selectedOption.value);
        localStorage.setItem('language', selectedOption.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    return (
        <div className={cx('login-box')}>
            <div className={cx('login')}>
                <div className={cx('login-logo')}>
                    <a href="/">
                        <b className={cx('title')}>{t('common.hrm')}</b>
                    </a>
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-body', 'login-card-body')}>
                        <p className={cx('login-box-msg')}>{t('common.login to the system')}</p>
                        {/* <form> */}
                        <div className={cx('input-group', 'mb-3')}>
                            <select id="language" className={cx('form-control')} onChange={(e) => handleLanguage(e)}>
                                <option value="vi" data-href="https://globalconsent.vn/public/frontend/wetech/img/lang/vi.svg?v=6.3.0">
                                    Tiếng Việt
                                </option>
                                <option value="en" data-href="https://globalconsent.vn/public/frontend/wetech/img/lang/en.svg?v=6.3.0">
                                    English
                                </option>
                            </select>
                            <div className={cx('input-group-append')}>
                                <div className={cx('input-group-text')}>
                                    <img
                                        style={{ width: '20px' }}
                                        id="image_language"
                                        src="https://globalconsent.vn/public/frontend/wetech/img/lang/vi.svg?v=6.3.0"
                                        className={cx('mr-2')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={cx('input-group', 'mb-3')}>
                            <input type="text" className={cx('form-control', 'username')} placeholder={t('common.username')} />
                            <div className={cx('input-group-append')}>
                                <div className={cx('input-group-text')}>
                                    <FontAwesomeIcon icon={faUser} className={cx('icon-location')} />
                                </div>
                            </div>
                        </div>
                        <div className={cx('input-group', 'mb-3')}>
                            <input type="password" className={cx('form-control', 'password')} placeholder={t('common.password')} onKeyDown={handleKeyDown}/>
                            <div className={cx('input-group-append')}>
                                <div className={cx('input-group-text')}>
                                    <FontAwesomeIcon icon={faLock} className={cx('icon-location')} />
                                </div>
                            </div>
                        </div>
                        <div className={cx('row')}>
                            <div className={cx('pc-8', 't-8', 'm-8')}>
                                <div className={cx('icheck-primary')}>
                                    <input type="checkbox" id="remember" name="remember" />
                                    <label htmlFor="remember">{t('common.remember password')}</label>
                                </div>
                            </div>
                            <div className={cx('pc-4', 't-4', 'm-4')}>
                                <button type="button" onClick={handleLogin} className={cx('button', 'button-login')}>
                                    {t('common.button.login')}
                                </button>
                            </div>
                        </div>
                        {/* </form> */}
                        <p className={cx('text-danger', 'text-center')}></p>
                        <div className={cx('info-account')}>
                            <p className={cx('text-center')}>- {t('common.info')} -</p>
                            <p className={cx('mt-1')}>{t('common.administration')}:</p>
                            <p>&emsp;-&emsp;{t('common.username')}: admin</p>
                            <p>&emsp;-&emsp;{t('common.password')}: 123321</p>
                            <p className={cx('mt-1')}>{t('common.user')}:</p>
                            <p>&emsp;-&emsp;{t('common.username')}: demo.nhanvien</p>
                            <p>&emsp;-&emsp;{t('common.password')}: 123321</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
