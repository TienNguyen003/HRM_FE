import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';
import { getAllUser } from '../../ingredient';

const cx = classNames.bind(styles);

export default function Create() {
    (async function () {
        await isCheck();
    })();

    const [user, setUser] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

    useEffect(() => {
        (async () => {
            await getAllUser(token).then((result) => setUser(result));
        })();
    }, []);

    return (
        <div className={cx('content-wrapper')}>
            <section className={cx('content')}>
                <div className={cx('container-fluid')}>
                    <section className={cx('content-header')}>
                        <h1>
                            Bảng lương <small>Thêm mới</small>
                        </h1>
                    </section>
                    <div className={cx('row', 'no-gutters')}>
                        <div className={cx('pc-12')}>
                            <div className={cx('card')}>
                                <div className={cx('card-header')}>
                                    <p className={cx('card-title')}>
                                        Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt buộc
                                    </p>
                                </div>

                                <form>
                                    <div className={cx('card-body')}>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2')}>
                                                Họ tên<span className={cx('text-red')}> *</span>
                                            </label>
                                            <div className={cx('pc-8')}>
                                                <select
                                                    name="user_id"
                                                    id="user_id"
                                                    className={cx('form-control', 'select')}
                                                >
                                                    <option value="">--Chọn nhân viên--</option>
                                                    {user.map((item) => (
                                                        <option key={item.id} value={item.employee.id}>
                                                            {item.employee.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2')}>
                                                Tháng/Năm<span className={cx('text-red')}> *</span>
                                            </label>
                                            <div className={cx('pc-8')} style={{ display: 'flex' }}>
                                                <select
                                                    id="month"
                                                    className={cx('form-control', 'select', 'pc-1')}
                                                    style={{ marginRight: '1rem' }}
                                                >
                                                    <option value="1">01</option>
                                                    <option value="2">02</option>
                                                    <option value="3">03</option>
                                                    <option value="4">04</option>
                                                    <option value="5">05</option>
                                                    <option value="6">06</option>
                                                    <option value="7">07</option>
                                                    <option value="8">08</option>
                                                    <option value="9">09</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                    <option value="12">12</option>
                                                </select>
                                                <select id="year" className={cx('form-control', 'select', 'pc-2')}>
                                                    <option value="2024">2024</option>
                                                    <option value="2025">2025</option>
                                                    <option value="2026">2026</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={cx('text-center')}>
                                            <button type="submit" className={cx('btn', 'btn-success')}>
                                                Tính lương
                                            </button>
                                            <a href={routes.salaryTable}>
                                                <button type="button" className={cx('btn', 'btn-danger')}>
                                                    Thoát
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
    );
}
