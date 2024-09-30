import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';

import routesConfig from '../../../config/routes';
import styles from './home.module.scss';
import '../../globalstyle/LibaralyLayout/grid.css';
import Status from '../../globalstyle/Status/status';
import { isCheck, decodeToken } from '../../globalstyle/checkToken';
import { BASE_URL } from '../../../config/config';
import { getDayOffCate, getTotalTimeHoliday } from '../ingredient';
import routes from '../../../config/routes';

const cx = classNames.bind(styles);

function Home() {
    (async function () {
        await isCheck();
    })();

    const [dayOff, setDayOff] = useState([]);
    const [totalTime, setTime] = useState(0);
    const [leave, setLeave] = useState([]);
    const [dateCalendar, setDateCalendar] = useState([]);
    const employee = JSON.parse(localStorage.getItem('employee')) || '';
    const token = localStorage.getItem('authorizationData') || '';
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const getLeave = async (employeeId) => {
        try {
            const response = await fetch(`${BASE_URL}day_off_letter?pageNumber=1&employeeId=${employeeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) caculateDate(data.result);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        (async () => {
            const formattedDate = `${year}-${month}`;
            await getDayOffCate(token).then((result) => setDayOff(result));
            await getTotalTimeHoliday(token, formattedDate).then((result) => setTime(result || 0));
            await getLeave(decodeToken(token, 'ROLE_NHÂN') ? employee.id : '');
            await getShift();
        })();
    }, []);

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
                            <div className={cx('pc-9')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <h3 className={cx('card-title')}> Danh sách đơn</h3>
                                    </div>

                                    <div className={cx('card-body', 'pc-12')}>
                                        <div className={cx('table-responsive', 'text-center')}>
                                            <table className={cx('table', 'pc-12')}>
                                                <tbody>
                                                    <tr>
                                                        <th></th>
                                                        <th>Họ tên</th>
                                                        <th>Loại nghỉ</th>
                                                        <th>Thời gian bắt đầu</th>
                                                        <th>Thời gian kết thúc</th>
                                                        <th>Trạng thái</th>
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
                                                Xem tất cả
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('pc-3', 'm-12')}>
                                <div className={cx('card', 'info-box', 'day-off-item')}>
                                    <span className={cx('info-box-icon', 'bg-danger')}>
                                        <i className="far fa-calendar-alt"></i>
                                    </span>
                                    <div className={cx('info-box-content')}>
                                        <h5>
                                            <a href={routesConfig.leaveHs} className={cx('info-box-number', 'name-category')}>
                                                Nghỉ phép
                                            </a>
                                        </h5>
                                        <span className={cx('info-box-text')}>Đã dùng: {employee.hourOff} giờ</span>
                                        <span className={cx('info-box-text')}>Còn lại: {employee.vacationHours} giờ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-3', 'm-12')}>
                                <div className={cx('sticky-top', 'pc-12')}>
                                    <div className={cx('card')}>
                                        <div className={cx('card-header')}>
                                            <h4 className={cx('card-title', 'text-center')}>Thông tin tháng {month + ' - ' + year} (giờ)</h4>
                                        </div>
                                        <div>
                                            <table className={cx('table')}>
                                                <tbody>
                                                    <tr>
                                                        <td>Giờ cần làm việc</td>
                                                        <td className={cx('text-right')}>{employee.vacationTime}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Giờ cần chấm công</td>
                                                        <td className={cx('text-right')}>{employee.timekeeping}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Giờ nghỉ lễ</td>
                                                        <td className={cx('text-right')}>{totalTime}</td>
                                                    </tr>
                                                    {dayOff.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.nameDay}</td>
                                                            <td className={cx('text-right')}>{item.timeDay}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td>Số lần đi muộn</td>
                                                        <td className={cx('text-right')}>{employee.lateness}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Số lần quên chấm công</td>
                                                        <td className={cx('text-right')}>0</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className={cx('card')}>
                                        <div className={cx('card-body', 'note')}>
                                            <div className={cx('alert', 'text-center', 'note-item', 'bg-green')}>Chấm công (vào)</div>
                                            <div className={cx('alert', 'text-center', 'note-item', 'bg-yellow')}>Chấm công (ra)</div>
                                            <div className={cx('alert', 'text-center', 'note-item', 'bg-blue')}>Nghỉ lễ</div>
                                            <div className={cx('alert', 'text-center', 'note-item', 'bg-grey')}>Xin nghỉ</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('pc-9', 'm-12')}>
                                <ScheduleComponent width="100%" height="610px" eventSettings={{ dataSource: dateCalendar }}>
                                    <ViewsDirective>
                                        <ViewDirective option="Day" readonly={true} />
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
