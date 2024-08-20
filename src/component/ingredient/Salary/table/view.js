import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../list.module.scss';
import { BASE_URL } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';
import { getDayOffCate, getTotalTimeHoliday, formatter } from '../../ingredient';

const cx = classNames.bind(styles);

export default function View() {
    (async function () {
        await isCheck();
    })();

    const [formulas, setFormula] = useState();
    const [salaryD, setSalaryD] = useState([]);
    const [dayOff, setDayOff] = useState([]);
    const [totalTime, setTime] = useState({ 'Giờ nghỉ lễ': 0 });
    const [salaryS, setSalaryS] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/salary/table/view/', '');

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    function parseExpression(expression) {
        const regex = /[^\+\-\*\/\(\)\s]+(?:\s+[^\+\-\*\/\(\)\s]+)*/g;

        const parts = expression.match(regex);

        return parts
            .map((part) => part.trim()) // Loại bỏ khoảng trắng đầu và cuối
            .filter((part) => part.length > 0) // Loại bỏ phần trống
            .filter((part) => !/\d/.test(part));
    }

    const getSalary = async () => {
        try {
            const response = await fetch(`${BASE_URL}salary_tables/wage?id=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                const id = data.result.employee.id;
                const formula = data.result.employee.formula.salaryFormula;
                document.querySelector('#formula').textContent = formula;
                document.querySelector('#name').textContent = data.result.time + ' - ' + data.result.employee.name;
                document.querySelector('#total').textContent = formatter.format(data.result.totalSalary);
                setFormula(parseExpression(formula));

                await getSalaryMonth(id, data.result.time);
                await getSalaryStatic(id);
                await getTotalMoneyAdvance(id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getSalaryMonth = async (id, time) => {
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
                setSalaryD(data.result);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getSalaryStatic = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}salary_static_values/wage?employeeId=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                setSalaryS(data.result);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getTotalMoneyAdvance = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}advances/money?id=${id}&status=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) document.querySelector('#advance').textContent = formatter.format(data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            const formattedDate = `${year}-${month}`;

            await getSalary();
            await getDayOffCate(token).then((result) => setDayOff(result));
            await getTotalTimeHoliday(token, formattedDate).then((result) => setTime({ 'Giờ nghỉ lễ': result || 0 }));
        })();
    }, []);

    return (
        <div className={cx('content-wrapper')}>
            <section className={cx('content')}>
                <div className={cx('container-fluid')}>
                    <section className={cx('content-header')}>
                        <h1>
                            Bảng lương <small id="name"></small>
                        </h1>
                    </section>
                    <div className={cx('row', 'no-gutters')}>
                        <div className={cx('pc-12')}>
                            <div className={cx('card')}>
                                <div className={cx('card-body')}>
                                    <table className={cx('table')}>
                                        <tbody>
                                            <tr>
                                                {formulas !== undefined && (
                                                    <>
                                                        {salaryD
                                                            .filter((item) =>
                                                                formulas.includes(item.wageCategories.name),
                                                            )
                                                            .map((item, index) => (
                                                                <th key={`salaryD-${index}`}>
                                                                    {item.wageCategories.name}
                                                                </th>
                                                            ))}
                                                        {dayOff
                                                            .filter((item) => formulas.includes(item.nameDay))
                                                            .map((item, index) => (
                                                                <th key={`dayOff-${index}`}>{item.nameDay}</th>
                                                            ))}
                                                        {formulas.includes('Giờ nghỉ lễ') && <th>Giờ nghỉ lễ</th>}
                                                        {salaryS
                                                            .filter((item) =>
                                                                formulas.includes(item.wageCategories.name),
                                                            )
                                                            .map((item, index) => (
                                                                <th key={`salaryS-${index}`}>
                                                                    {item.wageCategories.name}
                                                                </th>
                                                            ))}
                                                        <th>Tạm ứng</th>
                                                        <th>Tổng</th>
                                                    </>
                                                )}
                                            </tr>
                                            <tr>
                                                {formulas !== undefined && (
                                                    <>
                                                        {salaryD
                                                            .filter((item) =>
                                                                formulas.includes(item.wageCategories.name),
                                                            )
                                                            .map((item, index) => (
                                                                <th key={`salaryD-value-${index}`}>
                                                                    {formatter.format(item.salary)}
                                                                </th>
                                                            ))}
                                                        {dayOff
                                                            .filter((item) => formulas.includes(item.nameDay))
                                                            .map((item, index) => (
                                                                <th key={`dayOff-value-${index}`}>{item.timeDay}</th>
                                                            ))}
                                                        {formulas.includes('Giờ nghỉ lễ') && (
                                                            <th>{totalTime['Giờ nghỉ lễ']}</th>
                                                        )}
                                                        {salaryS
                                                            .filter((item) =>
                                                                formulas.includes(item.wageCategories.name),
                                                            )
                                                            .map((item, index) => (
                                                                <th key={`salaryS-value-${index}`}>
                                                                    {formatter.format(item.salary)}
                                                                </th>
                                                            ))}
                                                    </>
                                                )}
                                                <th id="advance">0</th>
                                                <th id="total"></th>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br />
                                    <p id="formula"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
