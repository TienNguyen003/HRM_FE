import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from './create.module.scss';
import routes from '../../../../config/routes';
import { urlPattern } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';
import { changePassword, clickAutoPassword, getRoles, getStructures } from '../PasswordUtils';

const cx = classNames.bind(styles);

function Role() {
    (async function () {
        await isCheck();
    })();

    const [structures, setStructures] = useState([]);
    const [roles, setRoles] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/users/edit/', '');

    async function getUsers() {
        if (path.includes('/user')) return '';
        try {
            const response = await fetch(`${urlPattern}users/user?userId=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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
                form.joined_date.value = dataEmp.hire_date;
                form.timekeeper_id.value = dataEmp.vacationTime;
                form.sabbatical.value = dataEmp.vacationHours;
                form.password.value = data.password;
                form.comfirm_password.value = data.password;
                form.role_id.querySelector('option[value="' + dataRs.role.name + '"]').selected = true;
                form.structure_id.querySelector('option[value="' + dataEmp.department.id + '"]').selected = true;
            }
        } catch (error) {
            console.error('Error fetching offices:', error.message);
        }
    }

    useEffect(() => {
        (async function () {
            await getStructures(token).then((result) => setStructures(result));
            await getRoles(token).then((result) => setRoles(result));
            await getUsers();
        })();
    }, []);

    // regex
    const numberRegex = /[0-9]/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const startRgex = /^[.!@#$%^&*()]/;
    const endRegex = /[.!@#$%^&*()]$/;
    const specialRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?\/\\~-]/;

    // css alert
    const handleAlert = (css, content) => {
        const alert = document.querySelector(`.${cx('alert')}`);
        const alertCt = document.querySelector(`.${cx('alert-content')}`);

        alert.setAttribute('class', `${cx('alert')}`);
        alert.classList.remove(`${cx('hidden')}`);
        alert.classList.add(`${cx(css)}`);
        alertCt.textContent = content;
    };

    //save user
    async function saveUser(employeeId, username, password, role) {
        try {
            const response = await fetch(`${urlPattern}users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    roleName: role,
                    employeeId: employeeId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    }
    async function saveEmployee(
        name,
        email,
        phone,
        gender,
        image,
        birthday,
        hireday,
        shift,
        vacationTime,
        hourOff,
        vacationHours,
        departmentId,
        username,
    ) {
        const response = await fetch(`${urlPattern}employee?username=${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone_number: phone,
                gender: gender,
                image: image,
                birth_date: birthday,
                hire_date: hireday,
                shift_id: shift,
                vacationTime: vacationTime,
                hourOff: hourOff,
                vacationHours: vacationHours,
                departmentId: departmentId,
            }),
        });

        const data = await response.json();
        if (data.code === 303) {
            handleAlert('alert-success', 'Thêm dữ liệu thành công');
            return data.result.id;
        } else handleAlert('alert-danger', 'Tên đăng nhập đã tồn tại');
    }

    // lấy input
    const formIp = () => {
        const formData = {
            username: document.querySelector('#username'),
            email: document.querySelector('#email'),
            fullname: document.querySelector('#fullname'),
            phone: document.querySelector('#phone'),
            address: document.querySelector('#address'),
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

        if (form.username.value === '' || form.username.length < 6)
            handleAlert('alert-danger', 'Tên đăng nhập không được để trống');
        else if (startRgex.test(form.username.value) || endRegex.test(form.username.value))
            handleAlert('alert-danger', 'Đầu và cuối tên đăng nhập không được chứa kí tự đặc biệt');
        else if (
            form.email.value === '' ||
            startRgex.test(form.email.value) ||
            endRegex.test(form.email.value) ||
            !emailRegex.test(form.email.value)
        )
            handleAlert('alert-danger', 'Email không đúng định dạng');
        else if (form.fullname.value === '' || numberRegex.test(form.fullname.value))
            handleAlert('alert-danger', 'Tên không được để trống và không được chứa số');
        else if (form.phone.value === '' || specialRegex.test(form.phone.value))
            handleAlert('alert-danger', 'Số điện thoại không đúng định dạng');
        else if (form.address.value === '') handleAlert('alert-danger', 'Địa chỉ không được để trống');
        else if (form.birthday.value === '') handleAlert('alert-danger', 'Ngày sinh không được để trống');
        else if (form.joined_date.value === '') handleAlert('alert-danger', 'Ngày tham gia không được để trống');
        else if (
            form.timekeeper_id.value == '' ||
            !numberRegex.test(form.timekeeper_id.value) ||
            specialRegex.test(form.timekeeper_id.value)
        )
            handleAlert('alert-danger', 'Số giờ nghỉ phép không đúng định dạng');
        else if (
            form.sabbatical.value === '' ||
            !numberRegex.test(form.sabbatical.value) ||
            specialRegex.test(form.sabbatical.value)
        )
            handleAlert('alert-danger', 'Số giờ nghỉ phép không đúng định dạng');
        else if (form.password.value === '') handleAlert('alert-danger', 'Mật khẩu không được để trống');
        else {
            if (form.username.value.includes(' ')) form.username.value = form.username.value.replace(/ /g, '');
            form.username.value = form.username.value
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D');

            const employeeId = saveEmployee(
                form.fullname.value,
                form.email.value,
                form.phone.value,
                1,
                '',
                form.birthday.value,
                form.joined_date.value,
                '',
                form.timekeeper_id.value,
                0,
                form.sabbatical.value,
                +form.structure_id.value,
                form.username.value,
            );
            employeeId
                .then((result) => {
                    if (result) saveUser(result, form.username.value, form.password.value, form.role_id.value);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    // thêm nhân viên
    const clickAddUser = () => {
        handleClickAddUser();
    };

    //đóng alert
    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    return (
        <>
            <div>
                <div className={cx('content-wrapper')}>
                    <section className={cx('content')}>
                        <div className={cx('container-fluid')}>
                            <section className={cx('content-header')}>
                                <h1>
                                    Người dùng hệ thống <small>Thêm mới</small>
                                </h1>
                            </section>
                        </div>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>
                                            Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt
                                            buộc
                                        </p>
                                    </div>

                                    <div className={cx('form-horizontal')}>
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>
                                                    Tên đăng nhập<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        id="username"
                                                        className={cx('form-control')}
                                                        type="text"
                                                        placeholder="tiennguyen"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>Email</label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="email"
                                                        id="email"
                                                        placeholder="example@xxx.yyy"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>Họ tên</label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="text"
                                                        placeholder="Nguyen Van A"
                                                        id="fullname"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>Số điện thoại</label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="text"
                                                        placeholder="0123456789"
                                                        id="phone"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>Ngày sinh</label>
                                                <div className={cx('pc-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input
                                                            type="date"
                                                            className={cx('form-control')}
                                                            id="birthday"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>Địa chỉ</label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="text"
                                                        placeholder="Berlin"
                                                        id="address"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>Ngày gia nhập</label>
                                                <div className={cx('pc-8')}>
                                                    <div className={cx('input-group')}>
                                                        <input
                                                            type="date"
                                                            className={cx('form-control')}
                                                            id="joined_date"
                                                            placeholder="12/07/2024"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>
                                                    Văn phòng làm việc
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <select id="structure_id" className={cx('form-control', 'select')}>
                                                        {structures.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name} - {item.officeI.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>
                                                    Số giờ cần làm<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="text"
                                                        name="timekeeper_id"
                                                        id="timekeeper_id"
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>Số giờ nghỉ phép</label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="text"
                                                        name="sabbatical"
                                                        id="sabbatical"
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>Công thức lương</label>
                                                <div className={cx('pc-8')}>
                                                    <select
                                                        id="salary_formula_id"
                                                        className={cx('form-control', 'select')}
                                                    >
                                                        <option value="1">Công thức cơ bản</option>
                                                        <option value="2">
                                                            Trưởng phòng, Quản lý, Không Chấm Công
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>
                                                    Mật khẩu<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <div className={cx('input-group', 'row', 'no-gutters')}>
                                                        <input
                                                            type="password"
                                                            className={cx('form-control', 'pc-10', 'input-10')}
                                                            id="password"
                                                            placeholder="Nhập mật khẩu hoặc dùng tính năng tạo tự động"
                                                            onChange={(e) => changePassword(e)}
                                                        />
                                                        <span className={cx('input-group-btn', 'pc-2')}>
                                                            <button
                                                                onClick={clickAutoPassword}
                                                                className={cx('btn', 'btn-primary', 'button-2')}
                                                            >
                                                                Tạo tự động
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
                                                <label className={cx('pc-2', 'control-label')}>Nhập lại mật khẩu</label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="password"
                                                        readOnly
                                                        id="comfirm_password"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'control-label')}>
                                                    Phân quyền<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <select id="role_id" className={cx('form-control', 'select')}>
                                                        {roles.map((item) => (
                                                            <option key={item.name} value={item.name}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
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
                                                <button
                                                    type="submit"
                                                    className={cx('btn', 'btn-success')}
                                                    onClick={clickAddUser}
                                                >
                                                    Thêm mới
                                                </button>
                                                &nbsp;
                                                <button type="button" className={cx('btn', 'btn-danger')}>
                                                    <a href={routes.user}>Thoát</a>
                                                </button>
                                                &nbsp;
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
