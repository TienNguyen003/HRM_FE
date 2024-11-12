import classNames from 'classnames/bind';
import { useEffect } from 'react';

import routesConfig from '../../../config/routes';
import styles from './header.module.scss';
import routes from '../../../config/routes';
import { Menu } from '../menu/menu';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Header({ onClick }) {
    const { state, logout } = useAuth();

    const menuList = [
        {
            permission: ['PERM_ADD', 'PERM_VIEW'],
            dataHref: routesConfig.role,
            icon: 'fa fa-registered',
            nameMenu: 'Phân Quyền',
            listSubMenu: [
                { title: 'Danh Sách', href: routesConfig.role, role: 'PERM_ADD' },
                { title: 'Thêm Mới', href: routesConfig.roleCreate, role: 'PERM_VIEW' },
            ],
        },
        {
            permission: ['USER_ADD', 'USER_VIEW', 'BANK_VIEW', 'CONT_VIEW'],
            dataHref: routesConfig.user,
            icon: 'fa fa-users',
            nameMenu: 'Nhân Viên',
            listSubMenu: [
                { title: 'Thêm Mới', href: routesConfig.userCreate, role: 'USER_ADD' },
                { title: 'Danh Sách', href: routesConfig.user, role: 'USER_VIEW' },
                { title: 'TK Ngân Hàng', href: routesConfig.userBank, role: 'BANK_VIEW' },
                { title: 'TT Hợp Đồng', href: routesConfig.userContracts, role: 'CONT_VIEW' },
            ],
        },
        {
            permission: ['REQ_VIEW', 'REQ_APPROVALS', 'HIST_VIEW'],
            dataHref: routesConfig.leave,
            icon: 'fa fa-envelope-open-text',
            nameMenu: 'Đơn Xin Nghỉ',
            listSubMenu: [
                { title: 'Danh Sách', href: routesConfig.leave, role: 'REQ_VIEW' },
                { title: 'Duyệt Đơn Xin Nghỉ', href: routesConfig.leaveApprovals, role: 'REQ_APPROVALS' },
                { title: 'Lịch Sử Nghỉ Phép', href: routesConfig.leaveHs, role: 'HIST_VIEW' },
            ],
        },
        {
            permission: ['ATTD_ADD', 'ATTD_VIEW'],
            dataHref: routesConfig.checks,
            icon: 'fa fa-calendar-check',
            nameMenu: 'Chấm Công',
            listSubMenu: [
                { title: 'Thêm Mới', href: routesConfig.checkCreate, role: 'ATTD_ADD' },
                { title: 'Danh Sách', href: routesConfig.checks, role: 'ATTD_VIEW' },
                { title: 'Bảng Thời Gian', href: routesConfig.checkCalendar },
            ],
        },
        {
            permission: ['ADV_ADD', 'ADV_VIEW', 'ADV_APPROVALS'],
            dataHref: routesConfig.advances,
            icon: 'fa fa-hand-holding-usd',
            nameMenu: 'Ứng Lương',
            listSubMenu: [
                { title: 'Tạo Yêu Cầu', href: routesConfig.advanceCreate, role: 'ADV_ADD' },
                { title: 'Danh Sách', href: routesConfig.advances, role: 'ADV_VIEW' },
                { title: 'Duyệt Yêu Cầu', href: routesConfig.advanceApprovals, role: 'ADV_APPROVALS' },
            ],
        },
        {
            permission: ['SAFI_VIEW', 'SAUP_VIEW', 'SALA_VIEW', 'CATG_VIEW', 'CALC_VIEW'],
            dataHref: routesConfig.salary,
            icon: 'fa fa-dollar-sign',
            nameMenu: 'Quản Lý Lương',
            listSubMenu: [
                { title: 'Lương Cố Định', href: routesConfig.salary, role: 'SAFI_VIEW' },
                { title: 'Lương Theo Tháng', href: routesConfig.salaryDynamic, role: 'SAUP_VIEW' },
                { title: 'Bảng Lương', href: routesConfig.salaryTable, role: 'SALA_VIEW' },
                { title: 'Danh Mục Lương', href: routesConfig.salaryCategories, role: 'CATG_VIEW' },
                { title: 'Công Thức Tính Lương', href: routesConfig.salaryFormulas, role: 'CALC_VIEW' },
            ],
        },
        {
            permission: ['HOLI_VIEW', 'LEAV_VIEW'],
            dataHref: routesConfig.holidays,
            icon: 'fa fa-umbrella-beach',
            nameMenu: 'Quản Lý Ngày Nghỉ',
            listSubMenu: [
                { title: 'Lịch Nghỉ Lễ', href: routesConfig.holidays, role: 'HOLI_VIEW' },
                { title: 'Danh Mục Ngày Nghỉ', href: routesConfig.holidayDayOff, role: 'LEAV_VIEW' },
            ],
        },
        {
            permission: ['COMP_VIEW', 'OFF_VIEW'],
            dataHref: routesConfig.offices,
            icon: 'fa fa-cogs',
            nameMenu: 'Thiết Lập Chung',
            listSubMenu: [
                { title: 'Thông Tin Văn Phòng', href: routesConfig.offices, role: 'COMP_VIEW' },
                { title: 'Cấu Trúc Công Ty', href: routesConfig.officeStructures, role: 'OFF_VIEW' },
                { title: 'Cài Đặt', href: routesConfig.officeSetup },
            ],
        },
        {
            permission: '',
            dataHref: routesConfig.checkcv,
            icon: 'fa fa-file',
            nameMenu: 'Lọc CV ứng viên',
            listSubMenu: [
                { title: 'Danh Sách', href: routesConfig.listcv, role: '' },
                { title: 'Lọc CV', href: routesConfig.checkcv, role: '' },
            ],
        },
    ];

    const changeClass = (dropMenu) => {
        const subMenu = dropMenu.querySelector(`.${cx('submenu')}`);
        const iconLeft = dropMenu.querySelector(`.${cx('iconLeft')}`);
        const linkActive = dropMenu.querySelector(`.${cx('link-active')}`);

        if (iconLeft) iconLeft.classList.toggle(`${cx('icon-rotate')}`);
        if (linkActive) linkActive.classList.toggle(`${cx('change-bg')}`);
        if (subMenu) subMenu.classList.toggle(`${cx('showBlock')}`);
    };

    const clickLanguage = () => {
        const language = document.querySelector(`.${cx('language')}`);
        language.classList.toggle(`${cx('show')}`);
    };

    const clickUser = () => {
        const user = document.querySelector(`.${cx('user')}`);
        user.classList.toggle(`${cx('show')}`);
    };

    const clickBars = () => {
        if (window.innerWidth < 740) return;
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
            } else if (location.includes(dropMenu.getAttribute('data-href')) && dropMenu.getAttribute('data-href') != '/') {
                dropMenu.classList.add(`${cx('active')}`);
                changeClass(dropMenu);
            }

            dropMenu.addEventListener('click', (e) => {
                changeClass(dropMenu);
            });
        });

        document.querySelector(`.${cx('hidden-xs')}`).textContent = state.account && state.account.employee.name;
        if (state.account && state.account.employee.image != '')
            document.querySelector(`.${cx('img-circle')}`).src = document.querySelector(`.${cx('user-image')}`).src = state.account.employee.image;

        const menu = document.querySelector(`.${cx('jquery-accordion-menu')}`);
        const nav = document.querySelector(`.${cx('nav-wrapper')}`);
        if (window.innerWidth < 740) {
            menu.classList.add(`${cx('menu-click')}`);
            nav.classList.add(`${cx('nav-click')}`);
        }
    }, [state.user]);

    return (
        <div>
            <div className={cx('nav-wrapper')}>
                <p className={cx('nav-icon')} onClick={clickBars}>
                    <i className="fas fa-bars"></i>
                </p>

                <ul className={cx('list-group')}>
                    <li className={cx('nav-item')}>
                        <a className="nav-link" onClick={clickLanguage}>
                            <img src="" alt="" />
                        </a>
                        <div className={cx('dropdown-menu', 'language')}>
                            <a className={cx('dropdown-item')}>
                                <img src="" alt="" /> Tiếng Việt
                            </a>
                            <a className={cx('dropdown-item')}>
                                <img src="https://res.cloudinary.com/dwn20guz0/image/upload/v1726558584/avatarUser/ensign_en_z1brlr.png" alt="" /> English
                            </a>
                        </div>
                    </li>
                    <li className={cx('nav-item')}>
                        <a className={cx('nav-link')} id="notification">
                            <i className="far fa-bell"></i>
                        </a>
                    </li>

                    <li className={cx('user-menu')}>
                        <a className={cx('dropdown-toggle')} onClick={clickUser}>
                            <img src="https://demo.hrm.one/img/no-avatar.jpg" className={cx('user-image')} alt="User Image" />
                            <span className={cx('hidden-xs')}></span>
                        </a>
                        <ul className={cx('dropdown-menu', 'user')}>
                            <li className={cx('user-header')}>
                                <a>
                                    <img src="https://demo.hrm.one/img/no-avatar.jpg" className={cx('img-circle')} alt="User Image" />
                                </a>
                            </li>

                            <li className={cx('user-footer')}>
                                <div className={cx('pull-bottom')}>
                                    <a href={routes.userEdit.replace(':name', state.account && state.account.employee.id)} className={cx('btn-success', 'btn')}>
                                        Sửa hồ sơ
                                    </a>
                                </div>
                                <div className={cx('pull-bottom')}>
                                    <a href={routes.userChangePass} className={cx('btn-warning', 'btn')}>
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
                    {menuList.map((menu, index) => (
                        <Menu
                            key={index}
                            permission={menu.permission}
                            dataHref={menu.dataHref}
                            icon={menu.icon}
                            nameMenu={menu.nameMenu}
                            listSubMenu={menu.listSubMenu}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Header;
