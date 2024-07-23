import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';
import { getAllUser, handleAlert } from '../../ingredient';

const cx = classNames.bind(styles);

export default function Create() {
    (async function () {
        await isCheck();
    })();

    const [user, setUser] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/users/contracts/edit/', '');

    async function getContract() {
        const user_id = document.querySelector('#user_id');
        const fileName = document.getElementById('labelFile');
        const start = document.querySelector('#start');
        const end = document.querySelector('#end');

        if (path.includes('/users/contracts')) return '';
        try {
            const response = await fetch(`${BASE_URL}contracts/contracts?contractsId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                const dataRs = data.result;

                fileName.textContent = dataRs.urlFile ? dataRs.urlFile : 'Choose File';
                user_id.querySelector('option[value="' + dataRs.employee.id + '"]').selected = true;
                start.value = dataRs.employee.hire_date;
                end.value = dataRs.employee.dismissal_date;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        (async function () {
            await getAllUser(token).then((result) => setUser(result));
            await getContract();
        })();
    }, []);    

    // api them
    async function saveContract(employeeId, urlFile) {
        try {
            const response = await fetch(`${BASE_URL}contracts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    urlFile: urlFile,
                    employeeId: employeeId,
                }),
            });

            const data = await response.json();
            if (data.code === 303) handleAlert('alert-success', 'Thêm thành công');
            else handleAlert('alert-danger', 'Thêm thất bại');
        } catch (error) {
            console.log(error);
        }
    }
    async function saveDismissal(start, end, id) {
        try {
            const response = await fetch(`${BASE_URL}employee/dismissal?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    hire_date: start,
                    dismissal_date: end,
                }),
            });
        } catch (error) {
            console.log(error);
        }
    }
    async function updateContract(employeeId, urlFile) {
        try {
            const response = await fetch(`${BASE_URL}contracts?contractsId=${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    urlFile: urlFile,
                    employeeId: employeeId,
                }),
            });

            const data = await response.json();
            if (data.code === 303) handleAlert('alert-success', 'Cập nhật thành công');
            else handleAlert('alert-danger', 'Cập nhật thất bại');
        } catch (error) {
            console.log(error);
        }
    }

    // them hop dong
    const clickAdd = () => {
        const user_id = document.querySelector('#user_id').value;
        const file = document.getElementById('attach').files[0];
        const start = document.querySelector('#start');
        const end = document.querySelector('#end');
        let nameFile;
        if (file) {
            nameFile = file.name;
        }
        if (start.value === '') handleAlert('alert-danger', 'Ngày bắt đầu không được để trống');
        else if (end.value !== '' && end <= start)
            handleAlert('alert-danger', 'Ngày kết thúc phải lớn hơn ngày bắt đầu');
        else {
            saveDismissal(start.value, end.value, user_id);
            saveContract(user_id, nameFile);
        }
    };

    // update hop dong
    const clickUpdate = () => {
        const user_id = document.querySelector('#user_id').value;
        const file = document.getElementById('attach').files[0];
        const start = document.querySelector('#start');
        const end = document.querySelector('#end');
        let nameFile;
        if (file) {
            nameFile = file.name;
        }
        if (start.value === '') handleAlert('alert-danger', 'Ngày bắt đầu không được để trống');
        else if (end.value !== '' && end <= start) handleAlert('alert-danger', 'Ngày kết thúc phải lớn hơn ngày bắt đầu');
        else {
            saveDismissal(start.value, end.value, user_id);
            updateContract(user_id, nameFile);
        }
    };

    // an nut nhap lai
    const clickReset = () => {
        document.querySelector('#labelFile').textContent = 'Choose file';
    };

    // them file
    const changeFile = (e) => {
        document.querySelector('#labelFile').textContent = e.target.value.split('\\').pop();
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
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
                                Hợp đồng <small>Thêm mới</small>
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
                                                    Họ tên<span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <select
                                                        name="user_id"
                                                        id="user_id"
                                                        className={cx('form-control', 'select')}
                                                    >
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
                                                    Bắt đầu<span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input
                                                            type="date"
                                                            className={cx('form-control')}
                                                            id="start"
                                                        ></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>Kết thúc</label>
                                                <div className={cx('pc-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input
                                                            type="date"
                                                            className={cx('form-control')}
                                                            id="end"
                                                        ></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>Tệp đính kèm</label>
                                                <div className={cx('pc-8')}>
                                                    <div className={cx('custom-file')}>
                                                        <input
                                                            type="file"
                                                            className={cx('custom-file-input')}
                                                            id="attach"
                                                            onChange={(e) => changeFile(e)}
                                                        />
                                                        <label
                                                            htmlFor="attach"
                                                            id="labelFile"
                                                            className={cx('custom-file-label')}
                                                        >
                                                            Choose file
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button
                                                    type="button"
                                                    className={cx('close', 'pc-1')}
                                                    onClick={clickClose}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                {path.includes('/users/contracts/create') ? (
                                                    <button
                                                        type="submit"
                                                        className={cx('btn', 'btn-success')}
                                                        onClick={clickAdd}
                                                    >
                                                        Thêm mới
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        className={cx('btn', 'btn-success')}
                                                        onClick={clickUpdate}
                                                    >
                                                        Lưu
                                                    </button>
                                                )}
                                                <button
                                                    type="reset"
                                                    className={cx('btn', 'btn-default')}
                                                    onClick={clickReset}
                                                >
                                                    Nhập lại
                                                </button>
                                                <a href={routes.userContracts}>
                                                    <button type="button" className={cx('btn', 'btn-danger')}>
                                                        Thoát
                                                    </button>
                                                </a>
                                                &nbsp;
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
