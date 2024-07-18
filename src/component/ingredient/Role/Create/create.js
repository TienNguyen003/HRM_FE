import classNames from 'classnames/bind';
import { useEffect } from 'react';

import styles from './create.module.scss';
import routes from '../../../../config/routes';
import { isCheck } from '../../../globalstyle/checkToken';

const cx = classNames.bind(styles);

function Role() {
    (async function checkToken() {
        await isCheck();
    })();

    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/roles/edit/', '');

    const handleClickRole = (isCheck) => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = isCheck;
        });
    };

    const clickRole = (e) => {
        if (e.target.checked) handleClickRole(true);
        else handleClickRole(false);
    };

    const getInput = () => {
        var checkboxes = document.querySelectorAll('input[name="authorizations[]"]');
        var selectedValues = [];

        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                selectedValues.push(checkbox.value.toUpperCase());
            }
        });
        if (selectedValues.length === checkboxes.length) {
            selectedValues = [];
            selectedValues.push('ALL');
        }

        return selectedValues;
    };

    const handleClickAdd = () => {
        const selectedValues = getInput();

        saveRoles(selectedValues);
    };

    async function saveRoles(selectedValues) {
        const nameRole = document.querySelector('#name-role');
        const alert = document.querySelector(`.${cx('alert')}`);
        const alertCt = document.querySelector(`.${cx('alert-content')}`);

        if (nameRole.value !== '') {
            const response = await fetch('http://localhost:8083/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: nameRole.value.toUpperCase(),
                    des: nameRole.value,
                    permissions: selectedValues,
                }),
            });
            const data = await response.json();
            if (data.code === 303) {
                console.log(123);
                alert.classList.add(`${cx('alert-success')}`);
                alert.classList.remove(`${cx('alert-danger')}`);
                alert.classList.remove(`${cx('hidden')}`);
                alertCt.textContent = 'Thêm dữ liệu thành công';
            } else if (data.code === 502) {
                alert.classList.add(`${cx('alert-danger')}`);
                alert.classList.remove(`${cx('alert-success')}`);
                alert.classList.remove(`${cx('hidden')}`);
                alertCt.textContent = 'Tên đã tồn tại';
            }
        } else {
            alert.classList.add(`${cx('alert-danger')}`);
            alertCt.textContent = 'Tên không được để trống';
        }
    }

    useEffect(() => {
        async function getRole() {
            if (path.includes('roles')) return '';
            const nameRole = document.querySelector('#name-role');

            nameRole.setAttribute('readonly', true);

            const response = await fetch(`http://localhost:8083/api/roles/role?name=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.result) {
                const dataFill = data.result;
                nameRole.value = dataFill.name;

                const checkboxes = document.querySelectorAll('input[name="authorizations[]"]');
                if (dataFill.permissions[0] && dataFill.permissions[0].name == 'ALL') handleClickRole(true);
                else {
                    const permissionNames = dataFill.permissions.map((item) => item.name);
                    checkboxes.forEach((checkbox) => {
                        if (permissionNames.includes(checkbox.value.toUpperCase())) {
                            checkbox.checked = true;
                        }
                    });
                }
            }
        }

        getRole();
    }, []);

    const clickUpdate = () => {
        const selectedValues = getInput();
        handleClickUpdate(selectedValues);
    };

    async function handleClickUpdate(selectedValues) {
        const nameRole = document.querySelector('#name-role');
        const alert = document.querySelector(`.${cx('alert')}`);
        const alertCt = document.querySelector(`.${cx('alert-content')}`);

        const response = await fetch(`http://localhost:8083/api/roles?name=${nameRole.value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                des: nameRole.value,
                permissions: selectedValues,
            }),
        });
        const data = await response.json();
        if (data.code === 303) {
            alert.classList.add(`${cx('alert-success')}`);
            alert.classList.remove(`${cx('hidden')}`);
            alertCt.textContent = 'Cập nhật dữ liệu thành công';
        } else if (data.code === 502) {
            alert.classList.add(`${cx('alert-danger')}`);
            alert.classList.remove(`${cx('hidden')}`);
            alertCt.textContent = 'Cập nhật thất bại';
        }
    }

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
                    <section className={cx('content-header')}>
                        <h1>
                            Phân quyền <small>Thêm mới</small>
                        </h1>
                    </section>
                    <div className={cx('row', 'no-gutters')}>
                        <div className={cx('pc-12')}>
                            <div className={cx('card')}>
                                <div className={cx('card-header', 'with-border')}>
                                    <p className={cx('card-title')}>
                                        Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt buộc
                                    </p>
                                </div>

                                <form className={cx('form-horizontal')} onSubmit={(e) => handleSubmitForm(e)}>
                                    <div className={cx('card-body')}>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'control-label')}>
                                                Tên quyền<span className={cx('text-red')}> *</span>
                                            </label>
                                            <div className={cx('pc-8')}>
                                                <input
                                                    className={cx('form-control')}
                                                    id="name-role"
                                                    type="text"
                                                    name="name"
                                                    placeholder="VD: Quản lý"
                                                />
                                            </div>
                                        </div>
                                        <div className={cx('well')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}></label>
                                                <div className={cx('controls', 'pc-9', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="check_all"
                                                            id="check_all"
                                                            value="all"
                                                            onClick={(e) => clickRole(e)}
                                                        />
                                                        &nbsp;Toàn quyền
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Bảng lương</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="sala_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="sala_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="sala_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="sala_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Cài đặt chung</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="set_set"
                                                        />
                                                        &nbsp;cài đặt
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Cấu trúc công ty</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="comp_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="comp_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="comp_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="comp_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Chấm công</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="attd_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="attd_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="attd_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="attd_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="attd_upload"
                                                        />
                                                        &nbsp;uploadFile
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="attd_viewTime"
                                                        />
                                                        &nbsp;Bảng thời gian
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="attd_approvals"
                                                        />
                                                        &nbsp;Duyệt chấm công
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>
                                                    Công thức tính lương
                                                </label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="calc_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="calc_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="calc_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="calc_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Danh mục lương</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="catg_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="catg_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="catg_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="catg_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Danh mục nghỉ</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="leav_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="leav_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="leav_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="leav_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Đơn xin nghỉ</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="req_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="req_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="req_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="req_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="req_approvals"
                                                        />
                                                        &nbsp;Duyệt đơn xin nghỉ
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Hợp đồng</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="cont_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="cont_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="cont_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="cont_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Lịch sử nghỉ phép</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="hist_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>
                                                    Lương cập nhật theo tháng
                                                </label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="saup_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="saup_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="saup_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="saup_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Lương cố định</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="safi_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="safi_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="safi_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="safi_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Nghỉ lễ</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="holi_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="holi_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="holi_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="holi_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>
                                                    Người dùng hệ thống
                                                </label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="user_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="user_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="user_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="user_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="user_rspw"
                                                        />
                                                        &nbsp;Reset password
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Phân quyền</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="perm_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="perm_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="perm_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="perm_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>
                                                    Tài khoản ngân hàng
                                                </label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="bank_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="bank_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="bank_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="bank_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Ứng lương</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="adv_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="adv_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="adv_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="adv_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="avd_approvals"
                                                        />
                                                        &nbsp;Duyệt ứng lương
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2')}>Văn phòng</label>
                                                <div className={cx('controls', 'pc-10', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="off_view"
                                                        />
                                                        &nbsp;Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="off_add"
                                                        />
                                                        &nbsp;Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="off_edit"
                                                        />
                                                        &nbsp;Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="off_delete"
                                                        />
                                                        &nbsp;Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
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
                                        {path.includes('/roles') ? (
                                            <div className={cx('text-center')}>
                                                <button className={cx('btn', 'btn-success')} onClick={handleClickAdd}>
                                                    Thêm mới
                                                </button>
                                                &nbsp;
                                                <button type="reset" className={cx('btn', 'btn-default')}>
                                                    Nhập lại
                                                </button>
                                                &nbsp;
                                                <button type="button" className={cx('btn', 'btn-danger')}>
                                                    <a href={routes.role}>Thoát</a>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={cx('text-center')}>
                                                <button
                                                    name="redirect"
                                                    className={cx('btn', 'btn-info')}
                                                    onClick={clickUpdate}
                                                >
                                                    Lưu lại
                                                </button>
                                                &nbsp;
                                                <button type="button" className={cx('btn', 'btn-danger')}>
                                                    <a href={routes.role}>Thoát</a>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Role;