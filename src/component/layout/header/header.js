import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDashboard,
    faCalendarCheck,
    faCogs,
    faDollarSign,
    faEnvelopeOpenText,
    faHandHoldingDollar,
    faRegistered,
    faUmbrellaBeach,
    faUsers,
    faBars,
    faBell,
} from '@fortawesome/free-solid-svg-icons';

import routesConfig from '../../../config/routes';
import styles from './header.module.scss';
import Menu from '../menu/menu';
import MenuItem from '../menu/menuItem';

const cx = classNames.bind(styles);

function Header() {
    function redirectLogin() {
        window.location.href = '/login';
    }
    const token = localStorage.getItem('authorizationData') ? localStorage.getItem('authorizationData') : [];

    async function getDataUser() {
        if(token != ''){
            const response = await fetch('http://localhost:8083/api/users/myInfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            getDataEmployee(data.result.employeeId, token);
        }
    }

    async function getDataEmployee(id, token) {
        const response = await fetch(`http://localhost:8083/api/employee/employee?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();

        const emplname = document.querySelector(`.${cx('hidden-xs')}`);
        const emplimg = document.querySelector(`.${cx('user-image')}`);
        const emplimgCircle = document.querySelector(`.${cx('img-circle')}`);

        emplname.textContent = data.result.name;
        emplimgCircle.src = emplimg.src = data.result.image;
    }

    async function logout() {
        const response = await fetch('http://localhost:8083/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
            }),
        });

        localStorage.setItem("authorizationData", "");
        redirectLogin();
    }

    getDataUser();

    const clickLanguage = () => {
        const language = document.querySelector(`.${cx('language')}`);
        language.classList.toggle(`${cx('show')}`);
    };

    const clickUser = () => {
        const user = document.querySelector(`.${cx('user')}`);
        user.classList.toggle(`${cx('show')}`);
    };

    const clickBars = () => {
        const menu = document.querySelector(`.${cx('jquery-accordion-menu')}`);
        const nav = document.querySelector(`.${cx('nav-wrapper')}`);
        menu.classList.toggle(`${cx('menu-click')}`);
        nav.classList.toggle(`${cx('nav-click')}`);
    };

    return (
        <div>
            <div className={cx('nav-wrapper')}>
                <p className={cx('nav-icon')} onClick={clickBars}>
                    <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
                </p>

                <ul className={cx('list-group')}>
                    <li className={cx('nav-item')}>
                        <a class="nav-link" href="#" onClick={clickLanguage}>
                            <img src="https://demo.hrm.one/img/ensign_vi.png" alt="" />
                        </a>
                        <div className={cx('dropdown-menu', 'language')}>
                            <a href="#" className={cx('dropdown-item')}>
                                <img src="https://demo.hrm.one/img/ensign_vi.png" alt="" class="mr-2" /> Tiếng Việt
                            </a>
                            <a href="#" className={cx('dropdown-item')}>
                                <img src="https://demo.hrm.one/img/ensign_en.png" alt="" class="mr-2" /> English
                            </a>
                        </div>
                    </li>
                    <li className={cx('nav-item')}>
                        <a className={cx('nav-link')} href="#" id="notification">
                            <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
                        </a>
                    </li>

                    <li className={cx('user-menu')}>
                        <a href="#" className={cx('dropdown-toggle')} onClick={clickUser}>
                            <img
                                src="https://demo.hrm.one/img/no-avatar.jpg"
                                className={cx('user-image')}
                                alt="User Image"
                            />
                            <span className={cx('hidden-xs')}>Nguyễn Cao Tú</span>
                        </a>
                        <ul className={cx('dropdown-menu', 'user')}>
                            <li className={cx('user-header')}>
                                <a href="#">
                                    <img
                                        src="https://demo.hrm.one/img/no-avatar.jpg"
                                        className={cx('img-circle')}
                                        alt="User Image"
                                    />
                                </a>
                            </li>

                            <li className={cx('user-footer')}>
                                <div className={cx('pull-bottom')}>
                                    <a href="#" className={cx('btn-success', 'btn')}>
                                        Sửa hồ sơ
                                    </a>
                                </div>
                                <div className={cx('pull-bottom')}>
                                    <a href="#" className={cx('btn-warning', 'btn')}>
                                        Đổi mật khẩu
                                    </a>
                                </div>
                                <div className={cx('pull-bottom')} onClick={logout}>
                                    <a href="#" className={cx('btn-danger', 'btn')}>
                                        Đăng xuất
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className={cx('jquery-accordion-menu')}>
                <div className={cx('jquery-accordion-menu-header')}>HRM </div>
                <Menu className={cx('menu-click')}>
                    <MenuItem
                        className={cx('active')}
                        title="Dashboard"
                        to={routesConfig.home}
                        icon={<FontAwesomeIcon icon={faDashboard}></FontAwesomeIcon>}
                    />
                    <MenuItem
                        title="Phân Quyền"
                        to={routesConfig.role}
                        icon={<FontAwesomeIcon icon={faRegistered}></FontAwesomeIcon>}
                    />
                    <MenuItem
                        title="Nhân Viên"
                        to={routesConfig.user}
                        icon={<FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>}
                    />
                    <MenuItem
                        title="Đơn Xin Nghỉ"
                        to={routesConfig.leave}
                        icon={<FontAwesomeIcon icon={faEnvelopeOpenText}></FontAwesomeIcon>}
                    />
                    <MenuItem
                        title="Chấm Công"
                        to={routesConfig.userBank}
                        icon={<FontAwesomeIcon icon={faCalendarCheck}></FontAwesomeIcon>}
                    />
                    <MenuItem
                        title="Ứng Lương"
                        to={routesConfig.userContracts}
                        icon={<FontAwesomeIcon icon={faHandHoldingDollar}></FontAwesomeIcon>}
                    />
                    <MenuItem
                        title="Quản Lý Lương"
                        to={routesConfig.userCreate}
                        icon={<FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon>}
                    />
                    <MenuItem
                        title="Quản Lý Ngày Nghỉ"
                        to={routesConfig.roleCreate}
                        icon={<FontAwesomeIcon icon={faUmbrellaBeach}></FontAwesomeIcon>}
                    />
                    <MenuItem
                        title="Thiết Lập Chung"
                        to={routesConfig.login}
                        icon={<FontAwesomeIcon icon={faCogs}></FontAwesomeIcon>}
                    />
                </Menu>
            </div>
        </div>
    );
}

export default Header;
