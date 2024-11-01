import classNames from 'classnames/bind';
import { useEffect } from 'react';

import styles from './create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Role() {
    const { state, redirectLogin, refresh, checkRole } = useAuth();
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

        return selectedValues;
    };

    const handleClickAdd = () => {
        const selectedValues = getInput();
        saveRoles(selectedValues);
    };

    const saveRoles = async (selectedValues) => {
        const nameRole = document.querySelector('#name-role');
        const alert = document.querySelector(`.${cx('alert')}`);
        const alertCt = document.querySelector(`.${cx('alert-content')}`);

        if (nameRole.value !== '') {
            const response = await fetch(`${BASE_URL}roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({
                    name: nameRole.value.toUpperCase(),
                    des: nameRole.value,
                    permissions: selectedValues,
                }),
            });
            const data = await response.json();
            if (data.code === 303) {
                alert.classList.add(`${cx('alert-success')}`);
                alert.classList.remove(`${cx('alert-danger')}`);
                alert.classList.remove(`${cx('hidden')}`);
                alertCt.textContent = 'Thêm dữ liệu thành công';
                setTimeout(() => {
                    document.querySelector('#formReset').reset();
                    clickClose();
                }, 3000);
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
    };

    const getRole = async () => {
        if (path.includes('roles')) return '';
        const nameRole = document.querySelector('#name-role');

        nameRole.setAttribute('readonly', true);

        const response = await fetch(`${BASE_URL}roles/role?name=${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${state.user}`,
            },
        });
        const data = await response.json();
        if (data.result) {
            const dataFill = data.result;
            nameRole.value = dataFill.name;

            const checkboxes = document.querySelectorAll('input[name="authorizations[]"]');
            if (dataFill.permissions[0] && dataFill.permissions[0].name === 'ALL') handleClickRole(true);
            else {
                const permissionNames = dataFill.permissions.map((item) => item.name);
                checkboxes.forEach((checkbox) => {
                    if (permissionNames.includes(checkbox.value.toUpperCase())) {
                        checkbox.checked = true;
                    }
                });
            }
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'PERM_ADD', true);
            await getRole();
        })();
    }, [state.isAuthenticated, state.loading]);

    const clickUpdate = () => {
        const selectedValues = getInput();
        handleClickUpdate(selectedValues);
    };

    const handleClickUpdate = async (selectedValues) => {
        const nameRole = document.querySelector('#name-role');
        const alert = document.querySelector(`.${cx('alert')}`);
        const alertCt = document.querySelector(`.${cx('alert-content')}`);

        const response = await fetch(`${BASE_URL}roles?name=${nameRole.value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${state.user}`,
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
            refresh(state.user);
        } else if (data.code === 502) {
            alert.classList.add(`${cx('alert-danger')}`);
            alert.classList.remove(`${cx('hidden')}`);
            alertCt.textContent = 'Cập nhật thất bại';
        }
    };

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
                        <div className={cx('pc-12', 'm-12')}>
                            <div className={cx('card')}>
                                <div className={cx('card-header', 'with-border')}>
                                    <p className={cx('card-title')}>
                                        Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt buộc
                                    </p>
                                </div>

                                <form id="formReset" onSubmit={(e) => handleSubmitForm(e)}>
                                    <div className={cx('card-body')}>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'm-4', 'control-label')}>
                                                Tên quyền<span className={cx('text-red')}> *</span>
                                            </label>
                                            <div className={cx('pc-8', 'm-8')}>
                                                <input className={cx('form-control')} id="name-role" type="text" name="name" placeholder="VD: Quản lý" />
                                            </div>
                                        </div>
                                        <div className={cx('well')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}></label>
                                                <div className={cx('controls', 'pc-9', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="check_all" id="check_all" value="all" onClick={(e) => clickRole(e)} />
                                                        Toàn quyền
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Bảng lương</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="sala_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="sala_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="sala_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="sala_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Cài đặt chung</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="set_set" />
                                                        cài đặt
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Cấu trúc công ty</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="comp_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="comp_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="comp_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="comp_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Chấm công</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_delete" />
                                                        Xoá
                                                    </label>
                                                    {/* &emsp;
                                                    <label className={cx('fl')}>
                                                        <input
                                                            type="checkbox"
                                                            name="authorizations[]"
                                                            value="attd_upload"
                                                        />
                                                        uploadFile
                                                    </label> */}
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_viewTime" />
                                                        Bảng thời gian
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_approvals" />
                                                        Duyệt chấm công
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Công thức tính lương</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="calc_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="calc_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="calc_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="calc_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Danh mục lương</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="catg_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="catg_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="catg_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="catg_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Danh mục nghỉ</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="leav_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="leav_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="leav_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="leav_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Đơn xin nghỉ</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_approvals" />
                                                        Duyệt đơn xin nghỉ
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Hợp đồng</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="cont_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="cont_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="cont_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="cont_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Lịch sử nghỉ phép</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="hist_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Lương cập nhật theo tháng</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="saup_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="saup_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="saup_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="saup_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Lương cố định</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="safi_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="safi_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="safi_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="safi_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Nghỉ lễ</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="holi_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="holi_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="holi_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="holi_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Người dùng hệ thống</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="user_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="user_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="user_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="user_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="user_rspass" />
                                                        Reset password
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Phân quyền</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="perm_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="perm_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="perm_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="perm_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Tài khoản ngân hàng</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="bank_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="bank_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="bank_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="bank_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Ứng lương</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_delete" />
                                                        Xoá
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_approvals" />
                                                        Duyệt ứng lương
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4')}>Văn phòng</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="off_view" />
                                                        Danh sách
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="off_add" />
                                                        Thêm mới
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="off_edit" />
                                                        Sửa
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="off_delete" />
                                                        Xoá
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
                                        <div className={cx('text-center')}>
                                            {path.includes('/roles') ? (
                                                <button className={cx('btn', 'btn-success')} onClick={handleClickAdd}>
                                                    Thêm mới
                                                </button>
                                            ) : (
                                                <button className={cx('btn', 'btn-info')} onClick={clickUpdate}>
                                                    Lưu lại
                                                </button>
                                            )}
                                            <button type="reset" className={cx('btn', 'btn-danger')}>
                                                Nhập lại
                                            </button>
                                            <a href={routes.role}>
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
                </section>
            </div>
        </>
    );
}

export default Role;
