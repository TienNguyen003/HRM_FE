import React from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../list.module.scss';
import routes from '../../../config/routes';
import Status from '../../globalstyle/Status/status';
import { BASE_URL } from '../../../config/config';
import { Page } from '../../layout/pagination/pagination';
import { formatter } from '../ingredient';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

export default function Advances() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [advances, setAdvances] = useState([]);
    const [pages, setPages] = useState([]);
    const path = window.location.pathname.replace('/advances/approvals', 'approvals');
    const location = useLocation();

    //lấy don ung luong
    const fetchData = async (id) => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('page') || 1;
        const name = urlParams.get('name') || '';
        const status = urlParams.get('status') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#status').querySelector('option[value="' + status + '"]').selected = true;

        try {
            const response = await fetch(`${BASE_URL}advances?pageNumber=${searchParam}&name=${name}&status=${status}&id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            if (data.code === 303) {
                setPages(data.page);
                setAdvances(data.result);
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'ADV_VIEW', true);
            await new Promise((resolve) => setTimeout(resolve, 1));
            await fetchData(checkRole(state.account.role.name, 'NHÂN VIÊN') ? state.account.employee.id : '');
        })();
    }, [state.isAuthenticated, state.loading, location]);

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                {t('common.Salary Advance')} <small>{t('common.List')}</small>
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
                                                                    placeholder={t('common.Name')}
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} name="status" id="status">
                                                                    <option value="">-- {t('common.Status')} --</option>
                                                                    <option value="0">{t('common.Pending')}</option>
                                                                    <option value="1">{t('common.Approval')}</option>
                                                                    <option value="2">{t('common.Rejected')}</option>
                                                                    <option value="3">{t('common.Cancelled')}</option>
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-2')} style={{ height: '36.6px' }}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> {t('common.Search')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a href={routes.advanceCreate} className={cx('btn')}>
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
                                                    <th className={cx('text-center')}>{t('common.Name')}</th>
                                                    <th className={cx('text-center', 'm-0')}>
                                                        {t('common.Time')} {t('common.Request')}
                                                    </th>
                                                    <th className={cx('text-center')}>{t('common.Money')}</th>
                                                    <th className={cx('text-center')}>
                                                        {t('common.Approval')} {t('common.By')}
                                                    </th>
                                                    <th className={cx('text-center', 'm-0')}>
                                                        {t('common.Time')} {t('common.Approval')}
                                                    </th>
                                                    <th className={cx('text-center')}>{t('common.Status')}</th>
                                                    <th className={cx('text-center')}>{t('common.Edit')}</th>
                                                </tr>
                                                {advances.map((item, index) => (
                                                    <tr className={cx('record-data')} key={index}>
                                                        <td className={cx('text-center')}>{(+pages.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center', 'm-0')}>
                                                            {item.requestTime.slice(0, 10)} {item.requestTime.slice(11, 16)}
                                                        </td>
                                                        <td className={cx('text-center')}>{formatter.format(item.money)}</td>
                                                        <td className={cx('text-center')}>{item.approvedBy}</td>
                                                        <td className={cx('text-center', 'm-0')}>
                                                            {item.approvalTime !== null
                                                                ? item.approvalTime.slice(0, 10) + ' ' + item.approvalTime.slice(11, 16)
                                                                : ''}
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <Status status={item.status} />
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            {path.includes('approvals') ? (
                                                                <a href={routes.advanceApprovalsEdit.replace(':name', item.id)}>
                                                                    <i className={cx('fas fa-eye')}></i>
                                                                </a>
                                                            ) : (
                                                                <a href={routes.advanceEdit.replace(':name', item.id)}>
                                                                    <i className={cx('fas fa-edit')}></i>
                                                                </a>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={cx('pagination', 'pc-12')}>
                                            <div className={cx('pc-7')}>
                                                <p>
                                                    {t('common.Show')} <b>{pages.totalItemsPerPage}</b> / <b>{pages.totalItems}</b> {t('common.Row')}
                                                </p>
                                            </div>
                                            <div className={cx('pc-5')}>
                                                <Page style={{ float: 'right' }} page={parseInt(pages.currentPage)} total={parseInt(pages.totalItems)} />
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
