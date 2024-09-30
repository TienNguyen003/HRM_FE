import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';

import styles from '../list.module.scss';
import routes from '../../../config/routes';
import Status from '../../globalstyle/Status/status';
import { BASE_URL } from '../../../config/config';
import { isCheck, decodeToken, checkPermission } from '../../globalstyle/checkToken';
import { getDayOffCate } from '../ingredient';
import { Pagination } from '../../layout/pagination/pagination';

const cx = classNames.bind(styles);

function Leave() {
    (async function () {
        await isCheck();
        decodeToken(token, 'REQ_VIEW', true);
    })();

    const [leave, setLeave] = useState([]);
    const [dayOff, setDayOff] = useState([]);
    const [page, setPage] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const employee = JSON.parse(localStorage.getItem('employee')) || '';
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
                        Authorization: `Bearer ${token}`,
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
        (async function () {
            await getDayOffCate(token).then((result) => setDayOff(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getLeave(decodeToken(token, 'ROLE_NHÂN') ? employee.id : '');
        })();
    }, []);

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Đơn xin nghỉ <small>Danh sách</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10', 'm-10')}>
                                                <div id="search">
                                                    <form>
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'post-form', 'm-5')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    name="name"
                                                                    id="name"
                                                                    placeholder="Họ tên"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form', 'm-5')}>
                                                                <select
                                                                    className={cx('form-control', 'select')}
                                                                    name="dayOff"
                                                                    id="dayOff"
                                                                >
                                                                    <option value="">-- Loại nghỉ --</option>
                                                                    {dayOff.map((item) => (
                                                                        <option key={item.id} value={item.id}>
                                                                            {item.nameDay}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form', 'm-5')}>
                                                                <select
                                                                    className={cx('form-control', 'select')}
                                                                    name="status"
                                                                    id="status"
                                                                >
                                                                    <option value="">-- Trạng thái --</option>
                                                                    <option value="0">Đang chờ duyệt</option>
                                                                    <option value="1">Đã phê duyệt</option>
                                                                    <option value="2">Đã từ chối</option>
                                                                    <option value="3">Đã huỷ</option>
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-3')}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> Tìm kiếm
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a href={routes.leaveCreate} className={cx('btn')}>
                                                    <i className={cx('fa fa-plus')}></i>
                                                    &nbsp;Thêm mới
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>Họ tên</th>
                                                    <th className={cx('text-center')}>Loại nghỉ</th>
                                                    <th className={cx('text-center')}>Thời gian bắt đầu</th>
                                                    <th className={cx('text-center')}>Thời gian kết thúc</th>
                                                    <th className={cx('text-center', 'm-0')}>Tổng số giờ nghỉ</th>
                                                    <th className={cx('text-center', 'm-0')}>Người duyệt</th>
                                                    <th className={cx('text-center')}>Trạng thái</th>
                                                    {decodeToken(token, 'REQ_APPROVALS') && (
                                                        <th className={cx('text-center')}>Sửa</th>
                                                    )}
                                                </tr>
                                                {leave.map((item, index) => (
                                                    <tr key={item.id} className={cx('record-data')}>
                                                        <td className={cx('text-center')}>
                                                            {(+page.currentPage - 1) * 30 + index + 1}
                                                        </td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center')}>
                                                            {item.dayOffCategories.nameDay}
                                                        </td>
                                                        <td className={cx('text-center')}>{item.startTime}</td>
                                                        <td className={cx('text-center')}>{item.endTime}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.totalTime}h</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.approved}</td>
                                                        <td className={cx('text-center')}>
                                                            <Status status={item.status} />
                                                        </td>
                                                        {checkPermission(token, ['REQ_APPROVALS', 'REQ_EDIT']) && (
                                                            <td className={cx('text-center')}>
                                                                {path.includes('approvals') ? (
                                                                    decodeToken(token, 'REQ_APPROVALS') && (
                                                                        <a
                                                                            href={routes.leaveApprovalsEdit.replace(
                                                                                ':name',
                                                                                item.id,
                                                                            )}
                                                                        >
                                                                            <i className={cx('fas fa-eye')}></i>
                                                                        </a>
                                                                    )
                                                                ) : (
                                                                    <a
                                                                        href={routes.leaveEdit.replace(
                                                                            ':name',
                                                                            item.id,
                                                                        )}
                                                                    >
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
                                            <div className={cx('pc-10')}>
                                                <p>
                                                    Hiển thị <b>{page.totalItemsPerPage}</b> dòng / tổng{' '}
                                                    <b>{page.totalItems}</b>
                                                </p>
                                            </div>
                                            <div className={cx('pc-2')}>
                                                <Pagination
                                                    currentPage={page.currentPage}
                                                    totalPages={page.totalPages}
                                                />
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
