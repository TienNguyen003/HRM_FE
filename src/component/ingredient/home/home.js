import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';

import routesConfig from '../../../config/routes';
import styles from './home.module.scss';
import '../../globalstyle/LibaralyLayout/grid.css';
import Status from '../../globalstyle/Status/status';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { getDayOffCate, getTotalTimeHoliday } from '../ingredient';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Home() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [dayOff, setDayOff] = useState([]);
    const [totalTime, setTime] = useState(0);
    const [leave, setLeave] = useState([]);
    const [dateCalendar, setDateCalendar] = useState([]);
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const getLeave = async (employeeId) => {
        try {
            const response = await fetch(`${BASE_URL}day_off_letter?pageNumber=1&employeeId=${employeeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) setLeave(data.result);
        } catch (error) {
            console.log(error);
        }
    };

    const getShift = async () => {
        try {
            const response = await fetch(`${BASE_URL}shift?pageNumber=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) caculateDate(data.result);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async () => {
            const formattedDate = `${year}-${month}`;
            await getDayOffCate(state.user).then((result) => setDayOff(result));
            await getTotalTimeHoliday(state.user, formattedDate).then((result) => setTime(result || 0));
            await getLeave(checkRole(state.account.role.name, 'NHÂN VIÊN') ? state.account.employee.id : '');
            await getShift();
        })();
    }, [state.isAuthenticated, state.loading]);

    const caculateDate = async (workHours) => {
        const daysOfWeek = {
            'Thứ Hai': 1,
            'Thứ Ba': 2,
            'Thứ Tư': 3,
            'Thứ Năm': 4,
            'Thứ Sáu': 5,
            'Thứ Bảy': 6,
            'Chủ Nhật': 0,
        };

        const today = new Date();

        const result = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - today.getDay() + i);

            const workingDay = Object.keys(daysOfWeek).find((day) => daysOfWeek[day] === i);
            const hours = workHours.filter(({ workingDay: wd }) => wd === workingDay);

            hours.forEach(({ id, start, end }) => {
                const [HHStart, mmStart] = start.split(':');
                const [HHEnd, mmEnd] = end.split(':');

                const startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(HHStart, 10), parseInt(mmStart, 10));

                const endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(HHEnd, 10), parseInt(mmEnd, 10));

                if (endTime <= startTime) {
                    endTime.setDate(endTime.getDate() + 1);
                }

                result.push({
                    Id: id,
                    Subject: 'Thời gian làm việc',
                    StartTime: startTime,
                    EndTime: endTime,
                });
            });
        }

        setDateCalendar(result);
    };

    return (
        <>
            <div className={cx('content-wrapper', 'grid')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <div className={cx('row', 'dashboard', 'no-gutters')}>
                            <div className={cx('pc-9', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <h3 className={cx('card-title')}> {t('common.Leave Request List')}</h3>
                                    </div>

                                    <div className={cx('card-body', 'pc-12')}>
                                        <div className={cx('table-responsive', 'text-center')}>
                                            <table className={cx('table', 'pc-12')}>
                                                <tbody>
                                                    <tr>
                                                        <th></th>
                                                        <th>{t('common.Name')}</th>
                                                        <th>{t('common.Leave Type')}</th>
                                                        <th>{t('common.Time')} {t('common.Start')}</th>
                                                        <th>{t('common.Time')} {t('common.End')}</th>
                                                        <th>{t('common.Status')}</th>
                                                    </tr>
                                                    {leave.slice(-1).map((item) => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <a href={routes.leave.replace(':name', item.id)}>#1</a>
                                                            </td>
                                                            <td className={cx('text-center')}>{item.employee.name}</td>
                                                            <td className={cx('text-center')}>{item.dayOffCategories.nameDay}</td>
                                                            <td className={cx('text-center')}>{item.startTime}</td>
                                                            <td className={cx('text-center')}>{item.endTime}</td>
                                                            <td className={cx('text-center')}>
                                                                <Status status={item.status} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className={cx('clearfix')}>
                                            <a href={routesConfig.leaveApprovals} className={cx('float-right')}>
                                                {t('common.View all')}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('pc-3', 'm-12', 't-12')}>
                                <div className={cx('card', 'info-box', 'day-off-item')}>
                                    <span className={cx('info-box-icon', 'bg-danger')}>
                                        <i className="far fa-calendar-alt"></i>
                                    </span>
                                    <div className={cx('info-box-content')}>
                                        <h5>
                                            <a href={routesConfig.leaveHs} className={cx('info-box-number', 'name-category')}>
                                                {t('common.Leave')}
                                            </a>
                                        </h5>
                                        <span className={cx('info-box-text')}>
                                            {t('common.Used')}: {state.account && state.account.employee.hourOff} {t('common.Hours')}
                                        </span>
                                        <span className={cx('info-box-text')}>
                                            {t('common.Remaining')}: {state.account && state.account.employee.vacationHours} {t('common.Hours')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-3', 'm-12', 't-12')}>
                                <div className={cx('sticky-top', 'pc-12', 't-12')}>
                                    <div className={cx('card')}>
                                        <div className={cx('card-header')}>
                                            <h4 className={cx('card-title', 'text-center')}>
                                                {t('common.Hourly Information', {time: month + ' - ' + year})}
                                            </h4>
                                        </div>
                                        <div>
                                            <table className={cx('table')}>
                                                <tbody>
                                                    <tr>
                                                        <td>{t('common.Hours')} {t('common.Need')} {t('common.Work')}</td>
                                                        <td className={cx('text-right')}>{state.account && state.account.employee.vacationTime.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{t('common.Hours')} {t('common.Need')} {t('common.Check in')}</td>
                                                        <td className={cx('text-right')}>{state.account && state.account.employee.timekeeping}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{t('common.Hours')} {t('common.Holiday')}</td>
                                                        <td className={cx('text-right')}>{totalTime}</td>
                                                    </tr>
                                                    {dayOff.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.nameDay}</td>
                                                            <td className={cx('text-right')}>{item.timeDay}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td>{t('common.Number of Times')} {t('common.Late')}</td>
                                                        <td className={cx('text-right')}>{state.account && state.account.employee.lateness}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{t('common.Number of Times')} {t('common.Forgot')} {t('common.Check in')}</td>
                                                        <td className={cx('text-right')}>0</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className={cx('card')}>
                                        <div className={cx('card-body', 'note')}>
                                            <div className={cx('alert', 'text-center', 'note-item', 'bg-green')}>{t('common.Check in')} ({t('common.In')})</div>
                                            <div className={cx('alert', 'text-center', 'note-item', 'bg-yellow')}>{t('common.Check in')} ({t('common.Out')})</div>
                                            <div className={cx('alert', 'text-center', 'note-item', 'bg-blue')}>{t('common.Holiday')}</div>
                                            <div
                                                className={cx('text-center', 'note-item')}
                                                style={{ display: 'flex', justifyContent: 'space-between', padding: '0' }}
                                            >
                                                <p
                                                    style={{ flex: '0 0 50%', height: '100%', padding: '0.48rem 1.25rem', borderRadius: '0.25rem 0 0 0.25rem' }}
                                                    className={cx('bg-grey')}
                                                >
                                                    {t('common.Leave')}
                                                </p>
                                                <p
                                                    style={{
                                                        flex: '0 0 50%',
                                                        height: '100%',
                                                        padding: '0.48rem 1.25rem',
                                                        borderRadius: '0 0.25rem 0.25rem 0',
                                                        backgroundColor: '#88C273',
                                                    }}
                                                >
                                                    {t('common.Approval')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('pc-9', 'm-12', 't-12')}>
                                <ScheduleComponent width="100%" height="610px" eventSettings={{ dataSource: dateCalendar }}>
                                    <ViewsDirective>
                                        <ViewDirective option="Day" readonly={true} timeScale={{ interval: 60, slotCount: 1 }} />
                                        <ViewDirective option="Week" readonly={true} />
                                        <ViewDirective option="Month" readonly={true} />
                                    </ViewsDirective>
                                    <Inject services={[Day, Week, Month]} />
                                </ScheduleComponent>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Home;
