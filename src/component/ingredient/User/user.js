import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import styles from './user.module.scss';
import routes from '../../../config/routes';
import { urlPattern } from '../../../config/config';
import { isCheck } from '../../globalstyle/checkToken';
import { getRoles, getStructures } from './PasswordUtils';

const cx = classNames.bind(styles);

function User() {
    (async function () {
        await isCheck();
    })();

    const [structures, setStructures] = useState([]);
    const [roles, setRoles] = useState([]);
    const [user, setUsers] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

    //lấy thông tin user
    async function fetchData() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search') || 1;
        const name = urlParams.get('name') || '';
        const department = urlParams.get('department') || '';
        const username = urlParams.get('username') || '';
        const role = urlParams.get('role') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#username').value = username;
        document.querySelector('#role_id').querySelector('option[value="' + role + '"]').selected = true;
        document.querySelector('#structure_id').querySelector('option[value="' + department + '"]').selected = true;

        try {
            const response = await fetch(
                `${urlPattern}users?pageNumber=${searchParam}&name=${name}&department=${department}&username=${username}&role=${role.toUpperCase()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            setUsers(data.result);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    }

    useEffect(() => {
        (async function () {
            await getStructures(token).then((result) => setStructures(result));
            await getRoles(token).then((result) => setRoles(result));

            await new Promise((resolve) => setTimeout(resolve, 1));

            await fetchData();
        })();
    }, []);

    // sự kiện xóa người dùng
    const clickDelete = async (event, name) => {
        event.preventDefault();
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(name);
    };

    // xóa người dùng
    async function handleClickDelete(name) {
        try {
            const response = await fetch(`${urlPattern}users?userId=${name}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();

            if (data.code === 303) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    }

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Người dùng hệ thống <small>Danh sách</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10')}>
                                                <div id="search">
                                                    <form>
                                                        <input type="hidden" name="search" value="1" />
                                                        <div className={cx('row', 'no-gutters', 'form-group')}>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    id="name"
                                                                    className={cx('form-control', 'form-control-sm')}
                                                                    placeholder="Họ tên"
                                                                    name="name"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    id="username"
                                                                    className={cx('form-control', 'form-control-sm')}
                                                                    placeholder="Tên đăng nhập"
                                                                    name="username"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <select
                                                                    id="structure_id"
                                                                    name="department"
                                                                    className={cx('form-control', 'select')}
                                                                >
                                                                    <option value="">-- Phòng ban --</option>
                                                                    {structures.map((item, index) => (
                                                                        <option key={index} value={item.name}>
                                                                            {item.name} - {item.officeI.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <select
                                                                    id="role_id"
                                                                    name="role"
                                                                    className={cx('form-control', 'select')}
                                                                >
                                                                    <option value="">-- Phân quyền --</option>
                                                                    {roles.map((item) => (
                                                                        <option key={item.name} value={item.name}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-7')}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <FontAwesomeIcon icon={faSearch} />
                                                                    &ensp;Tìm Kiếm
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a className={cx('btn')} href={routes.userCreate}>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                    &ensp;Thêm mới
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body', 'table-responsive')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr className={cx('non-bg')}>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>Tên đăng nhập</th>
                                                    <th className={cx('text-center')}>Họ tên</th>
                                                    <th className={cx('text-center')}>Phân quyền</th>
                                                    <th className={cx('text-center')}>Phòng ban</th>
                                                    <th className={cx('text-center')}>Reset password</th>
                                                    <th className={cx('text-center')}>Trạng thái</th>
                                                    <th className={cx('text-center')}>Sửa</th>
                                                    <th className={cx('text-center')}>Xóa</th>
                                                </tr>
                                                {user.map((item, index) => (
                                                    <tr
                                                        key={item.id}
                                                        className={cx('record-data')}
                                                        id={`record-${item.id}`}
                                                    >
                                                        <td className={cx('text-center')}>{index + 1}</td>
                                                        <td className={cx('text-center')}>{item.username}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center')}>{item.role.name}</td>
                                                        <td className={cx('text-center')}>
                                                            {item.employee.department.name} (
                                                            {item.employee.department.officeI.name})
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a href={routes.userRsPass.replace(':name', item.id)}>
                                                                Reset
                                                            </a>
                                                        </td>
                                                        <td className={cx('text-center')}>1</td>
                                                        <td className={cx('text-center')}>
                                                            <a
                                                                className={cx('edit-record')}
                                                                href={routes.userEdit.replace(':name', item.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </a>
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a
                                                                className={cx('delete-record')}
                                                                onClick={(e) => clickDelete(e, item.id)}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faTrash}
                                                                    className={cx('text-red')}
                                                                />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={cx('clearfix', 'pc-4')}>
                                            <div className={cx('float-left')}>
                                                <p>
                                                    Hiển thị <b>{user.length}</b> dòng / tổng <b>{user.length}</b>
                                                </p>
                                            </div>
                                            <div className={cx('pagination pagination-sm float-right')}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default User;
