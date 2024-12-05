import React from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../list.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { Page } from '../../layout/pagination/pagination';
import { Status } from '../../layout/status/status';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Holidays() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [holiday, setHoliday] = useState([]);
    const [page, setPage] = useState([]);
    const location = useLocation();

    const getHoliday = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 1;
        const name = urlParams.get('name') || '';
        const status = urlParams.get('status') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#status').querySelector('option[value="' + status + '"]').selected = true;

        try {
            const response = await fetch(`${BASE_URL}day_off_categories/search?pageNumber=${page}&nameDay=${name}&status=${status}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                setHoliday(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!state.isAuthenticated) redirectLogin();

        (async function () {
            await checkRole(state.account && state.account.role.permissions, 'LEAV_VIEW', true);
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getHoliday();
        })();
    }, [state.isAuthenticated, state.loading, location]);

    const changeStatus = (e) => {
        let isCheck = e.target.checked ? 1 : 0;
        handleChangeStt(isCheck, e.target.id);
    };

    const handleChangeStt = async (status, id) => {
        try {
            const response = await fetch(`${BASE_URL}day_off_categories/stt?id=${id}&status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                {t('common.Holiday Categories')} <small>{t('common.List')}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10', 'm-12')}>
                                                <div id="search">
                                                    <form>
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    name="name"
                                                                    id="name"
                                                                    placeholder={`${t('common.name')} ${t('common.Holiday Categories')}`}
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} name="status" id="status">
                                                                    <option value="">-- {t('common.Status')} --</option>
                                                                    <option value="0">{t('common.No Active')}</option>
                                                                    <option value="1">{t('common.Active')}</option>
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-2', 'post-form')} style={{ height: '36.6px' }}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> {t('common.Search')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a href={routes.holidayDayOffCreate} className={cx('btn')}>
                                                    <i className={cx('fa fa-plus')}></i> {t('common.button.create')}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>
                                                        {t('common.name')} {t('common.Holiday Categories')}
                                                    </th>
                                                    <th className={cx('text-center')}>
                                                        {t('common.Total')} {t('common.Time')}
                                                    </th>
                                                    <th className={cx('text-center')}>
                                                        {t('common.Time')} {t('common.Update')}
                                                    </th>
                                                    <th className={cx('text-center')}>{t('common.Status')}</th>
                                                    <th className={cx('text-center')}>{t('common.Edit')}</th>
                                                </tr>
                                                {holiday.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className={cx('text-center')}>{(+page.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.nameDay}</td>
                                                        <td className={cx('text-center')}>{item.timeDay}h</td>
                                                        <td className={cx('text-center')}>
                                                            {item.timeUpdate.slice(0, 10)} {item.timeUpdate.slice(11, 16)}
                                                        </td>
                                                        <td
                                                            style={{
                                                                width: '120px',
                                                            }}
                                                        >
                                                            <Status id={item.id} isStatus={item.status} handleChange={(e) => changeStatus(e)} />
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a href={routes.holidayDayOffEdit.replace(':name', item.id)} className={cx('edit-record')}>
                                                                <i className={cx('fas fa-edit')}></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={cx('pagination', 'pc-12')}>
                                            <div className={cx('pc-7')}>
                                                <p>
                                                    {t('common.Show')} <b>{page.totalItemsPerPage}</b> / <b>{page.totalItems}</b> {t('common.Row')}
                                                </p>
                                            </div>
                                            <div className={cx('pc-5')}>
                                                <Page style={{ float: 'right' }} page={parseInt(page.currentPage)} total={parseInt(page.totalItems)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Holidays;
