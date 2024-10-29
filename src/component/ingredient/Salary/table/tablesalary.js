import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../list.module.scss';
import { BASE_URL } from '../../../../config/config';
import { reloadAfterDelay } from '../../../globalstyle/checkToken';
import { getDayOffCate, getTotalTimeHoliday, formatter } from '../../ingredient';

const cx = classNames.bind(styles);

export default function TableSalary({ isFlag, recipe, className, employeeId, time, id, vacationTime, bank }) {
    // const { state, redirectLogin } = useAuth();
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
                await getTotalMoneyAdvance(id, data.result.time);
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

    const getTotalMoneyAdvance = async (id, time) => {
        try {
            const response = await fetch(`${BASE_URL}advances/money?id=${id}&status=1&time=${time}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) document.querySelector('#advance').textContent = formatter.format(data.result);
            else document.querySelector('#advance').textContent = 0;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            const formattedDate = `${year}-${month}`;

            isFlag && (await getSalary());
            if (recipe != '' && recipe != null) {
                setFormula(parseExpression(recipe));
                getSalaryMonth(employeeId, time);
                getSalaryStatic(employeeId);
                getTotalMoneyAdvance(employeeId, time);
            }
            await getDayOffCate(token).then((result) => setDayOff(result));
            await getTotalTimeHoliday(token, formattedDate).then((result) => setTime({ 'Giờ nghỉ lễ': result || 0 }));
        })();
    }, [recipe, employeeId, time, vacationTime, bank]);

    const totalPrice = () => {
        const value = getAllValuesFromTable();
        const totalMoney = calculateSalary(recipe, value);
        const advance = document.querySelector('#advance');
        const text = advance.textContent.replace(/[.,₫\s]/g, '');
        const advances = parseInt(text, 10);
        document.querySelector('#total').textContent = formatter.format(Math.floor(totalMoney - advances));

        saveSalary(time, advances, Math.floor(totalMoney - advances), 0, employeeId, bank);
    };

    const saveSalary = async (time, advance, totalSalary, status, employeeId, bankId) => {
        try {
            const response = await fetch(`${BASE_URL}salary_tables`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ time, advance, totalSalary, status, employeeId, bankId }),
            });

            const data = await response.json();
            if (data.code === 303) {
                alert('Thành công');
                reloadAfterDelay(500);
            } else alert(data.message);
        } catch (error) {
            console.log(error);
        }
    };

    function getAllValuesFromTable() {
        const values = {};
        const price = document.querySelectorAll(`.${cx('price')}`);

        price.forEach((element) => {
            const name = element.getAttribute('data-name');
            const text = element.textContent.replace(/[.,₫\s]/g, '');
            values[name] = parseInt(text, 10);
        });
        return values;
    }

    function calculateSalary(formula, values) {
        let evaluatedFormula = formula;
        for (const [key, value] of Object.entries(values)) {
            const regex = new RegExp(key, 'g');
            evaluatedFormula = evaluatedFormula.replace('Giờ cần làm việc', vacationTime);
            evaluatedFormula = evaluatedFormula.replace(regex, value);
        }

        const variables = evaluatedFormula.match(/[\p{L}\p{N}_]+/gu);

        if (variables) {
            const uniqueVariables = [...new Set(variables)].filter(
                (variable) => !values.hasOwnProperty(variable) && !/^\d+(\.\d+)?$/.test(variable),
            );

            for (const variable of uniqueVariables) {
                const regex = new RegExp(variable, 'g');
                evaluatedFormula = evaluatedFormula.replace(regex, '0');
            }
        }
        evaluatedFormula = evaluatedFormula.replace(/\s+/g, '');
        evaluatedFormula = evaluatedFormula.replace(/\b0+(\d+)\b/g, (match, p1) => {
            return parseInt(p1, 8).toString();
        });

        try {
            return eval(evaluatedFormula);
        } catch (e) {
            console.error('Error evaluating formula:', e);
            return NaN;
        }
    }

    // console.clear();

    return (
        <div className={cx('row', 'no-gutters', className)} id={id}>
            <div className={cx('pc-12', 'm-12')}>
                <div className={cx('card')}>
                    <div className={cx('card-body')}>
                        <table className={cx('table')}>
                            <tbody>
                                <tr>
                                    {formulas !== undefined && (
                                        <>
                                            {salaryD
                                                .filter((item) => formulas.includes(item.wageCategories.name))
                                                .map((item, index) => (
                                                    <th key={`salaryD-${index}`}>{item.wageCategories.name}</th>
                                                ))}
                                            {dayOff
                                                .filter((item) => formulas.includes(item.nameDay))
                                                .map((item, index) => (
                                                    <th key={`dayOff-${index}`}>{item.nameDay}</th>
                                                ))}
                                            {formulas.includes('Giờ nghỉ lễ') && <th>Giờ nghỉ lễ</th>}
                                            {salaryS
                                                .filter((item) => formulas.includes(item.wageCategories.name))
                                                .map((item, index) => (
                                                    <th key={`salaryS-${index}`}>{item.wageCategories.name}</th>
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
                                                .filter((item) => formulas.includes(item.wageCategories.name))
                                                .map((item, index) => (
                                                    <th
                                                        className={cx('price')}
                                                        key={index}
                                                        data-name={item.wageCategories.name}
                                                    >
                                                        {formatter.format(item.salary)}
                                                    </th>
                                                ))}
                                            {dayOff
                                                .filter((item) => formulas.includes(item.nameDay))
                                                .map((item, index) => (
                                                    <th className={cx('price')} key={index} data-name={item.nameDay}>
                                                        {item.timeDay}
                                                    </th>
                                                ))}
                                            {formulas.includes('Giờ nghỉ lễ') && (
                                                <th className={cx('price')} data-name={'Giờ nghỉ lễ'}>
                                                    {totalTime['Giờ nghỉ lễ']}
                                                </th>
                                            )}
                                            {salaryS
                                                .filter((item) => formulas.includes(item.wageCategories.name))
                                                .map((item, index) => (
                                                    <th
                                                        className={cx('price')}
                                                        key={index}
                                                        data-name={item.wageCategories.name}
                                                    >
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
                        {path.includes('/salary/table/create') && (
                            <div className={cx('text-center')}>
                                <button type="submit" className={cx('btn', 'btn-success')} onClick={totalPrice}>
                                    Tính lương
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
