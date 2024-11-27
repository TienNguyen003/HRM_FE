import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import Load from '../../../globalstyle/Loading/load';
import { BASE_URL } from '../../../../config/config';
import { getAllUser, handleAlert, getUser } from '../../ingredient';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

export default function Create() {
    const { state, redirectLogin, checkRole } = useAuth();
    const [user, setUser] = useState([]);

    const path = window.location.pathname.replace('/users/contracts/edit/', '');

    const getContract = async () => {
        const user_id = document.querySelector('#user_id');
        const fileName = document.getElementById('labelFile');
        const linkFile = document.getElementById('linkFile');
        const start = document.querySelector('#start');
        const end = document.querySelector('#end');

        if (path.includes('/users/contracts')) return '';
        try {
            const response = await fetch(`${BASE_URL}contracts/contracts?contractsId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                const dataRs = data.result;

                fileName.textContent = dataRs.urlFile ? dataRs.urlFile : 'Choose File';
                user_id.querySelector('option[value="' + dataRs.employee.id + '"]').selected = true;
                start.value = dataRs.hire_date;
                end.value = dataRs.dismissal_date;
                linkFile.value = dataRs.linkFile;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'CONT_ADD', true);
            if (checkRole(state.account.role.name, 'NHÂN VIÊN')) getUser(state.user, state.account.id).then((result) => setUser([result]));
            else await getAllUser(state.user).then((result) => setUser(result));
            await getContract();
        })();
    }, [state.isAuthenticated, state.loading]);

    // api them
    const saveContract = async (hire_date, dismissal_date, employeeId, urlFile, linkFile, method = 'POST') => {
        let url = `${BASE_URL}contracts`;
        if (method === 'PUT') url += `?contractsId=${path}`;
        try {
            const response = await fetch(`${url}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({
                    urlFile,
                    employeeId,
                    linkFile,
                    hire_date,
                    dismissal_date,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thêm thành công');
                setTimeout(() => {
                    if (method === 'POST') {
                        document.querySelector('#formReset').reset();
                    }
                    clickClose();
                }, 3000);
            } else handleAlert('alert-danger', 'Thêm thất bại');
        } catch (error) {
            console.log(error);
        }
    };

    // them hop dong
    const clickAdd = () => {
        const user_id = document.querySelector('#user_id').value;
        const file = document.getElementById('attach').files[0];
        const linkFile = document.getElementById('linkFile').value;
        const start = document.querySelector('#start');
        const end = document.querySelector('#end');
        let nameFile;
        if (file) {
            nameFile = file.name;
        }
        if (start.value === '') handleAlert('alert-danger', 'Ngày bắt đầu không được để trống');
        else if (end.value !== '' && end.value <= start.value) handleAlert('alert-danger', 'Ngày kết thúc phải lớn hơn ngày bắt đầu');
        else {
            let dismissal_date = end.value == '' ? null : end.value;
            saveContract(start.value, dismissal_date, user_id, nameFile, linkFile);
        }
    };

    // update hop dong
    const clickUpdate = () => {
        let file = document.getElementById('labelFile').textContent;
        const user_id = document.querySelector('#user_id').value;
        const linkFile = document.getElementById('linkFile').value;
        const start = document.querySelector('#start');
        const end = document.querySelector('#end');
        if (file === 'Choose File') file = '';
        if (start.value === '') handleAlert('alert-danger', 'Ngày bắt đầu không được để trống');
        else if (end.value !== '' && end.value <= start.value) handleAlert('alert-danger', 'Ngày kết thúc phải lớn hơn ngày bắt đầu');
        else {
            saveContract(start.value, end.value, user_id, file, linkFile, 'PUT');
        }
    };

    // an nut nhap lai
    const clickReset = () => {
        document.querySelector('#labelFile').textContent = 'Choose file';
    };

    // them file
    const changeFile = async (e) => {
        const lable = document.querySelector('#labelFile');
        let linkFile;
        const modalLoad = document.querySelector('#modal-load');
        const load = document.querySelector('#load');
        load.classList.toggle(`${cx('hidden')}`);
        modalLoad.classList.toggle(`${cx('hidden')}`);
        await uploadImage().then((result) => (linkFile = result));
        lable.textContent = e.target.value.split('\\').pop();
        document.getElementById('linkFile').value = linkFile;
    };

    // upload cloudinary
    const uploadImage = async () => {
        var fileInput = document.getElementById('attach');
        var file = fileInput.files[0];

        if (file) {
            var formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'cgklkmau');

            try {
                const response = await fetch('https://api.cloudinary.com/v1_1/dwn20guz0/auto/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                const load = document.querySelector('#load');
                load.classList.toggle(`${cx('hidden')}`);
                return data.url;
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Please select an image file.');
        }
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
            <Load className={cx('hidden')} id='load' />
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Hợp đồng <small>Thêm mới</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>
                                            Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt buộc
                                        </p>
                                    </div>

                                    <form onSubmit={(e) => handleSubmitForm(e)} id="formReset">
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    Họ tên<span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select name="user_id" id="user_id" className={cx('form-control', 'select')}>
                                                        {user.map((item) => (
                                                            <option key={item.id} value={item.employee.id}>
                                                                {item.employee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    Bắt đầu<span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input type="date" className={cx('form-control')} id="start"></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>Kết thúc</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input type="date" className={cx('form-control')} id="end"></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>Tệp đính kèm</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <div className={cx('custom-file')}>
                                                        <input type="file" className={cx('custom-file-input')} id="attach" onChange={(e) => changeFile(e)} />
                                                        <input type="text" id="linkFile" hidden defaultValue="" />
                                                        <label htmlFor="attach" id="labelFile" className={cx('custom-file-label')}>
                                                            Choose file
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11', 'm-11', 't-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button type="button" className={cx('close', 'pc-1')} onClick={clickClose}>
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                {path.includes('/users/contracts/create') ? (
                                                    <button type="submit" className={cx('btn', 'btn-success')} onClick={clickAdd}>
                                                        Thêm mới
                                                    </button>
                                                ) : (
                                                    <button type="submit" className={cx('btn', 'btn-success')} onClick={clickUpdate}>
                                                        Lưu
                                                    </button>
                                                )}
                                                <button type="reset" className={cx('btn', 'btn-danger')} onClick={clickReset}>
                                                    Nhập lại
                                                </button>
                                                <a href={routes.userContracts}>
                                                    <button type="button" className={cx('btn', 'btn-default')}>
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
