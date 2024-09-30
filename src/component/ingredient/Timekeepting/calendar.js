import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';

import styles from '../create.module.scss';
import { BASE_URL } from '../../../config/config';
import { decodeToken } from '../../globalstyle/checkToken';
import { getAllUser, getUser } from '../ingredient';

const cx = classNames.bind(styles);

export default function Calendar() {
    const [dataField, setDataField] = useState([]);
    const [user, setUser] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Bangkok',
        timeZoneName: 'short',
    };

    const fetchData = async (employeeId) => {
        const arr = [];

        // Fetch holidays
        try {
            const holidayResponse = await fetch(`${BASE_URL}holidays?pageNumber=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const holidayData = await holidayResponse.json();
            if (holidayData.code === 303) {
                holidayData.result.map((item) => {
                    const start = new Date(item.startTime);
                    start.setHours(0, 0, 0);
                    const end = new Date(item.endTime);
                    end.setHours(23, 0, 0);
                    arr.push({
                        Id: item.id,
                        Subject: item.name,
                        StartTime: start.toLocaleString('en-US', options).replace(',', ''),
                        EndTime: end.toLocaleString('en-US', options).replace(',', ''),
                    });
                });
            }
        } catch (error) {
            console.log('Error fetching holidays:', error);
        }

        // Fetch leaves
        try {
            const leaveResponse = await fetch(`${BASE_URL}day_off_letter?pageNumber=1&employeeId=${employeeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const leaveData = await leaveResponse.json();
            if (leaveData.code === 303) {
                leaveData.result.map((item) => {
                    const start = new Date(item.startTime);
                    const end = new Date(item.endTime);
                    arr.push({
                        Id: item.id,
                        Subject: item.dayOffCategories.nameDay,
                        StartTime: start.toLocaleString('en-US', options).replace(',', ''),
                        EndTime: end.toLocaleString('en-US', options).replace(',', ''),
                    });
                });
            }
        } catch (error) {
            console.log('Error fetching leaves:', error);
        }

        // fetch checking
        try {
            const response = await fetch(`${BASE_URL}checks?pageNumber=1&id=${employeeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                data.result.map((item) => {
                    const start = new Date(`${item.date}T${item.time}`);
                    const end = new Date(start.getTime() + 60 * 1000);
                    arr.push({
                        Id: item.id,
                        Subject: 'Chấm công',
                        StartTime: start,
                        EndTime: end,
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }

        setDataField(arr);
    };

    useEffect(() => {
        (async function () {
            if (decodeToken(token, 'ROLE_NHÂN')) getUser(token).then((result) => setUser([result]));
            else await getAllUser(token).then((result) => setUser(result));
            await fetchData(1);
        })();
    }, []);

    const handleChangeEmployee = (e) => {
        fetchData(e.target.value)
    }

    return (
        <div className={cx('content-wrapper')}>
            <section className={cx('content')}>
                <div className={cx('container-fluid')}></div>
                <div className={cx('row', 'no-gutters')}>
                    <div className={cx('pc-12', 'm-12')}>
                        <div className={cx('card')}>
                            <div className={cx('card-body')}>
                                <div className={cx('form-group', 'row', 'no-gutters')}>
                                    <label className={cx('pc-2', 'm-3')}>
                                        Họ tên<span className={cx('text-red')}> *</span>
                                    </label>
                                    <div className={cx('pc-8', 'm-8')}>
                                        <select id="user_id" className={cx('form-control', 'select')} onChange={(e) => handleChangeEmployee(e)}>
                                            {user.map((item) => (
                                                <option data-vacationhours={item.employee.vacationHours} key={item.id} value={item.employee.id}>
                                                    {item.employee.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <ScheduleComponent width="100%" height="610px" eventSettings={{ dataSource: dataField }}>
                                    <ViewsDirective>
                                        <ViewDirective option="Month" readonly={true} />
                                    </ViewsDirective>
                                    <Inject services={[Month]} />
                                </ScheduleComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
