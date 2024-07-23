import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import { isCheck } from '../../../globalstyle/checkToken';
import { getDayOffCate, getAllUser, handleAlert } from '../../ingredient';

const cx = classNames.bind(styles);

function Role() {
    (async function () {
        await isCheck();
    })();

    const [user, setUser] = useState([]);
    const [dayOff, setDayOff] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

    useEffect(() => {
        (async function () {
            await getAllUser(token).then((result) => setUser(result));
            await getDayOffCate(token).then((result) => setDayOff(result));
        })();
    }, []);

    const handleCheck = () => {
        const user = document.querySelector('#user_id');
        const selectedOption = user.options[user.selectedIndex];
        const selectedValue = selectedOption.value;
        const selectedVacationHours = selectedOption.getAttribute('data-vacationhours');
        const start = document.querySelector('#start');
        const end = document.querySelector('#end');
        const timeStart = document.querySelector('#time_start');
        const timeEnd = document.querySelector('#time_end');

        if (start.value === '') handleAlert('alert-danger', 'Ngày bắt đầu không được để trống');
        else if (end.value === '') handleAlert('alert-danger', 'Ngày kết thúc không được để trống');
        else if (end.value < start.value) handleAlert('alert-danger', 'Ngày kết thúc không nhỏ hơn ngày bắt đầu');
        else if (timeStart.value === '') handleAlert('alert-danger', 'Thời gian bắt đầu không được để trống');
        else if (timeEnd.value === '') handleAlert('alert-danger', 'Thời gian kết thúc không được để trống');
        else if (end.value == start.value) {
            if (timeEnd.value <= timeStart.value)
                handleAlert('alert-danger', 'Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu');
        } else return true;
        return false;
    };

    const clickAddLeave = async () => {
        console.log(handleCheck);
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
                                Đơn xin nghỉ <small>Thêm mới</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>
                                            Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt
                                            buộc
                                        </p>
                                    </div>

                                    <form onSubmit={(e) => handleSubmitForm(e)}>
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Họ tên<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <select id="user_id" className={cx('form-control', 'select')}>
                                                        {user.map((item) => (
                                                            <option
                                                                data-vacationhours={item.employee.vacationHours}
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.employee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Loại nghỉ<span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <select
                                                        id="day_off_category_id"
                                                        className={cx('form-control', 'select')}
                                                    >
                                                        {dayOff.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.nameDay}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Thời gian bắt đầu<span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-5')}>
                                                    <div className={cx('input-group')}>
                                                        <input
                                                            className={cx('form-control')}
                                                            type="date"
                                                            id="start"
                                                            min="2024-01-01"
                                                            max="3000-12-31"
                                                        />
                                                    </div>
                                                </div>
                                                <div className={cx('pc-3')}>
                                                    <div className={cx('input-group', 'date')} id="timepicker_start">
                                                        <input
                                                            className={cx('form-control')}
                                                            type="time"
                                                            id="time_start"
                                                            min="2024-01-01"
                                                            max="3000-12-31"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Thời gian kết thúc<span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-5')}>
                                                    <div className={cx('input-group')}>
                                                        <input
                                                            className={cx('form-control')}
                                                            type="date"
                                                            id="end"
                                                            min="2024-01-01"
                                                            max="3000-12-31"
                                                        />
                                                    </div>
                                                </div>
                                                <div className={cx('pc-3')}>
                                                    <div className={cx('input-group')} id="timepicker_end">
                                                        <input
                                                            className={cx('form-control')}
                                                            type="time"
                                                            id="time_end"
                                                            min="2024-01-01"
                                                            max="3000-12-31"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>Lý do</label>
                                                <div className={cx('pc-8')}>
                                                    <textarea
                                                        className={cx('form-control', 'message')}
                                                        rows="6"
                                                        placeholder=""
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button type="button" className={cx('close')}>
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                <button
                                                    type="submit"
                                                    className={cx('btn', 'btn-success')}
                                                    onClick={clickAddLeave}
                                                >
                                                    Thêm mới
                                                </button>
                                                &nbsp;
                                                <button type="reset" className={cx('btn', 'btn-default')}>
                                                    Nhập lại
                                                </button>
                                                &nbsp;
                                                <button type="button" className={cx('btn', 'btn-danger')}>
                                                    Thoát
                                                </button>
                                                &nbsp;
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

export default Role;
