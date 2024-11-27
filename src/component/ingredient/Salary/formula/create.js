import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { getDayOffCate, getSalaryCate, handleAlert } from '../../ingredient';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

export default function Create() {
    const { state, redirectLogin, checkRole } = useAuth();
    const [dayOff, setDayOff] = useState([]);
    const [salaryDefault, setSalaryD] = useState([]);
    const [salaryMonth, setSalaryM] = useState([]);
    const path = window.location.pathname.replace('/salary/formulas/edit/', '');

    const getFormulas = async () => {
        if (path.includes('/salary/formulas/create')) return;
        try {
            const response = await fetch(`${BASE_URL}salary_formulas/formula?id=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                document.querySelector('#name').value = data.result.name;
                document.querySelector('#message').value = data.result.salaryFormula;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async () => {
            await checkRole(state.account.role.permissions, 'CALC_ADD', true);
            await getDayOffCate(state.user).then((result) => setDayOff(result));
            await getSalaryCate('Lương cố định', state.user).then((result) => setSalaryD(result));
            await getSalaryCate('Lương theo tháng', state.user).then((result) => setSalaryM(result));
            await getFormulas();
        })();
    }, [state.isAuthenticated, state.loading]);

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    const clickAdd = () => {
        const name = document.querySelector('#name').value;
        const formulas = document.querySelector('#message').value;

        if (name === '') handleAlert('alert-danger', 'Tên không được để trống.');
        else if (formulas === '') handleAlert('alert-danger', 'Công thức không được để trống.');
        else {
            if (path.includes('/salary/formulas/create')) handleSave(name, formulas, 'POST');
            else handleSave(name, formulas, 'PUT');
        }
    };

    const handleSave = async (name, salaryFormula, method) => {
        let url = `${BASE_URL}salary_formulas`;
        url = method === 'PUT' ? url + `?id=${path}` : url;
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({ name, salaryFormula }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Cập nhật thành công');
                setTimeout(() => {
                    if (method === 'POST') {
                        document.querySelector('#formReset').reset();
                    }
                    clickClose();
                }, 3000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className={cx('content-wrapper')}>
            <section className={cx('content')}>
                <div className={cx('container-fluid')}>
                    <section className={cx('content-header')}>
                        <h1>
                            Công thức tính lương <small>Thêm mới</small>
                        </h1>
                    </section>
                    <div className={cx('row', 'no-gutters')}>
                        <div className={cx('pc-12', 't-12', 'm-12')}>
                            <div className={cx('card')}>
                                <div className={cx('card-header')}>
                                    <p className={cx('card-title')}>
                                        Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt buộc
                                    </p>
                                </div>
                                <div className={cx('row', 'no-gutters')}>
                                    <div className={cx('pc-4', 't-5', 'm-12')}>
                                        <div className={cx('card-body')}>
                                            <div className={cx('list_formula_categories')}>
                                                <div className={cx('formula_categories')}>
                                                    <span className={cx('title')}>
                                                        <b>LƯƠNG CỐ ĐỊNH</b>
                                                    </span>
                                                    <hr />
                                                    <div className={cx('body')}>
                                                        {salaryDefault.map((item) => (
                                                            <div key={item.id} className={cx('item_formula_category')}>
                                                                <span>{item.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={cx('formula_categories')}>
                                                    <span className={cx('title')}>
                                                        <b>LƯƠNG CẬP NHẬT TRONG THÁNG</b>
                                                    </span>
                                                    <hr />
                                                    <div className={cx('body')}>
                                                        {salaryMonth.map((item) => (
                                                            <div key={item.id} className={cx('item_formula_category')}>
                                                                <span>{item.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={cx('formula_categories')}>
                                                    <span className={cx('title')}>
                                                        <b>DANH SÁCH LIÊN QUAN</b>
                                                    </span>
                                                    <hr />
                                                    <div className={cx('body')}>
                                                        <div className={cx('item_formula_category')}>
                                                            <span>Giờ cần làm việc</span>
                                                        </div>
                                                        <div className={cx('item_formula_category')}>
                                                            <span>Giờ chấm công</span>
                                                        </div>
                                                        <div className={cx('item_formula_category')}>
                                                            <span>Giờ nghỉ lễ</span>
                                                        </div>
                                                        {dayOff.map((item) => (
                                                            <div key={item.id} className={cx('item_formula_category')}>
                                                                <span>{item.nameDay}</span>
                                                            </div>
                                                        ))}
                                                        <div className={cx('item_formula_category')}>
                                                            <span>Số lần đi muộn</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cx('pc-8', 't-7', 'm-12')}>
                                        <div className={cx('d-flex justify-content-end')}>
                                            <div className={cx('pc-11')}>
                                                <form onSubmit={(e) => handleSubmit(e)} id="formReset">
                                                    <div className={cx('card-body')}>
                                                        <div className={cx('form-group')}>
                                                            <label>
                                                                Tên công thức<span className={cx('text-red')}> *</span>
                                                            </label>
                                                            <input type="text" className={cx('form-control')} id="name" placeholder="Nhập tên công thức..." />
                                                        </div>
                                                        <div className={cx('form-group')}>
                                                            <label>
                                                                Công thức tính lương
                                                                <span className={cx('text-red')}> *</span>
                                                            </label>
                                                            <textarea
                                                                className={cx('form-control', 'message')}
                                                                id="message"
                                                                rows="5"
                                                                placeholder="Nhập công thức tính..."
                                                            ></textarea>
                                                        </div>
                                                        <div className={cx('alert')}>
                                                            <ul className={cx('pc-11', 't-11', 'm-11')}>
                                                                <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                            </ul>
                                                            <button type="button" className={cx('close', 'pc-2')} onClick={clickClose}>
                                                                ×
                                                            </button>
                                                        </div>
                                                        <div className={cx('text-center')}>
                                                            <button type="submit" className={cx('btn', 'btn-success')} onClick={clickAdd}>
                                                                Thêm mới
                                                            </button>
                                                            <button type="reset" className={cx('btn', 'btn-danger')}>
                                                                Nhập lại
                                                            </button>
                                                            <a href={routes.salaryFormulas}>
                                                                <button type="button" className={cx('btn', 'btn-default')}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
