import classNames from 'classnames/bind';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import routesConfig from '../../../config/routes';
import styles from './header.module.scss';
import routes from '../../../config/routes';
import { Menu } from '../menu/menu';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Header({ onClick }) {
    const { state, logout } = useAuth();
    const { t } = useTranslation();

    const menuList = [
        {
            permission: ['PERM_ADD', 'PERM_VIEW'],
            dataHref: routesConfig.role,
            icon: 'fa fa-registered',
            nameMenu: `${t('common.Decentralization')}`,
            listSubMenu: [
                { title: `${t('common.List')}`, href: routesConfig.role, role: 'PERM_ADD' },
                { title: `${t('common.button.create')}`, href: routesConfig.roleCreate, role: 'PERM_VIEW' },
            ],
        },
        {
            permission: ['USER_ADD', 'USER_VIEW', 'BANK_VIEW', 'CONT_VIEW'],
            dataHref: routesConfig.user,
            icon: 'fa fa-users',
            nameMenu: `${t('common.Employees')}`,
            listSubMenu: [
                { title: `${t('common.button.create')}`, href: routesConfig.userCreate, role: 'USER_ADD' },
                { title: `${t('common.List')}`, href: routesConfig.user, role: 'USER_VIEW' },
                { title: `${t('common.Bank Account')}`, href: routesConfig.userBank, role: 'BANK_VIEW' },
                { title: `${t('common.Contract Info')}`, href: routesConfig.userContracts, role: 'CONT_VIEW' },
            ],
        },
        {
            permission: ['REQ_VIEW', 'REQ_APPROVALS', 'HIST_VIEW'],
            dataHref: routesConfig.leave,
            icon: 'fa fa-envelope-open-text',
            nameMenu: `${t('common.Application for leave')}`,
            listSubMenu: [
                { title: `${t('common.List')}`, href: routesConfig.leave, role: 'REQ_VIEW' },
                { title: `${t('common.Approval')} ${t('common.Application for leave')}`, href: routesConfig.leaveApprovals, role: 'REQ_APPROVALS' },
                { title: `${t('common.History')} ${t('common.Leave')}`, href: routesConfig.leaveHs, role: 'HIST_VIEW' },
            ],
        },
        {
            permission: ['ATTD_ADD', 'ATTD_VIEW'],
            dataHref: routesConfig.checks,
            icon: 'fa fa-calendar-check',
            nameMenu: `${t('common.Check in')}`,
            listSubMenu: [
                { title: `${t('common.button.create')}`, href: routesConfig.checkCreate, role: 'ATTD_ADD' },
                { title: `${t('common.List')}`, href: routesConfig.checks, role: 'ATTD_VIEW' },
                { title: `${t('common.Time Table')}`, href: routesConfig.checkCalendar },
            ],
        },
        {
            permission: ['ADV_ADD', 'ADV_VIEW', 'ADV_APPROVALS'],
            dataHref: routesConfig.advances,
            icon: 'fa fa-hand-holding-usd',
            nameMenu: `${t('common.Salary Advance')}`,
            listSubMenu: [
                { title: `${t('common.Create Request')}`, href: routesConfig.advanceCreate, role: 'ADV_ADD' },
                { title: `${t('common.List')}`, href: routesConfig.advances, role: 'ADV_VIEW' },
                { title: `${t('common.Approve Requests')}`, href: routesConfig.advanceApprovals, role: 'ADV_APPROVALS' },
            ],
        },
        {
            permission: ['SAFI_VIEW', 'SAUP_VIEW', 'SALA_VIEW', 'CATG_VIEW', 'CALC_VIEW'],
            dataHref: routesConfig.salary,
            icon: 'fa fa-dollar-sign',
            nameMenu: `${t('common.Payroll Management')}`,
            listSubMenu: [
                { title: `${t('common.Fixed Salary')}`, href: routesConfig.salary, role: 'SAFI_VIEW' },
                { title: `${t('common.Monthly Salary')}`, href: routesConfig.salaryDynamic, role: 'SAUP_VIEW' },
                { title: `${t('common.Salary Table')}`, href: routesConfig.salaryTable, role: 'SALA_VIEW' },
                { title: `${t('common.Salary Categories')}`, href: routesConfig.salaryCategories, role: 'CATG_VIEW' },
                { title: `${t('common.Salary Formulas')}`, href: routesConfig.salaryFormulas, role: 'CALC_VIEW' },
            ],
        },
        {
            permission: ['HOLI_VIEW', 'LEAV_VIEW'],
            dataHref: routesConfig.holidays,
            icon: 'fa fa-umbrella-beach',
            nameMenu: `${t('common.Manage holidays')}`,
            listSubMenu: [
                { title: `${t('common.Holiday Calendar')}`, href: routesConfig.holidays, role: 'HOLI_VIEW' },
                { title: `${t('common.Holiday Categories')}`, href: routesConfig.holidayDayOff, role: 'LEAV_VIEW' },
            ],
        },
        {
            permission: ['COMP_VIEW', 'OFF_VIEW'],
            dataHref: routesConfig.offices,
            icon: 'fa fa-cogs',
            nameMenu: `${t('common.Settings')}`,
            listSubMenu: [
                { title: `${t('common.Office Info')}`, href: routesConfig.offices, role: 'COMP_VIEW' },
                { title: `${t('common.Company Structure')}`, href: routesConfig.officeStructures, role: 'OFF_VIEW' },
                { title: `${t('common.Settings')}`, href: routesConfig.officeSetup },
            ],
        },
        {
            permission: '',
            dataHref: routesConfig.checkcv,
            icon: 'fa fa-file',
            nameMenu: `${t('common.Filter CV')}`,
            listSubMenu: [
                { title: `${t('common.List')}`, href: routesConfig.listcv, role: '' },
                { title: `${t('common.Filter CV')}`, href: routesConfig.checkcv, role: '' },
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

    const clickLanguage = (e) => {
        const language = document.querySelector(`.${cx('language')}`);
        language.classList.toggle(`${cx('show')}`);
        const dropDown = language.querySelectorAll(`.${cx('dropdown-item')}`);
        dropDown.forEach(
            (item) =>
                (item.onclick = () => {
                    e.target.src = item.getAttribute('data-src');
                    i18next.changeLanguage(item.getAttribute('data-language'));
                    localStorage.setItem('language', item.getAttribute('data-language'));
                }),
        );
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

        const languageSet = localStorage.getItem('language') || 'vi';
        if (languageSet === 'en') document.querySelector('#image_language').src = 'https://globalconsent.vn/public/frontend/wetech/img/lang/en.svg?v=6.3.0';

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
                        <a className="nav-link" onClick={(e) => clickLanguage(e)}>
                            <img
                                id="image_language"
                                style={{ width: '20px' }}
                                src="https://globalconsent.vn/public/frontend/wetech/img/lang/vi.svg?v=6.3.0"
                                alt=""
                            />
                        </a>
                        <div className={cx('dropdown-menu', 'language')}>
                            <a
                                className={cx('dropdown-item')}
                                data-language="vi"
                                data-src="https://globalconsent.vn/public/frontend/wetech/img/lang/vi.svg?v=6.3.0"
                            >
                                <img style={{ width: '20px' }} src="https://globalconsent.vn/public/frontend/wetech/img/lang/vi.svg?v=6.3.0" alt="vi" /> Tiếng
                                Việt
                            </a>
                            <a
                                className={cx('dropdown-item')}
                                data-language="en"
                                data-src="https://globalconsent.vn/public/frontend/wetech/img/lang/en.svg?v=6.3.0"
                            >
                                <img style={{ width: '20px' }} src="https://globalconsent.vn/public/frontend/wetech/img/lang/en.svg?v=6.3.0" alt="en" /> English
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
                            <img src="https://res.cloudinary.com/dwn20guz0/image/upload/v1733380783/avatarUser/avatar.jpg" className={cx('user-image')} alt="User Image" />
                            <span className={cx('hidden-xs')}></span>
                        </a>
                        <ul className={cx('dropdown-menu', 'user')}>
                            <li className={cx('user-header')}>
                                <a>
                                    <img src="https://res.cloudinary.com/dwn20guz0/image/upload/v1733380783/avatarUser/avatar.jpg" className={cx('img-circle')} alt="User Image" />
                                </a>
                            </li>

                            <li className={cx('user-header')}>{state.account && state.account.employee.name}</li>

                            <li className={cx('user-footer')}>
                                <div className={cx('pull-bottom')}>
                                    <a href={routes.userEdit.replace(':name', state.account && state.account.id)} className={cx('btn-success', 'btn')}>
                                    {t('common.Edit')} {t('common.info')}
                                    </a>
                                </div>
                                <div className={cx('pull-bottom')}>
                                    <a href={routes.userChangePass} className={cx('btn-warning', 'btn')}>
                                    {t('common.Change')} {t('common.password')}
                                    </a>
                                </div>
                                <div className={cx('pull-bottom')} onClick={logout}>
                                    <a href="#" className={cx('btn-danger', 'btn')}>
                                    {t('common.button.logout')}
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
