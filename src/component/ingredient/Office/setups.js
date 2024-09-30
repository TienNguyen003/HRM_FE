import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../create.module.scss';
import { BASE_URL } from '../../../config/config';
import { isCheck } from '../../globalstyle/checkToken';

const cx = classNames.bind(styles);

function Setups() {
    (async function () {
        await isCheck();
    })();

    const [dateCalendar, setDateCalendar] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

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
            if (data.code === 303) setDateCalendar(data.result);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        (async () => {
            await getShift();
        })();
    }, []);

    const addCalendar = (e) => {
        const divParent = e.currentTarget.parentElement;

        const ipTime = divParent.querySelectorAll(`.${cx('ipTime')}`);
        if (ipTime.length > 3) {
            alert('Lịch tối đa 4 khung giờ trong 1 ngày');
            return '';
        }

        const newElement = document.createElement('div');
        newElement.className = cx('form-group', 'row', 'no-gutters', 'ipTime');
        newElement.innerHTML = `
                    <div class="${cx('pc-4', 'post-form')}">
                        <div class="${cx('input-group')}">
                            <input
                                type="time"
                                class="${cx('form-control')}"
                                name="time_start_1[]"
                            />
                        </div>
                    </div>
                    <div class="${cx('pc-4', 'post-form')}">
                        <div class="${cx('input-group')}">
                            <input
                                type="time"
                                class="${cx('form-control')}"
                                name="time_end_1[]"
                            />
                        </div>
                    </div>
                    <div class="${cx('pc-2')}">
                        <button
                            type="button"
                            class="${cx('btn', 'btn-danger')}"
                            style="background-color: rgb(220, 53, 69);"
                            id="delete-button"
                        >
                            <i class="${cx('fa', 'fa-trash-alt')}"></i>
                        </button>
                    </div>
                `;

        // Chèn thẻ mới vào trước thẻ button
        divParent.insertBefore(newElement, e.currentTarget);

        divParent.addEventListener('click', (event) => {
            if (event.target.closest('#delete-button')) {
                deleteAddCalendar(event.target.closest('#delete-button'));
            }
        });
    };

    const deleteCalendar = (e) => {
        const item = e.currentTarget.parentElement.parentElement;
        item.remove();
    };

    const deleteAddCalendar = (e) => {
        const item = e.parentElement.parentElement;
        item.remove();
    };

    const groupedByDay = dateCalendar.reduce((acc, item) => {
        const day = item.workingDay;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(item);
        return acc;
    }, {});

    console.clear();

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>Cài đặt</h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                <div className={cx('card')} style={{ borderTop: '3px solid #17a2b8' }}>
                                    <div className={cx('card-header')}>
                                        <h3 className={cx('card-title')}>Thời gian làm việc</h3>
                                    </div>
                                    <div className={cx('card-body')}>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2')}></label>
                                            <div className={cx('pc-10')}>
                                                <div className={cx('form-group', 'row', 'no-gutters')}>
                                                    <div className={cx('pc-4')}>
                                                        <label className={cx('pc-12', 'text-center')}>Thời gian bắt đầu</label>
                                                    </div>
                                                    <div className={cx('pc-4')}>
                                                        <label className={cx('pc-12', 'text-center')}>Thời gian kết thúc</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            {Object.entries(groupedByDay).map(([day, items]) => (
                                                <>
                                                    <label className={cx('pc-2')}>{day}:</label>
                                                    <div className={cx('pc-10')}>
                                                        {items.map((item) => (
                                                            <div className={cx('form-group', 'row', 'no-gutters', 'ipTime')} key={item.id}>
                                                                <div className={cx('pc-4', 'post-form')}>
                                                                    <div className={cx('input-group')}>
                                                                        <input
                                                                            type="time"
                                                                            className={cx('form-control')}
                                                                            name="time_start_1[]"
                                                                            defaultValue={item.start}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className={cx('pc-4', 'post-form')}>
                                                                    <div className={cx('input-group')}>
                                                                        <input
                                                                            type="time"
                                                                            className={cx('form-control')}
                                                                            name="time_end_1[]"
                                                                            defaultValue={item.end}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className={cx('pc-2')}>
                                                                    <button
                                                                        style={{ backgroundColor: 'rgb(220, 53, 69)' }}
                                                                        type="button"
                                                                        className={cx('btn', 'btn-danger')}
                                                                        id="delete-button"
                                                                        onClick={(e) => deleteCalendar(e)}
                                                                    >
                                                                        <i className={cx('fa', 'fa-trash-alt')}></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            className={cx('btn', 'btn-success')}
                                                            style={{ margin: '0 0 10px' }}
                                                            onClick={(e) => addCalendar(e)}
                                                        >
                                                            <i className={cx('fas fa-plus')}></i>
                                                        </button>
                                                    </div>
                                                </>
                                            ))}
                                        </div>
                                        <div className={cx('text-center')}>
                                            <button type="submit" className={cx('btn', 'btn-success')}>
                                                Cập nhật
                                            </button>
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

export default Setups;
