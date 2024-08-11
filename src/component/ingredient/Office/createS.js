import React from 'react';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../create.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { isCheck, reloadAfterDelay } from '../../globalstyle/checkToken';
import { handleAlert } from '../ingredient';

const cx = classNames.bind(styles);

export default function Create() {
    (async function () {
        await isCheck();
    })();

    const [office, setOffice] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/offices/structures/edit/', '');

    const getStructure = async () => {
        if (path.includes('/offices/structures/create')) return;
        try {
            const response = await fetch(`${BASE_URL}structures/department?departmentId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                document.querySelector('#name').value = data.result.name;
                document.querySelector('#short').value = data.result.shortName;
                document
                    .querySelector('#belong')
                    .querySelector('option[value="' + data.result.officeI.id + '"]').selected = true;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getOfc = async () => {
        try {
            const response = await fetch(`${BASE_URL}offices/ofc`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) setOffice(data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            await getOfc();
            await getStructure();
        })();
    }, []);

    const handleSave = async (name, officeId, shortName) => {
        try {
            const response = await fetch(`${BASE_URL}structures`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, belongTo: '', officeId, shortName }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thêm thành công');
                reloadAfterDelay(500);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpdate = async (name, officeId, shortName) => {
        try {
            const response = await fetch(`${BASE_URL}structures?departmentId=${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, belongTo: '', officeId, shortName }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Cập nhật thành công!');
                reloadAfterDelay(500);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const saveOffices = () => {
        const name = document.querySelector('#name').value;
        const belong = document.querySelector('#belong').value;
        const short = document.querySelector('#short').value;

        if (name === '') handleAlert('alert-danger', 'Tên không được để trống.');
        else {
            if (path.includes('/offices/structures/create')) handleSave(name, belong, short);
            else handleUpdate(name, belong, short);
        }
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Cấu trúc doanh nghiệp <small>Thêm mới</small>
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
                                                    Thuộc cấp cha<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <select id="belong" className={cx('form-control', 'select')}>
                                                        {office.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Tên cấu trúc<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <input className={cx('form-control')} type="text" id="name" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Tên ngắn<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <input className={cx('form-control')} type="text" id="short" />
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button type="button" className={cx('close')} onClick={clickClose}>
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                <button
                                                    type="submit"
                                                    className={cx('btn', 'btn-success')}
                                                    onClick={saveOffices}
                                                >
                                                    Lưu lại
                                                </button>
                                                <button type="reset" className={cx('btn', 'btn-default')}>
                                                    Nhập lại
                                                </button>
                                                <a href={routes.officeStructures}>
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
        </>
    );
}
