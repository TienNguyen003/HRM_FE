import React from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import TableSalary from './tablesalary';
import { BASE_URL } from '../../../../config/config';
import { getAllUser, getUser } from '../../ingredient';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

export default function Create() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [bank, setBank] = useState([]);
    const [recipe, setRecipe] = useState('');
    const [time, setTime] = useState('');
    const [vacationTime, setVacationTime] = useState('');
    const [bankId, setBankId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [user, setUser] = useState([]);

    const getBank = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}bank_accounts/employee?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) setBank(data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async () => {
            await checkRole(state.account.role.permissions, 'SALA_ADD', true);
            if (checkRole(state.account.role.name, 'NHÂN VIÊN')) getUser(state.user, state.account.id).then((result) => setUser([result]));
            else await getAllUser(state.user).then((result) => setUser(result));
        })();
    }, [state.isAuthenticated, state.loading]);

    const saveSalaryTable = () => {
        const bank = document.querySelector('#bank').value;
        const name = document.querySelector('#user_name');
        const selectedOption = name.options[name.selectedIndex];
        const dataFormula = selectedOption.getAttribute('data-formula');
        const vacationTime = selectedOption.getAttribute('data-time');

        const month = document.querySelector('#month').value;
        const year = document.querySelector('#year').value;

        console.log(bank);

        getBank(name.value);

        setRecipe(dataFormula);
        setEmployeeId(name.value);
        setTime(month + '/' + year);
        setVacationTime(vacationTime);
        setBankId(bank);

        const salaryTable = document.querySelector('#salaryTable');
        salaryTable.classList.remove(`${cx('hidden')}`);
        if (name.value == '' || bank == '') {
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
                                {t('common.Salary Table')}
                                <small>{t('common.button.create')}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>{t('common.Edit')}</p>
                                    </div>

                                    <form onSubmit={(e) => handleSubmitForm(e)}>
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Name')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="user_name" className={cx('form-control', 'select')} onChange={saveSalaryTable}>
                                                        <option value="">--{t('common.Employees')}--</option>
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
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Bank Account')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="bank" className={cx('form-control', 'select')} onChange={saveSalaryTable}>
                                                        <option value="">-- {t('common.Bank Account')} --</option>
                                                        {bank.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.nameBank + ' - ' + item.numberBank}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Month')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')} style={{ display: 'flex' }}>
                                                    <select
                                                        id="month"
                                                        onChange={saveSalaryTable}
                                                        className={cx('form-control', 'select', 'pc-1', 't-2', 'm-2')}
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
                                                    <select id="year" className={cx('form-control', 'select', 'pc-2', 't-4', 'm-3')} onChange={saveSalaryTable}>
                                                        <option value="2024">2024</option>
                                                        <option value="2025">2025</option>
                                                        <option value="2026">2026</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('text-center')}>
                                                <a href={routes.salaryTable}>
                                                    <button type="button" className={cx('btn', 'btn-danger')}>
                                                        {t('common.button.exit')}
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
