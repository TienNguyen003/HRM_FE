import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import routesConfig from '../../../config/routes';
import styles from './header.module.scss';
import { BASE_URL } from '../../../config/config';

const cx = classNames.bind(styles);

function Header({ onClick }) {
    function redirectLogin() {
        window.location.href = '/login';
    }

    function changeClass(dropMenu) {
        const subMenu = dropMenu.querySelector(`.${cx('submenu')}`);
        const iconLeft = dropMenu.querySelector(`.${cx('iconLeft')}`);
        const linkActive = dropMenu.querySelector(`.${cx('link-active')}`);

        if (iconLeft) iconLeft.classList.toggle(`${cx('icon-rotate')}`);
        if (linkActive) linkActive.classList.toggle(`${cx('change-bg')}`);
        if (subMenu) subMenu.classList.toggle(`${cx('showBlock')}`);
    }

    const token = localStorage.getItem('authorizationData') || '';
    const employee = JSON.parse(localStorage.getItem('employee')) || '';

    async function logout() {
        const response = await fetch(`${BASE_URL}auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
            }),
        });

        localStorage.setItem('authorizationData', '');
        localStorage.setItem('employee', '');
        redirectLogin();
    }

    const clickLanguage = () => {
        const language = document.querySelector(`.${cx('language')}`);
        language.classList.toggle(`${cx('show')}`);
    };

    const clickUser = () => {
        const user = document.querySelector(`.${cx('user')}`);
        user.classList.toggle(`${cx('show')}`);
    };

    const clickBars = () => {
        onClick();

        const menu = document.querySelector(`.${cx('jquery-accordion-menu')}`);
        const nav = document.querySelector(`.${cx('nav-wrapper')}`);
        menu.classList.toggle(`${cx('menu-click')}`);
        nav.classList.toggle(`${cx('nav-click')}`);
    };

    useEffect(() => {
        const location = window.location.pathname;

        const dropMenus = document.querySelectorAll(`.${cx('drop-menu')}`);
        dropMenus.forEach((dropMenu) => {
            dropMenu.classList.remove(`${cx('active')}`);
            if (location === '/' && dropMenu.getAttribute('data-href') === '/') {
                dropMenu.classList.add(`${cx('active')}`);
            } else if (
                location.includes(dropMenu.getAttribute('data-href')) &&
                dropMenu.getAttribute('data-href') != '/'
            ) {
                dropMenu.classList.add(`${cx('active')}`);
                changeClass(dropMenu);
            }

            dropMenu.addEventListener('click', (e) => {
                changeClass(dropMenu);
            });
        });

        document.querySelector(`.${cx('hidden-xs')}`).textContent = employee.name;
        if (employee.image != '')
            document.querySelector(`.${cx('img-circle')}`).src = document.querySelector(`.${cx('user-image')}`).src =
                employee.image;
    }, []);

    return (
        <div>
            <div className={cx('nav-wrapper')}>
                <p className={cx('nav-icon')} onClick={clickBars}>
                    <i className="fas fa-bars"></i>
                </p>

                <ul className={cx('list-group')}>
                    <li className={cx('nav-item')}>
                        <a className="nav-link" href="#" onClick={clickLanguage}>
                            <img src="https://demo.hrm.one/img/ensign_vi.png" alt="" />
                        </a>
                        <div className={cx('dropdown-menu', 'language')}>
                            <a href="#" className={cx('dropdown-item')}>
                                <img src="https://demo.hrm.one/img/ensign_vi.png" alt="" /> Tiếng Việt
                            </a>
                            <a href="#" className={cx('dropdown-item')}>
                                <img src="https://demo.hrm.one/img/ensign_en.png" alt="" /> English
                            </a>
                        </div>
                    </li>
                    <li className={cx('nav-item')}>
                        <a className={cx('nav-link')} href="#" id="notification">
                            <i className="far fa-bell"></i>
                        </a>
                    </li>

                    <li className={cx('user-menu')}>
                        <a href="#" className={cx('dropdown-toggle')} onClick={clickUser}>
                            <img
                                src="https://demo.hrm.one/img/no-avatar.jpg"
                                className={cx('user-image')}
                                alt="User Image"
                            />
                            <span className={cx('hidden-xs')}></span>
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
                <ul>
                    <li className={cx('active', 'drop-menu')} data-href={routesConfig.home}>
                        <a href={routesConfig.home}>
                            <div className={cx('nav-link')}>
                                <i className="fas fa-tachometer-alt"></i>&nbsp;&nbsp;<p>Dashboard</p>
                            </div>
                        </a>
                    </li>
                    <li className={cx('drop-menu')} data-href={routesConfig.role}>
                        <a className={cx('link-active')}>
                            <div className={cx('nav-link')}>
                                <i className="fa fa-registered"></i>&nbsp;&nbsp;<p>Phân Quyền</p>
                            </div>
                            <FontAwesomeIcon className={cx('iconLeft')} icon={faChevronLeft}></FontAwesomeIcon>
                        </a>
                        <ul className={cx('submenu')}>
                            <li>
                                <a href={routesConfig.role}>Danh Sách </a>
                            </li>
                            <li>
                                <a href={routesConfig.roleCreate}>Thêm Mới</a>
                            </li>
                        </ul>
                    </li>
                    <li className={cx('drop-menu')} data-href={routesConfig.user}>
                        <a className={cx('link-active')}>
                            <div className={cx('nav-link')}>
                                <i className="fa fa-users"></i>&nbsp;&nbsp;<p>Nhân Viên</p>
                            </div>
                            <FontAwesomeIcon className={cx('iconLeft')} icon={faChevronLeft}></FontAwesomeIcon>
                        </a>
                        <ul className={cx('submenu')}>
                            <li>
                                <a href={routesConfig.userCreate}>Thêm Mới</a>
                            </li>
                            <li>
                                <a href={routesConfig.user}>Danh Sách</a>
                            </li>
                            <li>
                                <a href={routesConfig.userBank}>TK Ngân Hàng</a>
                            </li>
                            <li>
                                <a href={routesConfig.userContracts}>TT Hợp Đồng</a>
                            </li>
                        </ul>
                    </li>
                    <li className={cx('drop-menu')} data-href={routesConfig.leave}>
                        <a className={cx('link-active')}>
                            <div className={cx('nav-link')}>
                                <i className="fas fa-envelope-open-text"></i>&nbsp;&nbsp;
                                <p>Đơn Xin Nghỉ</p>
                            </div>
                            <FontAwesomeIcon className={cx('iconLeft')} icon={faChevronLeft}></FontAwesomeIcon>
                        </a>
                        <ul className={cx('submenu')}>
                            <li>
                                <a href={routesConfig.leave}>Danh Sách </a>
                            </li>
                            <li>
                                <a href={routesConfig.leaveApprovals}>Duyệt Đơn Xin Nghỉ </a>
                            </li>
                            <li>
                                <a href={routesConfig.leaveHs}>Lịch Sử Nghỉ Phép </a>
                            </li>
                        </ul>
                    </li>
                    <li className={cx('drop-menu')} data-href={routesConfig.checks}>
                        <a className={cx('link-active')}>
                            <div className={cx('nav-link')}>
                                <i className="far fa-calendar-check"></i>&nbsp;&nbsp;<p>Chấm Công</p>
                            </div>
                            <FontAwesomeIcon className={cx('iconLeft')} icon={faChevronLeft}></FontAwesomeIcon>
                        </a>
                        <ul className={cx('submenu')}>
                            <li>
                                <a href={routesConfig.checkCreate}>Thêm Mới</a>
                            </li>
                            <li>
                                <a href={routesConfig.checks}>Danh Sách </a>
                            </li>
                            <li>
                                <a href={routesConfig.checkCalendar}>Bảng Thời Gian</a>
                            </li>
                            <li>
                                <a href={routesConfig.checkApprovals}>Danh Sách Chờ Duyệt</a>
                            </li>
                            <li>
                                <a href={routesConfig.checkUp}>Upload File</a>
                            </li>
                        </ul>
                    </li>
                    <li className={cx('drop-menu')} data-href={routesConfig.advances}>
                        <a className={cx('link-active')}>
                            <div className={cx('nav-link')}>
                                <i className="fas fa-hand-holding-usd"></i>&nbsp;&nbsp;
                                <p>Ứng Lương</p>
                            </div>
                            <FontAwesomeIcon className={cx('iconLeft')} icon={faChevronLeft}></FontAwesomeIcon>
                        </a>
                        <ul className={cx('submenu')}>
                            <li>
                                <a href={routesConfig.advanceCreate}>Tạo Yêu Cầu</a>
                            </li>
                            <li>
                                <a href={routesConfig.advances}>Danh Sách</a>
                            </li>
                            <li>
                                <a href={routesConfig.advanceApprovals}>Duyệt Yêu Cầu</a>
                            </li>
                        </ul>
                    </li>
                    <li className={cx('drop-menu')} data-href={routesConfig.salary}>
                        <a className={cx('link-active')}>
                            <div className={cx('nav-link')}>
                                <i className="fas fa-dollar-sign"></i>&nbsp;&nbsp;<p>Quản Lý Lương</p>
                            </div>
                            <FontAwesomeIcon className={cx('iconLeft')} icon={faChevronLeft}></FontAwesomeIcon>
                        </a>
                        <ul className={cx('submenu')}>
                            <li>
                                <a href={routesConfig.salary}>Lương Cố Định</a>
                            </li>
                            <li>
                                <a href={routesConfig.salaryDynamic}>Lương Theo Tháng</a>
                            </li>
                            <li>
                                <a href={routesConfig.salaryTable}>Bảng Lương</a>
                            </li>
                            <li>
                                <a href={routesConfig.salaryCategories}>Danh Mục Lương</a>
                            </li>
                            <li>
                                <a href={routesConfig.salaryFormulas}>Công Thức Tính Lương</a>
                            </li>
                        </ul>
                    </li>
                    <li className={cx('drop-menu')} data-href={routesConfig.holidays}>
                        <a className={cx('link-active')}>
                            <div className={cx('nav-link')}>
                                <i className="fas fa-umbrella-beach"></i>&nbsp;&nbsp;
                                <p>Quản Lý Ngày Nghỉ</p>
                            </div>
                            <FontAwesomeIcon className={cx('iconLeft')} icon={faChevronLeft}></FontAwesomeIcon>
                        </a>
                        <ul className={cx('submenu')}>
                            <li>
                                <a href={routesConfig.holidays}>Lịch Nghỉ Lễ</a>
                            </li>
                            <li>
                                <a href={routesConfig.holidayDayOff}>Danh Mục Ngày Nghỉ</a>
                            </li>
                        </ul>
                    </li>
                    <li className={cx('drop-menu')} data-href={routesConfig.offices}>
                        <a className={cx('link-active')}>
                            <div className={cx('nav-link')}>
                                <i className="fas fa-cogs"></i>&nbsp;&nbsp;<p>Thiết Lập Chung</p>
                            </div>
                            <FontAwesomeIcon className={cx('iconLeft')} icon={faChevronLeft}></FontAwesomeIcon>
                        </a>
                        <ul className={cx('submenu')}>
                            <li>
                                <a href={routesConfig.offices}>Thông Tin Văn Phòng </a>
                            </li>
                            <li>
                                <a href={routesConfig.officeStructures}>Cấu Trúc Công Ty</a>
                            </li>
                            <li>
                                <a href={routesConfig.officeSetup}>Cài Đặt</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Header;
