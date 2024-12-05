import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { reloadAfterDelay } from '../../../globalstyle/checkToken';
import { tooglePass, changePassword, clickAutoPassword, getRoles, getStructures, handleAlert } from '../../ingredient';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Role() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [structures, setStructures] = useState([]);
    const [roles, setRoles] = useState([]);
    const [formula, setFormula] = useState([]);
    const path = window.location.pathname.replace('/users/edit/', '');

    const getUsers = async () => {
        if (path.includes('/user')) return '';
        try {
            const response = await fetch(`${BASE_URL}users/user?userId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch offices');
            }

            const data = await response.json();
            if (data.code === 303) {
                const dataRs = data.result;
                const dataEmp = dataRs.employee;
                const form = formIp();
                form.username.setAttribute('readOnly', true);
                form.username.value = dataRs.username;
                form.email.value = dataEmp.email;
                form.fullname.value = dataEmp.name;
                form.phone.value = dataEmp.phone_number;
                form.birthday.value = dataEmp.birth_date;
                form.joined_date.value = dataEmp.joined_date;
                form.timekeeper_id.value = dataEmp.vacationTime;
                form.sabbatical.value = dataEmp.vacationHours;
                if (checkRole(state.account.role.name, 'NHÂN VIÊN')) {
                    const opRole = new Option(dataRs.role.name, dataRs.role.name);
                    form.role_id.add(opRole);
                    const opStruct = new Option(dataEmp.department.name + ' - ' + dataEmp.department.officeI.name, dataEmp.department.id);
                    form.structure_id.add(opStruct);
                    const opFor = new Option(dataEmp.formula.name, dataEmp.formula.id);
                    form.salary_formula_id.add(opFor);
                } else {
                    form.role_id.querySelector('option[value="' + dataRs.role.name + '"]').selected = true;
                    form.structure_id.querySelector('option[value="' + dataEmp.department.id + '"]').selected = true;
                    form.salary_formula_id.querySelector('option[value="' + dataEmp.formula.id + '"]').selected = true;
                }
            }
        } catch (error) {
            console.error('Error fetching offices:', error.message);
        }
    };

    const getFormula = async () => {
        try {
            const response = await fetch(`${BASE_URL}salary_formulas/get-all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) setFormula(data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'USER_ADD');
            if (!checkRole(state.account.role.name, 'NHÂN VIÊN')) {
                await getFormula();
                await getStructures(state.user).then((result) => setStructures(result));
                await getRoles(state.user).then((result) => setRoles(result));
            }
            await getUsers();
        })();
    }, [state.isAuthenticated, state.loading]);

    // regex
    const numberRegex = /[0-9]/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const startRgex = /^[.!@#$%^&*()]/;
    const endRegex = /[.!@#$%^&*()]$/;
    const specialRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?\/\\~-]/;

    //save user
    const saveUser = async (employeeId, username, password, roleName, method) => {
        let url = '';
        if (method == 'PUT') url = `?userId=${path}`;
        try {
            const response = await fetch(`${BASE_URL}users${url}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({
                    username,
                    password,
                    roleName,
                    employeeId,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thêm dữ liệu thành công');
                if (method == 'POST') reloadAfterDelay(500);
                return data.result.employee;
            } else {
                handleAlert('alert-danger', data.message);
                handleClickDelete(employeeId);
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };
    const saveEmployee = async (
        name,
        email,
        phone_number,
        gender,
        image,
        birth_date,
        joined_date,
        shift_id,
        vacationTime,
        hourOff,
        vacationHours,
        departmentId,
        username,
        formulaId,
        method,
        id = '',
    ) => {
        let url;
        if (method == 'POST') url = `username=${username}`;
        else if (method == 'PUT') url = `id=${id}`;
        const response = await fetch(`${BASE_URL}employee?${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${state.user}`,
            },
            body: JSON.stringify({
                name,
                email,
                phone_number,
                gender,
                image,
                birth_date,
                joined_date,
                shift_id,
                vacationTime,
                hourOff,
                vacationHours,
                departmentId,
                formulaId,
            }),
        });

        const data = await response.json();
        if (data.code === 303) return data.result.id;
        else handleAlert('alert-danger', data.message);
    };

    // lấy input
    const formIp = () => {
        const formData = {
            username: document.querySelector('#username'),
            email: document.querySelector('#email'),
            fullname: document.querySelector('#fullname'),
            phone: document.querySelector('#phone'),
            // address: document.querySelector('#address'),
            birthday: document.querySelector('#birthday'),
            joined_date: document.querySelector('#joined_date'),
            structure_id: document.querySelector('#structure_id'),
            timekeeper_id: document.querySelector('#timekeeper_id'),
            sabbatical: document.querySelector('#sabbatical'),
            salary_formula_id: document.querySelector('#salary_formula_id'),
            password: document.querySelector('#password'),
            comfirm_password: document.querySelector('#comfirm_password'),
            role_id: document.querySelector('#role_id'),
        };

        return formData;
    };

    // validate dữ liệu thêm người dùng
    const handleClickAddUser = () => {
        const form = formIp();

        if (form.username.value === '') handleAlert('alert-danger', 'Tên đăng nhập không được để trống');
        else if (form.username.value.length < 7) handleAlert('alert-danger', 'Tên đăng nhập phải nhiều hơn 6 ký tự');
        else if (form.username.value.includes(' ')) handleAlert('alert-danger', 'Tên đăng nhập không được chứa khoảng trắng');
        else if (startRgex.test(form.username.value) || endRegex.test(form.username.value))
            handleAlert('alert-danger', 'Đầu và cuối không được chứa kí tự đặc biệt');
        else if (form.email.value === '') handleAlert('alert-danger', 'Email không được để trống');
        else if (startRgex.test(form.email.value) || endRegex.test(form.email.value)) handleAlert('alert-danger', 'Đầu và cuối không được chứa kí tự đặc biệt');
        else if (!emailRegex.test(form.email.value)) handleAlert('alert-danger', 'Email không đúng định dạng');
        else if (form.fullname.value.trim() === '') handleAlert('alert-danger', 'Tên không được để trống');
        else if (numberRegex.test(form.fullname.value)) handleAlert('alert-danger', 'Tên không được chứa số');
        else if (specialRegex.test(form.fullname.value)) handleAlert('alert-danger', 'Tên không được chứa ký tự đặc biệt');
        else if (form.phone.value === '') handleAlert('alert-danger', 'Số điện thoại không được để trống');
        else if (specialRegex.test(form.phone.value)) handleAlert('alert-danger', 'Số điện thoại không dược chứa ký tự đặc biệt');
        else if (form.phone.value.includes(' ')) handleAlert('alert-danger', 'Số điện thoại không được chứa khoảng trắng');
        else if (form.phone.value.length !== 10) handleAlert('alert-danger', 'Số điện thoại phải có 10 chữ số');
        // else if (form.address.value === '') handleAlert('alert-danger', 'Địa chỉ không được để trống');
        else if (form.birthday.value === '') handleAlert('alert-danger', 'Ngày sinh không được để trống');
        else if (form.joined_date.value === '') handleAlert('alert-danger', 'Ngày tham gia không được để trống');
        else if (form.timekeeper_id.value === '') handleAlert('alert-danger', 'Số giờ cần làm không được để trống');
        else if (form.timekeeper_id.value <= 0) handleAlert('alert-danger', 'Số giờ cần làm phải lớn hơn 0');
        else if (!numberRegex.test(form.timekeeper_id.value)) handleAlert('alert-danger', 'Số giờ cần làm chỉ được chứa số ');
        else if (specialRegex.test(form.timekeeper_id.value)) handleAlert('alert-danger', 'Số giờ cần làm không được chứa ký tự đặc biệt');
        else if (form.timekeeper_id.value.includes(' ')) handleAlert('alert-danger', 'Số giờ cần làm không được chứa khoảng trắng');
        else if (form.sabbatical.value === '') handleAlert('alert-danger', 'Số giờ nghỉ phép không được để trống');
        else if (!numberRegex.test(form.sabbatical.value)) handleAlert('alert-danger', 'Số giờ nghỉ phép chỉ được chứa số ');
        else if (specialRegex.test(form.sabbatical.value)) handleAlert('alert-danger', 'Số giờ nghỉ phép không được chứa ký tự đặc biệt');
        else if (form.sabbatical.value.includes(' ')) handleAlert('alert-danger', 'Số giờ cần làm không được chứa khoảng trắng');
        else {
            if (form.username.value.includes(' ')) form.username.value = form.username.value.replace(/ /g, '');
            form.username.value = form.username.value
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D');

            if (path.includes('/users/create')) {
                const employeeId = saveEmployee(
                    form.fullname.value.trim(),
                    form.email.value.trim(),
                    form.phone.value.trim(),
                    1,
                    '',
                    form.birthday.value.trim(),
                    form.joined_date.value,
                    '',
                    form.timekeeper_id.value,
                    0,
                    form.sabbatical.value.trim(),
                    +form.structure_id.value.trim(),
                    form.username.value.trim(),
                    form.salary_formula_id.value,
                    'POST',
                );
                employeeId
                    .then((result) => {
                        if (result) saveUser(result, form.username.value.trim(), form.password.value.trim(), form.role_id.value.trim(), 'POST');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } else {
                const user = saveUser('', '', '', form.role_id.value.trim(), 'PUT');
                user.then((result) =>
                    saveEmployee(
                        form.fullname.value.trim(),
                        form.email.value.trim(),
                        form.phone.value.trim(),
                        1,
                        '',
                        form.birthday.value.trim(),
                        form.joined_date.value,
                        '',
                        form.timekeeper_id.value,
                        0,
                        form.sabbatical.value.trim(),
                        +form.structure_id.value.trim(),
                        form.username.value.trim(),
                        form.salary_formula_id.value,
                        'PUT',
                        result.id,
                    ),
                );
                reloadAfterDelay(400);
            }
        }
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    // xóa người dùng
    const handleClickDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}employee?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    // ip username
    const changeUsername = (e) => {
        let username = e.target.value;
        if (username.includes(' ')) username = username.replace(/ /g, '');
        username = username
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
        e.target.value = username;
    };

    return (
        <>
            <div>
                <div className={cx('content-wrapper')}>
                    <section className={cx('content')}>
                        <div className={cx('container-fluid')}>
                            <section className={cx('content-header')}>
                                <h1>
                                    {t('common.Employees')}{' '}
                                    <small>{path.includes('/users/create') ? `${t('common.button.create')}` : `${t('common.Edit')}`}</small>
                                </h1>
                            </section>
                        </div>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>{t('common.Required field')}</p>
                                    </div>

                                    <div className={cx('form-horizontal')}>
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>
                                                    {t('common.username')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input
                                                        id="username"
                                                        className={cx('form-control')}
                                                        type="text"
                                                        placeholder="tiennguyen"
                                                        onChange={(e) => changeUsername(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>Email</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="email" id="email" placeholder="example@xxx.yyy" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>{t('common.Name')}</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" placeholder="Nguyen Van A" id="fullname" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>{t('common.Phone Number')}</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="number" placeholder="0123456789" id="phone" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>{t('common.Birthday')}</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input type="date" className={cx('form-control')} id="birthday" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>Địa chỉ</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" placeholder="Berlin" id="address" />
                                                </div>
                                            </div> */}
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>
                                                    {t('common.Date')} {t('common.Join')}
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input type="date" className={cx('form-control')} id="joined_date" placeholder="12/07/2024" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>{t('common.Department')}c</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="structure_id" className={cx('form-control', 'select')}>
                                                        {!checkRole(state.account.role.name, 'NHÂN VIÊN') &&
                                                            structures.map((item) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.name} - {item.officeI.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>
                                                    {t('common.Hours')} {t('common.Need')} {t('common.Work')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="number"
                                                        name="timekeeper_id"
                                                        id="timekeeper_id"
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>
                                                    {t('common.Hours')} {t('common.Holiday')}
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="number" name="sabbatical" id="sabbatical" defaultValue="0" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>{t('common.Salary Formulas')}</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="salary_formula_id" className={cx('form-control', 'select')}>
                                                        {!checkRole(state.account.role.name, 'NHÂN VIÊN') &&
                                                            formula.map((item) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {path.includes('/users/create') && (
                                                <>
                                                    <div className={cx('form-group', 'row', 'no-gutters')}>
                                                        <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>
                                                            {t('common.password')}
                                                            <span className={cx('text-red')}> *</span>
                                                        </label>

                                                        <div className={cx('pc-8', 'm-8', 't-8')}>
                                                            <div className={cx('input-group', 'row', 'no-gutters')}>
                                                                <div
                                                                    className={cx('pc-10', 'm-12', 't-9', 'input-10')}
                                                                    style={{
                                                                        border: '1px solid #ced4da',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        textAlign: 'center',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="password"
                                                                        className={cx('form-control', 'pc-11', 'm-11', 'input-10')}
                                                                        id="password"
                                                                        placeholder="Nhập mật khẩu hoặc dùng tính năng tạo tự động"
                                                                        onChange={(e) => changePassword(e)}
                                                                        style={{ marginBottom: 0, border: 'unset' }}
                                                                    />
                                                                    <i
                                                                        className={cx('fa-solid fa-eye', 'pc-1')}
                                                                        id="iconShow"
                                                                        onClick={() => tooglePass(true)}
                                                                    ></i>
                                                                    <i
                                                                        className={cx('fa-solid fa-eye-slash', 'pc-1', 'hidden')}
                                                                        id="iconHidden"
                                                                        onClick={() => tooglePass(false)}
                                                                    ></i>
                                                                </div>
                                                                <span className={cx('input-group-btn', 'pc-2')}>
                                                                    <button onClick={clickAutoPassword} className={cx('btn', 'btn-primary', 'button-2')}>
                                                                        {t('common.auto generate')}
                                                                    </button>
                                                                </span>
                                                            </div>
                                                            <div id="strength">
                                                                <span className={cx('result')}></span>
                                                                <span className={cx('str-box')}>
                                                                    <div className={cx('strong-pass')}></div>
                                                                </span>
                                                                <span className={cx('str-box')}>
                                                                    <div className={cx('strong-pass')}></div>
                                                                </span>
                                                                <span className={cx('str-box')}>
                                                                    <div className={cx('strong-pass')}></div>
                                                                </span>
                                                                <span className={cx('str-box')}>
                                                                    <div className={cx('strong-pass')}></div>
                                                                </span>
                                                                <span className={cx('str-box')}>
                                                                    <div className={cx('strong-pass')}></div>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={cx('form-group', 'row', 'no-gutters')}>
                                                        <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>{t('common.re-password')}</label>
                                                        <div className={cx('pc-8', 'm-8', 't-8')}>
                                                            <input className={cx('form-control')} type="password" readOnly id="comfirm_password" />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4', 'control-label')}>
                                                    {t('common.Decentralization')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="role_id" className={cx('form-control', 'select')}>
                                                        {!checkRole(state.account.role.name, 'NHÂN VIÊN') &&
                                                            roles.map((item) => (
                                                                <option key={item.name} value={item.name}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                    </select>
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
                                                <button type="submit" className={cx('btn', 'btn-success')} onClick={handleClickAddUser}>
                                                    {t('common.button.save')}
                                                </button>
                                                <a href={routes.user}>
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
        </>
    );
}

export default Role;
