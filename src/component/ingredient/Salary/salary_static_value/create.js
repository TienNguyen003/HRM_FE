import React from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { getAllUser, getSalaryCate, handleAlert, getUser } from '../../ingredient';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

export default function Create() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [user, setUser] = useState([]);
    const [salaryCate, setSalaryCate] = useState([]);
    const path = window.location.pathname.replace('/salary/edit/', '');

    const numberRegex = /[0-9]/;

    const getSalary = async (id) => {
        id = numberRegex.test(path) ? path : id;
        if (!numberRegex.test(id) && id.includes('/salary/create')) return;
        try {
            const response = await fetch(`${BASE_URL}salary_static_values/wage?employeeId=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
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
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'SAFI_ADD', true);
            if (checkRole(state.account.role.name, 'NHÂN VIÊN')) getUser(state.user, state.account.id).then((result) => setUser([result]));
            else await getAllUser(state.user).then((result) => setUser(result));
            await getSalaryCate('Lương cố định ', state.user).then((result) => setSalaryCate(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getSalary(state.account.employee.id);
        })();
    }, [state.isAuthenticated, state.loading]);

    const handleSaveSalary = async (wageRequests, method = 'POST') => {
        try {
            const response = await fetch(`${BASE_URL}salary_static_values`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
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

        const results = Array.from(inputs).map((input) => {
            const name = input.name;
            const idWage = name.match(/\d+/)[0];
            const id = input.getAttribute('data-id');
            const value = input.value;

            return { employeeId, wageCategoriesId: idWage, salary: value, id };
        });

        const hasInvalidSalary = results.some((item) => !numberRegex.test(item.salary));

        if (hasInvalidSalary) handleAlert('alert-danger', 'Các giá trị chỉ được chứa số');
        else {
            if (path.includes('/salary/create')) handleSaveSalary(results);
            else {
                const filteredResults = results.filter(({ id }) => id && id.trim() !== '').map(({ id, salary }) => ({ id, salary }));
                handleSaveSalary(filteredResults, 'PUT');
            }
        }
    };

    const handleChangeSelect = () => {
        const id = document.querySelector('#user_id').value;
        getSalary(id);
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
                                {t('common.Fixed Salary')}
                                <small>{path.includes('/salary/create') ? `${t('common.button.create')}` : `${t('common.Edit')}`}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>{t('common.Required field')}</p>
                                    </div>
                                    <div className={cx('card-body')}>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'm-3', 't-4')}>
                                                {t('common.Name')}
                                                <span className={cx('text-red')}> *</span>{' '}
                                            </label>
                                            <div className={cx('pc-8', 'm-8', 't-8')}>
                                                <select id="user_id" className={cx('form-control', 'select')} onChange={handleChangeSelect}>
                                                    {user.map((item) => (
                                                        <option key={item.id} value={item.employee.id}>
                                                            {item.employee.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <h4 className={cx('title', 'text-center')}>
                                            <b>{t('common.Fixed Salary')}</b>
                                        </h4>
                                        <div className={cx('row', 'no-gutters', 'text-center')} style={{ justifyContent: 'center' }}>
                                            <div className={cx('pc-8', 't-12', 'm-12')}>
                                                <table className={cx('table')}>
                                                    <tbody id="table-salary">
                                                        <tr>
                                                            <th>STT</th>
                                                            <th>{t('common.Salary Categories')}</th>
                                                            <th>{t('common.Money')}</th>
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
                                            <ul className={cx('pc-11', 't-11', 'm-11')}>
                                                <li className={cx('alert-content')}>Tên không được để trống.</li>
                                            </ul>
                                            <button type="button" className={cx('close', 'pc-1')} onClick={clickClose}>
                                                ×
                                            </button>
                                        </div>
                                        <div className={cx('text-center')}>
                                            {path.includes('/salary/create') ? (
                                                <button type="submit" className={cx('btn', 'btn-success')} onClick={saveSalary}>
                                                    {t('common.button.create')}
                                                </button>
                                            ) : (
                                                <button type="submit" className={cx('btn', 'btn-info')} onClick={saveSalary}>
                                                    {t('common.button.save')}
                                                </button>
                                            )}
                                            <a href={routes.salary}>
                                                <button type="button" className={cx('btn', 'btn-default')}>
                                                    {t('common.button.exit')}
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
