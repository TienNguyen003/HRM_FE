import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import styles from '../header/header.module.scss';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

export function Menu({ permission, dataHref, icon, nameMenu, listSubMenu }) {
    const { state, checkRole, checkRolePermission } = useAuth();

    return (
        <>
            {state.user && checkRolePermission(state.account.role.permissions, permission) && (
                <li className={cx('drop-menu')} data-href={dataHref}>
                    <a className={cx('link-active')} href={!listSubMenu ? dataHref : undefined}>
                        <div className={cx('nav-link')}>
                            <i className={icon}></i>&nbsp;&nbsp;<p>{nameMenu}</p>
                        </div>
                        {listSubMenu && <FontAwesomeIcon className={cx('iconLeft')} icon={faChevronLeft}></FontAwesomeIcon>}
                    </a>
                    <ul className={cx('submenu')}>
                        {listSubMenu &&
                            listSubMenu.map((item, index) => (
                                <li key={index}>
                                    {(!item.role || checkRole(state.account.role.permissions, item.role, false)) && <a href={item.href}>{item.title}</a>}
                                </li>
                            ))}
                    </ul>
                </li>
            )}
        </>
    );
}  