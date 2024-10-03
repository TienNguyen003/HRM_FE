import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck, reloadAfterDelay, decodeToken } from '../../../globalstyle/checkToken';
import { getAllUser, getSalaryCate, handleAlert, getUser } from '../../ingredient';

const cx = classNames.bind(styles);

export default function Create() {
    (async function () {
        await isCheck();
        decodeToken(token, 'SAUP_ADD', true);
    })();

    const numberRegex = /[0-9]/;

    const [user, setUser] = useState([]);
    const [salaryCate, setSalaryCate] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const employee = JSON.parse(localStorage.getItem('employee')) || '';
    const path = window.location.pathname.replace('/salary/dynamic_values/edit/', '');

    const getSalary = async (id, time) => {
        id = numberRegex.test(path) ? path : id;
        if (!numberRegex.test(id) && id.includes('/salary/dynamic_values/create')) return;
        try {
            const response = await fetch(`${BASE_URL}salary_dynamic_values/wage?employeeId=${id}&time=${time}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                if (id != undefined) document.querySelector('#user_id').querySelector('option[value="' + id + '"]').selected = true;
                const inputs = document.querySelectorAll('input[name^="category_id["]');
                inputs.forEach((input) => {
                    const idMatch = input.name.match(/\d+/);
                    if (idMatch) {
                        const id = idMatch[0];
                        const dataItem = data.result.find((item) => item.wageCategories.id == id);
                        if (dataItem) {
                            input.value = dataItem.salary;
                            input.setAttribute('data-id', dataItem.id);
                        } else input.value = 0;
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const month = document.querySelector('#month').value;
        const year = document.querySelector('#year').value;
        const time = month + '/' + year;

        (async function () {
            await getSalaryCate('Lương theo tháng ', token).then((result) => setSalaryCate(result));
            if (decodeToken(token, 'ROLE_NHÂN')) getUser(token).then((result) => setUser([result]));
            else await getAllUser(token).then((result) => setUser(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getSalary(employee.id, time);
        })();
    }, []);

    const handleSaveSalary = async (wageRequests, method = 'POST') => {
        try {
            const response = await fetch(`${BASE_URL}salary_dynamic_values`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(wageRequests),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thành công');
                setTimeout(() => {
                    clickClose();
                }, 3000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const saveSalary = () => {
        const employeeId = document.querySelector('#user_id').value;
        const inputs = document.querySelectorAll('input[name^="category_id["]');
        const month = document.querySelector('#month').value;
        const year = document.querySelector('#year').value;
        const time = month + '/' + year;

        const results = Array.from(inputs).map((input) => {
            const name = input.name;
            const idWage = name.match(/\d+/)[0];
            const id = input.getAttribute('data-id');
            const value = input.value;

            return { employeeId, wageCategoriesId: idWage, salary: value, id, time };
        });

        const hasInvalidSalary = results.some((item) => !numberRegex.test(item.salary));

        if (hasInvalidSalary) handleAlert('alert-danger', 'Các giá trị chỉ được chứa số');
        else {
            if (path.includes('/salary/dynamic_values/create')) handleSaveSalary(results);
            else {
                const filteredResults = results.filter(({ id }) => id && id.trim() !== '').map(({ id, salary }) => ({ id, salary }));
                handleSaveSalary(filteredResults, 'PUT');
            }
        }
    };

    const handleChangeSelect = () => {
        const id = document.querySelector('#user_id').value;
        const month = document.querySelector('#month').value;
        const year = document.querySelector('#year').value;
        const time = month + '/' + year;
        getSalary(id, time);
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    return (
        <div>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Lương cố định <small>Thêm mới</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>
                                            Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt buộc
                                        </p>
                                    </div>
                                    <div className={cx('card-body')}>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'm-3')}>
                                                Họ tên<span className={cx('text-red')}> *</span>{' '}
                                            </label>
                                            <div className={cx('pc-8', 'm-8')}>
                                                <select id="user_id" className={cx('form-control', 'select')} onChange={handleChangeSelect}>
                                                    {user.map((item) => (
                                                        <option key={item.id} value={item.employee.id}>
                                                            {item.employee.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'm-3')}>
                                                Tháng/Năm<span className={cx('text-red')}> *</span>
                                            </label>
                                            <div className={cx('pc-8', 'm-8')} style={{ display: 'flex' }}>
                                                <select
                                                    id="month"
                                                    className={cx('form-control', 'select', 'pc-1')}
                                                    onChange={handleChangeSelect}
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
                                                <select id="year" className={cx('form-control', 'select', 'pc-2')} onChange={handleChangeSelect}>
                                                    <option value="2024">2024</option>
                                                    <option value="2025">2025</option>
                                                    <option value="2026">2026</option>
                                                </select>
                                            </div>
                                        </div>
                                        <h4 className={cx('title', 'text-center')}>
                                            <b>Các khoản lương cố định trong tháng</b>
                                        </h4>
                                        <div className={cx('row', 'no-gutters', 'text-center')} style={{ justifyContent: 'center' }}>
                                            <div className={cx('pc-8')}>
                                                <table className={cx('table')}>
                                                    <tbody id="table-salary">
                                                        <tr>
                                                            <th>STT</th>
                                                            <th>Danh mục lương</th>
                                                            <th>Giá trị</th>
                                                        </tr>
                                                        {salaryCate.map((item, index) => (
                                                            <tr key={index} data-value={item.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className={cx('form-control', 'text-right')}
                                                                        name={'category_id[' + item.id + ']'}
                                                                        data-id=""
                                                                        placeholder="0"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className={cx('alert')}>
                                            <ul className={cx('pc-11')}>
                                                <li className={cx('alert-content')}>Tên không được để trống.</li>
                                            </ul>
                                            <button type="button" className={cx('close', 'pc-1')} onClick={clickClose}>
                                                ×
                                            </button>
                                        </div>
                                        <div className={cx('text-center')}>
                                            <button type="submit" className={cx('btn', 'btn-success')} onClick={saveSalary}>
                                                Cập nhật
                                            </button>
                                            <a href={routes.salaryDynamic}>
                                                <button type="button" className={cx('btn', 'btn-default')}>
                                                    Thoát
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
