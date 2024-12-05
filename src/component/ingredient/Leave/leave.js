import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

import styles from '../list.module.scss';
import routes from '../../../config/routes';
import Status from '../../globalstyle/Status/status';
import { BASE_URL } from '../../../config/config';
import { getDayOffCate } from '../ingredient';
import { Page } from '../../layout/pagination/pagination';
import { useAuth } from '../../../untils/AuthContext';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function Leave() {
    const { state, redirectLogin, checkRole, checkRolePermission } = useAuth();
    const { t } = useTranslation();
    const [leave, setLeave] = useState([]);
    const [dayOff, setDayOff] = useState([]);
    const [page, setPage] = useState([]);
    const location = useLocation();
    const path = window.location.pathname.replace('/day_off_letters/approvals', 'approvals');

    // danh sach don xin nghi
    const getLeave = async (employeeId) => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('page') || 1;
        const name = urlParams.get('name') || '';
        const status = urlParams.get('status') || '';
        const dayOff = urlParams.get('dayOff') || '';

        const statusSelect = document.querySelector('#status').querySelector('option[value="' + status + '"]');
        const dayOffSelect = document.querySelector('#dayOff').querySelector('option[value="' + dayOff + '"]');
        document.querySelector('#name').value = name;
        if (statusSelect) statusSelect.selected = true;
        if (dayOffSelect) dayOffSelect.selected = true;
        try {
            const response = await fetch(
                `${BASE_URL}day_off_letter?pageNumber=${searchParam}&name=${name}&dayOff=${dayOff}&status=${status}&employeeId=${employeeId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${state.user}`,
                    },
                },
            );

            const data = await response.json();
            if (data.code === 303) {
                setLeave(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'REQ_VIEW', true);
            await getDayOffCate(state.user).then((result) => setDayOff(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getLeave(checkRole(state.account.role.name, 'NHÂN VIÊN') ? state.account.employee.id : '');
        })();
    }, [state.isAuthenticated, state.loading, location]);

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                {t('common.Application for leave')} <small>{t('common.List')}</small>
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
                                                            <div className={cx('pc-3', 'post-form', 'm-5')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    name="name"
                                                                    id="name"
                                                                    placeholder={t('common.Name')}
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form', 'm-5')}>
                                                                <select className={cx('form-control', 'select')} name="dayOff" id="dayOff">
                                                                    <option value="">-- {t('common.Leave Type')} --</option>
                                                                    {dayOff.map((item) => (
                                                                        <option key={item.id} value={item.id}>
                                                                            {item.nameDay}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form', 'm-5')}>
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
                                                {checkRole(state.account.role.permissions, 'REQ_ADD') && (
                                                    <a href={routes.leaveCreate} className={cx('btn')}>
                                                        <i className={cx('fa fa-plus')}></i>
                                                        &nbsp;{t('common.button.create')}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>{t('common.Name')}</th>
                                                    <th className={cx('text-center')}>{t('common.Leave Type')}</th>
                                                    <th className={cx('text-center')}>
                                                        {t('common.Time')} {t('common.Start')}
                                                    </th>
                                                    <th className={cx('text-center')}>
                                                        {t('common.Time')} {t('common.End')}
                                                    </th>
                                                    <th className={cx('text-center', 'm-0')}>
                                                        {t('common.Total')} {t('common.Hours')}
                                                    </th>
                                                    <th className={cx('text-center', 'm-0')}>
                                                        {t('common.Approval')} {t('common.By')}
                                                    </th>
                                                    <th className={cx('text-center')}>{t('common.Status')}</th>
                                                    {checkRole(state.account.role.permissions, 'REQ_APPROVALS') && (
                                                        <th className={cx('text-center')}>{t('common.Edit')}</th>
                                                    )}
                                                </tr>
                                                {leave.map((item, index) => (
                                                    <tr key={item.id} className={cx('record-data')}>
                                                        <td className={cx('text-center')}>{(+page.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center')}>{item.dayOffCategories.nameDay}</td>
                                                        <td className={cx('text-center')}>{item.startTime}</td>
                                                        <td className={cx('text-center')}>{item.endTime}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.totalTime}h</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.approved}</td>
                                                        <td className={cx('text-center')}>
                                                            <Status status={item.status} />
                                                        </td>
                                                        {checkRolePermission(state.account.role.permissions, ['REQ_APPROVALS', 'REQ_EDIT']) && (
                                                            <td className={cx('text-center')}>
                                                                {path.includes('approvals') ? (
                                                                    checkRole(state.account.role.permissions, 'REQ_APPROVALS') && (
                                                                        <a href={routes.leaveApprovalsEdit.replace(':name', item.id)}>
                                                                            <i className={cx('fas fa-eye')}></i>
                                                                        </a>
                                                                    )
                                                                ) : (
                                                                    <a href={routes.leaveEdit.replace(':name', item.id)}>
                                                                        <i className={cx('fas fa-edit')}></i>
                                                                    </a>
                                                                )}
                                                            </td>
                                                        )}
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

export default Leave;
