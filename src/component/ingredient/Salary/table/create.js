import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';
import { getAllUser } from '../../ingredient';
import TableSalary from './tablesalary';

const cx = classNames.bind(styles);

export default function Create() {
    (async function () {
        await isCheck();
    })();

    const [bank, setBank] = useState([]);
    const [recipe, setRecipe] = useState('');
    const [time, setTime] = useState('');
    const [vacationTime, setVacationTime] = useState('');
    const [bankId, setBankId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [user, setUser] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

    const getBank = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}bank_accounts/employee?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log(data);
            if (data.code === 303) setBank(data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            await getAllUser(token).then((result) => setUser(result));
        })();
    }, []);

    const saveSalaryTable = () => {
        const bank = document.querySelector('#bank').value;
        const name = document.querySelector('#user_name');
        const selectedOption = name.options[name.selectedIndex];
        const dataFormula = selectedOption.getAttribute('data-formula');
        const vacationTime = selectedOption.getAttribute('data-time');

        const month = document.querySelector('#month').value;
        const year = document.querySelector('#year').value;

        getBank(name.value);

        setRecipe(dataFormula);
        setEmployeeId(name.value);
        setTime(month + '/' + year);
        setVacationTime(vacationTime);
        setBankId(bank);

        const salaryTable = document.querySelector('#salaryTable');
        salaryTable.classList.remove(`${cx('hidden')}`);
        if (name.value == '') {
            salaryTable.classList.add(`${cx('hidden')}`);
            setBank([]);
        }
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
                                Bảng lương <small>Thêm mới</small>
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
                                                    <select
                                                        id="user_name"
                                                        className={cx('form-control', 'select')}
                                                        onChange={saveSalaryTable}
                                                    >
                                                        <option value="">--Chọn nhân viên--</option>
                                                        {user.map((item) => (
                                                            <option
                                                                key={item.id}
                                                                value={item.employee.id}
                                                                data-formula={item.employee.formula.salaryFormula}
                                                                data-time={item.employee.vacationTime}
                                                            >
                                                                {item.employee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Ngân hàng<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <select
                                                        id="bank"
                                                        className={cx('form-control', 'select')}
                                                        onChange={saveSalaryTable}
                                                    >
                                                        <option value="">--Chọn ngân hàng--</option>
                                                        {bank.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.nameBank + ' - ' + item.numberBank}
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
                                                        onChange={saveSalaryTable}
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
                                                    <select
                                                        id="year"
                                                        className={cx('form-control', 'select', 'pc-2')}
                                                        onChange={saveSalaryTable}
                                                    >
                                                        <option value="2024">2024</option>
                                                        <option value="2025">2025</option>
                                                        <option value="2026">2026</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('text-center')}>
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
            <TableSalary
                recipe={recipe}
                className={cx('hidden')}
                employeeId={employeeId}
                time={time}
                vacationTime={vacationTime}
                bank={bankId}
                id={'salaryTable'}
            />
        </>
    );
}
