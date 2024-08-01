import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';
import Status from '../../../globalstyle/Status/status';

const cx = classNames.bind(styles);

function Leave() {
    (async function () {
        await isCheck();
    })();

    const [isStatus, setIsStatus] = useState(0);
    const [leave, setLeave] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const employeeName = JSON.parse(localStorage.getItem('employee')).name || '';
    const path = window.location.pathname.replace('/day_off_letters/approval/', '');

    // danh sach don xin nghi
    const getLeave = async () => {
        try {
            const response = await fetch(`${BASE_URL}day_off_letter/leave?leaveId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                setLeave([data.result]);
                setIsStatus(data.result.status);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async function () {
            await getLeave();
        })();
    }, []);

    // cap nhat trang thai don
    const handleUpdateStt = async (status, employeeId, time) => {
        try {
            const response = await fetch(`${BASE_URL}day_off_letter/status?leaveId=${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status,
                    nameApproval: employeeName,
                    employeeId,
                    time,
                }),
            });
        } catch (error) {
            console.log(error);
        }
    };

    // them lich su
    const saveLeaveLogs = async (status, employeeId, fluctuatesTime, remaining) => {
        const messages = {
            1: ' đã duyệt đơn xin nghỉ',
            2: ' đã từ chối đơn xin nghỉ',
            3: ' đã hủy đơn xin nghỉ',
        };

        const content = messages[status] ? employeeName + messages[status] : '';

        try {
            const response = await fetch(`${BASE_URL}sabbatical_leave_logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content,
                    fluctuatesTime,
                    employeeId,
                    remaining,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                window.confirm('Cập nhật thành công!');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateStatusLeave = () => {
        const status = document.querySelector('#status').value;
        const employeeId = document.querySelector('#employeeId').getAttribute('data-employee');
        let remaining = document.querySelector('#employeeId').getAttribute('data-remaining');
        const time = document.querySelector('#timeTotal').innerHTML.replace(' giờ', '');
        if (status != isStatus) {
            handleUpdateStt(status, employeeId, time);
            remaining = status == 1 ? remaining - time : remaining;
            saveLeaveLogs(status, employeeId, time, remaining);
        }
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Đơn xin nghỉ <small>Phê duyệt</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                {leave.map((item) => (
                                    <div key={item.id} className={cx('card')}>
                                        <div className={cx('card-header', 'row', 'no-gutters')}>
                                            <p className={cx('card-title', 'pc-10')}>
                                                Trạng thái:{' '}
                                                <span className={cx('badge', 'badge-success')}>
                                                    <Status status={item.status} />
                                                </span>
                                                <br />
                                                Người thực hiện: <strong>{item.approved}</strong>
                                            </p>
                                            {isStatus === 0 ? (
                                                <div className={cx('pc-2', 'post-form')}>
                                                    <select className={cx('form-control', 'select')} id="status">
                                                        <option value="1">Phê duyệt</option>
                                                        <option value="2">Từ chối</option>
                                                        <option value="3">Huỷ</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div className={cx('card-body')}>
                                            <div className={cx('row', 'no-gutters')}>
                                                <div className={cx('pc-5')}>
                                                    <div className={cx('row', 'no-gutters', 'form-group')}>
                                                        <label className={cx('pc-5')}>Họ tên:</label>
                                                        <div className={cx('pc-7')}>
                                                            <p
                                                                id="employeeId"
                                                                data-employee={item.employee.id}
                                                                data-remaining={item.employee.vacationHours}
                                                            >
                                                                {item.employee.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={cx('row', 'no-gutters', 'form-group')}>
                                                        <label className={cx('pc-5')}>Văn phòng làm việc:</label>
                                                        <div className={cx('pc-7')}>
                                                            <p>{item.employee.department.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className={cx('row', 'no-gutters', 'form-group')}>
                                                        <label className={cx('pc-5')}>Loại nghỉ:</label>
                                                        <div className={cx('pc-7')}>
                                                            <p>{item.dayOffCategories.nameDay}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cx('pc-7')}>
                                                    <div className={cx('row', 'no-gutters', 'form-group')}>
                                                        <label className={cx('pc-5')}>Thời gian tạo:</label>
                                                        <div className={cx('pc-7')}>
                                                            <p>
                                                                {new Date(item.creationTime)
                                                                    .toISOString()
                                                                    .replace('T', ' ')
                                                                    .slice(0, 16)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={cx('row', 'no-gutters', 'form-group')}>
                                                        <label className={cx('pc-5')}>Thời gian bắt đầu:</label>
                                                        <div className={cx('pc-7')}>
                                                            <p>{item.startTime}</p>
                                                        </div>
                                                    </div>
                                                    <div className={cx('row', 'no-gutters', 'form-group')}>
                                                        <label className={cx('pc-5')}>Thời gian kết thúc:</label>
                                                        <div className={cx('pc-7')}>
                                                            <p>{item.endTime}</p>
                                                        </div>
                                                    </div>
                                                    <div className={cx('row', 'no-gutters', 'form-group')}>
                                                        <label className={cx('pc-5')}>Tổng thời gian xin nghỉ:</label>
                                                        <div className={cx('pc-7')}>
                                                            <p id="timeTotal">{item.totalTime} giờ</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('row', 'no-gutters', 'form-group')}>
                                                <label className={cx('pc-2')}>Lý do:</label>
                                                <div className={cx('pc-10')}>
                                                    <p>
                                                        <i>{item.reason}</i>
                                                    </p>
                                                </div>
                                            </div>
                                            <form>
                                                <div className={cx('row', 'no-gutters', 'form-group')}>
                                                    <label className={cx('pc-2')}>Bình luận</label>
                                                    <textarea
                                                        className={cx('form-control', 'message', 'pc-8')}
                                                        rows="6"
                                                    ></textarea>
                                                </div>
                                                <div className={cx('text-center')}>
                                                    <button
                                                        disabled={isStatus !== 0}
                                                        className={cx('btn', 'btn-default')}
                                                        onClick={updateStatusLeave}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <a
                                                        href={routes.leaveApprovals}
                                                        className={cx('btn', 'btn-default')}
                                                    >
                                                        Thoát
                                                    </a>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Leave;
