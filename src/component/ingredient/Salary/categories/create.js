import React from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { handleAlert } from '../../ingredient';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

export default function Create() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const path = window.location.pathname.replace('/salary/categories/edit/', '');

    const getSalaCate = async () => {
        if (path.includes('/salary/categories/create')) return;
        try {
            const response = await fetch(`${BASE_URL}salary_categories/wages?wageCateId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                document.querySelector('#name').value = data.result.name;
                document.querySelector('#symbol').value = data.result.symbol;
                document.querySelector('#type').querySelector('option[value="' + data.result.salaryType + '"]').selected = true;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'CATG_ADD', true);
            await getSalaCate();
        })();
    }, [state.isAuthenticated, state.loading]);

    const handleSaveCate = async (name, symbol, salaryType, method = 'POST') => {
        let url = `${BASE_URL}salary_categories`;
        if (method == 'PUT') url += `?wageCateId=${path}`;
        try {
            const response = await fetch(`${url}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({ name, symbol, salaryType }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thành công');
                setTimeout(() => {
                    if (method === 'POST') {
                        document.querySelector('#formReset').reset();
                    }
                    clickClose();
                }, 3000);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const saveCateSalary = () => {
        const name = document.querySelector('#name').value;
        const symbol = document.querySelector('#symbol').value;
        const type = document.querySelector('#type').value;

        if (name === '') handleAlert('alert-danger', 'Tên không được để trống.');
        else if (symbol === '') handleAlert('alert-danger', 'Ký hiệu không được để trống.');
        else {
            if (path.includes('/salary/categories/create')) handleSaveCate(name, symbol, type);
            else handleSaveCate(name, symbol, type, 'PUT');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    return (
        <>
            <div>
                <div className={cx('content-wrapper')}>
                    <section className={cx('content')}>
                        <div className={cx('container-fluid')}>
                            <section className={cx('content-header')}>
                                <h1>
                                    {t('common.Fixed Salary')}
                                    <small>{path.includes('/salary/categories/create') ? `${t('common.button.create')}` : `${t('common.Edit')}`}</small>
                                </h1>
                            </section>
                            <div className={cx('row', 'no-gutters')}>
                                <div className={cx('pc-12', 'm-12', 't-12')}>
                                    <div className={cx('card')}>
                                        <div className={cx('card-header')}>
                                            <p className={cx('card-title')}>
                                            {t('common.Required field')}
                                            </p>
                                        </div>

                                        <form onSubmit={(e) => handleSubmit(e)} id="formReset">
                                            <div className={cx('card-body')}>
                                                <div className={cx('row', 'no-gutters', 'form-group')}>
                                                    <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.name')} {t('common.Salary Type')}<span className={cx('text-red')}> *</span>
                                                    </label>
                                                    <div className={cx('pc-8', 'm-8', 't-8')}>
                                                        <input className={cx('form-control')} type="text" id="name" placeholder={t('common.Fixed Salary')}/>
                                                    </div>
                                                </div>
                                                <div className={cx('row', 'no-gutters', 'form-group')}>
                                                    <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Symbol')}<span className={cx('text-red')}> *</span>
                                                    </label>
                                                    <div className={cx('pc-8', 'm-8', 't-8')}>
                                                        <input className={cx('form-control')} type="text" id="symbol" placeholder='ABCD'/>
                                                    </div>
                                                </div>
                                                <div className={cx('row', 'no-gutters', 'form-group')}>
                                                    <label className={cx('pc-2', 'm-3', 't-4')}>{t('common.Salary Type')}</label>
                                                    <div className={cx('pc-8', 'm-8', 't-8')}>
                                                        <select id="type" className={cx('form-control', 'select')}>
                                                            <option value="Lương cố định">{t('common.Fixed Salary')}</option>
                                                            <option value="Lương theo tháng">{t('common.Monthly Salary')}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className={cx('alert')}>
                                                    <ul className={cx('pc-11', 't-11', 'm-11')}>
                                                        <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                    </ul>
                                                    <button type="button" className={cx('close', 'pc-1')} onClick={clickClose}>
                                                        ×
                                                    </button>
                                                </div>
                                                <div className={cx('text-center')}>
                                                    <button type="submit" className={cx('btn', 'btn-success')} onClick={saveCateSalary}>
                                                    {t('common.button.save')}
                                                    </button>
                                                    <button type="reset" className={cx('btn', 'btn-danger')}>
                                                    {t('common.button.confluent')}
                                                    </button>
                                                    <a href={routes.salaryCategories}>
                                                        <button type="button" className={cx('btn', 'btn-default')}>
                                                        {t('common.button.exit')}
                                                        </button>
                                                    </a>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
