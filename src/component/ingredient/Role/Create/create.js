import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import styles from './create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Role() {
    const { state, redirectLogin, refresh, checkRole } = useAuth();
    const { t } = useTranslation();
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
                            {t('common.Decentralization')} <small>{t('common.button.create')}</small>
                        </h1>
                    </section>
                    <div className={cx('row', 'no-gutters')}>
                        <div className={cx('pc-12', 'm-12', 't-12')}>
                            <div className={cx('card')}>
                                <div className={cx('card-header', 'with-border')}>
                                    <p className={cx('card-title')}>{t('common.Required field')}</p>
                                </div>

                                <form id="formReset" onSubmit={(e) => handleSubmitForm(e)}>
                                    <div className={cx('card-body')}>
                                        <div className={cx('form-group', 'row', 'no-gutters')}>
                                            <label className={cx('pc-2', 'm-4', 't-4', 'control-label')}>
                                                {t('common.Role Name')}
                                                <span className={cx('text-red')}> *</span>
                                            </label>
                                            <div className={cx('pc-8', 'm-8', 't-8')}>
                                                <input className={cx('form-control')} id="name-role" type="text" name="name" placeholder="VD: Quản lý" />
                                            </div>
                                        </div>
                                        <div className={cx('well')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}></label>
                                                <div className={cx('controls', 'pc-9', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="check_all" id="check_all" value="all" onClick={(e) => clickRole(e)} />
                                                        Toàn quyền
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Salary Table')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="sala_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="sala_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="sala_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="sala_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Settings')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="set_set" />
                                                        {t('common.Settings')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Company Structure')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="comp_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="comp_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="comp_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="comp_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Check in')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_delete" />
                                                        {t('common.Delete')}
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
                                                        {t('common.Time Table')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="attd_approvals" />
                                                        {t('common.Approval')} {t('common.Check in')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Salary Formulas')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="calc_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="calc_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="calc_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="calc_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Salary Categories')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="catg_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="catg_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="catg_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="catg_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Holiday Categories')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="leav_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="leav_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="leav_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="leav_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Application for leave')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="req_approvals" />
                                                        {t('common.Approval')} {t('common.Application for leave')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Contract Info')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="cont_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="cont_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="cont_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="cont_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>
                                                    {t('common.History')} {t('common.Leave')}
                                                </label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="hist_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Monthly Salary')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="saup_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="saup_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="saup_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="saup_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Fixed Salary')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="safi_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="safi_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="safi_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="safi_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Holiday')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="holi_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="holi_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="holi_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="holi_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Employees')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="user_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="user_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="user_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="user_delete" />
                                                        {t('common.Delete')}
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
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Decentralization')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="perm_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="perm_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="perm_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="perm_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Bank Account')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="bank_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="bank_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="bank_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="bank_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Salary Advance')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="adv_approvals" />
                                                        {t('common.Approval')} {t('common.Salary Advance')}
                                                    </label>
                                                    &emsp;
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('control-label', 'pc-2', 'm-4', 't-4')}>{t('common.Department')}</label>
                                                <div className={cx('controls', 'pc-10', 'm-8', 't-8', 'list-role')}>
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="off_view" />
                                                        {t('common.List')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="off_add" />
                                                        {t('common.button.create')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="off_edit" />
                                                        {t('common.Edit')}
                                                    </label>
                                                    &emsp;
                                                    <label className={cx('fl')}>
                                                        <input type="checkbox" name="authorizations[]" value="off_delete" />
                                                        {t('common.Delete')}
                                                    </label>
                                                    &emsp;
                                                </div>
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
                                            {path.includes('/roles') ? (
                                                <button className={cx('btn', 'btn-success')} onClick={handleClickAdd}>
                                                    {t('common.button.create')}
                                                </button>
                                            ) : (
                                                <button className={cx('btn', 'btn-info')} onClick={clickUpdate}>
                                                    {t('common.button.save')}
                                                </button>
                                            )}
                                            <button type="reset" className={cx('btn', 'btn-danger')}>
                                                {t('common.button.confluent')}
                                            </button>
                                            <a href={routes.role}>
                                                <button type="button" className={cx('btn', 'btn-default')}>
                                                    {t('common.button.exit')}
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
