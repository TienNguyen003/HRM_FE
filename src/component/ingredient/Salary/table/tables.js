import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../list.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';
import { formatter } from '../../ingredient';
import { Pagination } from '../../../layout/pagination/pagination';

const cx = classNames.bind(styles);

export default function Salary() {
    (async function () {
        await isCheck();
    })();

    const [salary, setSalary] = useState([]);
    const [page, setPage] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

    const getSalary = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 1;
        const name = urlParams.get('name') || '';
        const status = urlParams.get('status') || '';
        const time = urlParams.get('time') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#time').value = time;
        document.querySelector('#status').querySelector('option[value="' + status + '"]').selected = true;

        try {
            const response = await fetch(
                `${BASE_URL}salary_tables?pageNumber=${page}&name=${name}&time=${time}&status=${status}`,
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
                setSalary(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getSalary();
        })();
    }, []);

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Bảng lương <small>Danh sách</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10')}>
                                                <div>
                                                    <form>
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    name="name"
                                                                    id="name"
                                                                    placeholder="Họ tên"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    name="time"
                                                                    id="time"
                                                                    placeholder="Lương tháng"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3')}>
                                                                <select
                                                                    className={cx('form-control', 'select')}
                                                                    name="status"
                                                                    id="status"
                                                                >
                                                                    <option value="">-- Trạng thái --</option>
                                                                    <option value="0">Chưa khoá</option>
                                                                    <option value="1">Đã khoá</option>
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-3')}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> Tìm kiếm
                                                                </button>
                                                                <button
                                                                    style={{ marginLeft: '5px' }}
                                                                    type="submit"
                                                                    className={cx('btn', 'btn-success')}
                                                                >
                                                                    <i className={cx('fas fa-download')}></i> Xuất excel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a href={routes.salaryTableCreate} className={cx('btn')}>
                                                    <i className={cx('fa fa-plus')}></i> Tạo Bảng Lương
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <button disabled className={cx('btn', 'salary-locked', 'btn-default')}>
                                            <i className={cx('fas fa-lock', 'text-danger')}></i>&ensp;Chốt lương
                                        </button>
                                        &ensp;
                                        <button disabled className={cx('btn', 'send-mail', 'btn-success')}>
                                            <i className={cx('fas fa-lock', 'text-danger')}></i>&ensp;Gửi mail
                                        </button>
                                        {/* <div className={cx('modal fade modal-notif')} id="vietqr">
                                            <div className={cx('modal-dialog modal-dialog-centered')}>
                                                <div className={cx('modal-content')}>
                                                    <div className={cx('modal-body')}>
                                                        <div className={cx('row')}>
                                                            <div className={cx('col-md-5')}>
                                                                <p className={cx('m-0')}>Tên ngân hàng:</p>
                                                                <p className={cx('bank_name')}>
                                                                    <b></b>
                                                                </p>
                                                                <p className={cx('m-0')}>Số tài khoản:</p>
                                                                <p className={cx('bank_number')}>
                                                                    <b></b>
                                                                </p>
                                                                <p className={cx('m-0')}>Chủ tài khoản:</p>
                                                                <p className={cx('bank_account')}>
                                                                    <b></b>
                                                                </p>
                                                                <p className={cx('m-0')}>Số tiền:</p>
                                                                <p className={cx('price')}>
                                                                    <b></b>
                                                                </p>
                                                                <p className={cx('m-0')}>Nội dung:</p>
                                                                <p className={cx('content')}>
                                                                    <b></b>
                                                                </p>
                                                            </div>
                                                            <div className={cx('col-md-7 text-center')}>
                                                                <img src="" className={cx('image-vietqr')} />
                                                                <button
                                                                    className={cx(
                                                                        'btn btn-sm btn-success confirm-transferred',
                                                                    )}
                                                                >
                                                                    Gửi mail xác nhận đã chuyển
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                        <table className={cx('table')} style={{ marginTop: '10px' }}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>
                                                        <input type="checkbox" id="check_all" />
                                                    </th>
                                                    <th className={cx('text-center')}>Họ tên</th>
                                                    <th className={cx('text-center')}>Phòng ban</th>
                                                    <th className={cx('text-center')}>Lương tháng</th>
                                                    <th className={cx('text-center')}>Mức lương</th>
                                                    <th className={cx('text-center')}>Tổng lương</th>
                                                    <th className={cx('text-center')}>Trạng thái</th>
                                                    <th className={cx('text-center')}>VietQR</th>
                                                    <th className={cx('text-center')}>Xem</th>
                                                </tr>
                                                {salary.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className={cx('text-center')}>
                                                            {(+page.currentPage - 1) * 30 + index + 1}
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <input type="checkbox" className={cx('minimal')} />
                                                        </td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td>
                                                            {item.employee.department.name} -{' '}
                                                            {item.employee.department.officeI.name}
                                                        </td>
                                                        <td className={cx('text-center')}>{item.time}</td>
                                                        <td className={cx('text-right')}>{formatter.format(item.salary)}</td>
                                                        <td className={cx('text-right')}>{formatter.format(item.totalSalary)}</td>
                                                        <td className={cx('text-center', 'text-danger')}>
                                                            <i className={cx('fas fa-lock-open')} title="Chưa khoá"></i>
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a
                                                                className={cx('vietqr')}
                                                                bank_name="Vietcombank"
                                                                bank_number="1971000001045"
                                                                bank_account="Nguyễn Văn D"
                                                                price={item.totalSalary}
                                                                email={item.employee.email}
                                                            >
                                                                <i className={cx('fas fa-qrcode')}></i>
                                                            </a>
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a href={routes.salaryTableDetail.replace(":name", item.id)}>
                                                                <i className={cx('fas fa-eye', 'text-green')}></i>
                                                            </a>
                                                        </td>
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
