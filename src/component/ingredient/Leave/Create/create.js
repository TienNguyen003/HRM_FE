import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { getDayOffCate, getAllUser, handleAlert, getUser } from '../../ingredient';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

export default function Create() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [isStatus, setIsStatus] = useState(0);
    const [user, setUser] = useState([]);
    const [dayOff, setDayOff] = useState([]);
    const path = window.location.pathname.replace('/day_off_letters/edit/', '');

    const getLeave = async () => {
        if (path.includes('/day_off_letters/create')) return;
        try {
            const response = await fetch(`${BASE_URL}day_off_letter/leave?leaveId=${path}`, {
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
                const dataRs = data.result;
                setIsStatus(dataRs.status);

                document.querySelector('#user_id').querySelector('option[value="' + dataRs.employee.id + '"]').selected = true;
                document.querySelector('#day_off_category_id').querySelector('option[value="' + dataRs.dayOffCategories.id + '"]').selected = true;
                document.querySelector('#start').value = dataRs.startTime.split(' ')[0];
                document.querySelector('#time_start').value = dataRs.startTime.split(' ')[1];
                document.querySelector('#end').value = dataRs.endTime.split(' ')[0];
                document.querySelector('#time_end').value = dataRs.endTime.split(' ')[1];
                document.querySelector(`.${cx('message')}`).value = dataRs.reason;
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'REQ_ADD', true);
            await getDayOffCate(state.user).then((result) => setDayOff(result));
            if (checkRole(state.account.role.name, 'NHÂN VIÊN')) getUser(state.user, state.account.id).then((result) => setUser([result]));
            else await getAllUser(state.user).then((result) => setUser(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getLeave();
        })();
    }, [state.isAuthenticated, state.loading]);

    const saveLeave = async (dayOff, startTime, endTime, totalTime, approved, reason, employeeId, method) => {
        let url = `${BASE_URL}day_off_letter`;
        if (method === 'PUT') url += `?leaveId=${path}`;

        try {
            const response = await fetch(`${url}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({
                    dayOff,
                    startTime,
                    endTime,
                    totalTime,
                    approved,
                    reason,
                    employeeId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thêm thành công');
                setTimeout(() => {
                    if (method === 'POST') {
                        document.querySelector('#formReset').reset();
                    }
                    clickClose();
                }, 3000);
            } else handleAlert('alert-danger', 'Thêm thất bại');
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    const handleCheck = () => {
        const user = document.querySelector('#user_id');
        const day_off = document.querySelector('#day_off_category_id').value;
        const selectedOption = user.options[user.selectedIndex];
        const selectedVacationHours = selectedOption.getAttribute('data-vacationhours');
        const start = document.querySelector('#start');
        const end = document.querySelector('#end');
        const timeStart = document.querySelector('#time_start');
        const timeEnd = document.querySelector('#time_end');
        const message = document.querySelector(`.${cx('message')}`).value;

        const startDay = new Date(start.value + ' ' + (timeStart.value + ':00'));
        const endDay = new Date(end.value + ' ' + (timeEnd.value + ':00'));
        const total = (endDay - startDay) / (1000 * 3600);

        if (start.value === '') handleAlert('alert-danger', 'Ngày bắt đầu không được để trống');
        else if (end.value === '') handleAlert('alert-danger', 'Ngày kết thúc không được để trống');
        else if (end.value < start.value) handleAlert('alert-danger', 'Ngày kết thúc phải lớn hơn ngày bắt đầu');
        else if (timeStart.value === '') handleAlert('alert-danger', 'Thời gian bắt đầu không được để trống');
        else if (timeEnd.value === '') handleAlert('alert-danger', 'Thời gian kết thúc không được để trống');
        else if (end.value == start.value && timeEnd.value <= timeStart.value) handleAlert('alert-danger', 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu');
        else if (total > +selectedVacationHours)
            handleAlert('alert-danger', 'Bạn đã hết thời gian nghỉ phép. Bạn còn ' + selectedVacationHours + 'h nghỉ phép');
        else {
            if (path.includes('/day_off_letters/create'))
                saveLeave(day_off, start.value + ' ' + timeStart.value, end.value + ' ' + timeEnd.value, Math.floor(total), '', message, user.value, 'POST');
            else saveLeave(day_off, start.value + ' ' + timeStart.value, end.value + ' ' + timeEnd.value, Math.floor(total), '', message, user.value, 'PUT');
        }
    };

    const clickAddLeave = async () => {
        handleCheck();
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    const updateLeave = () => {
        handleCheck();
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                {t('common.Application for leave')}
                                <small>{path.includes('/day_off_letters/create') ? `${t('common.button.create')}` : `${t('common.Edit')}`}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>{t('common.Required field')}</p>
                                    </div>

                                    <form onSubmit={(e) => handleSubmitForm(e)} id="formReset">
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-12', 'm-12', 't-12')}>
                                                    {isStatus !== 0 ? `Chỉ đơn chưa duyệt mới được phép chỉnh sửa` : ''}
                                                </label>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Name')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="user_id" className={cx('form-control', 'select')}>
                                                        {user.map((item) => (
                                                            <option data-vacationhours={item.employee.vacationHours} key={item.id} value={item.employee.id}>
                                                                {item.employee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Leave Type')}
                                                    <span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="day_off_category_id" className={cx('form-control', 'select')}>
                                                        {dayOff.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.nameDay}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Time')} {t('common.Start')}
                                                    <span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-5', 'm-5', 't-5')}>
                                                    <div className={cx('input-group')}>
                                                        <input className={cx('form-control')} type="date" id="start" min="2024-01-01" max="3000-12-31" />
                                                    </div>
                                                </div>
                                                <div className={cx('pc-3', 'm-3', 't-3')}>
                                                    <div className={cx('input-group', 'date')} id="timepicker_start">
                                                        <input className={cx('form-control')} type="time" id="time_start" min="2024-01-01" max="3000-12-31" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Time')} {t('common.End')}
                                                    <span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-5', 'm-5', 't-5')}>
                                                    <div className={cx('input-group')}>
                                                        <input className={cx('form-control')} type="date" id="end" min="2024-01-01" max="3000-12-31" />
                                                    </div>
                                                </div>
                                                <div className={cx('pc-3', 'm-3', 't-3')}>
                                                    <div className={cx('input-group')} id="timepicker_end">
                                                        <input className={cx('form-control')} type="time" id="time_end" min="2024-01-01" max="3000-12-31" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>{t('common.Reason')}</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <textarea className={cx('form-control', 'message')} rows="6" placeholder=""></textarea>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11', 't-11', 'm-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button type="button" className={cx('close')} onClick={clickClose}>
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                {path.includes('/day_off_letters/create') ? (
                                                    <button type="submit" className={cx('btn', 'btn-success')} onClick={clickAddLeave}>
                                                        {t('common.button.create')}
                                                    </button>
                                                ) : (
                                                    <button type="submit" className={cx('btn', 'btn-info')} disabled={isStatus !== 0} onClick={updateLeave}>
                                                        {t('common.button.save')}
                                                    </button>
                                                )}
                                                <button type="reset" className={cx('btn', 'btn-danger')}>
                                                    {t('common.button.confluent')}
                                                </button>

                                                <a href={routes.leave}>
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
        </>
    );
}
