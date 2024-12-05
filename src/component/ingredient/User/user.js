import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../list.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { getRoles, getStructures } from '../ingredient';
import { Page } from '../../layout/pagination/pagination';
import { Status } from '../../layout/status/status';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function User() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const [structures, setStructures] = useState([]);
    const [roles, setRoles] = useState([]);
    const [user, setUsers] = useState([]);
    const [pages, setPages] = useState([]);
    const location = useLocation();

    //lấy thông tin user
    const fetchData = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('page') || 1;
        const name = urlParams.get('name') || '';
        const department = urlParams.get('department') || '';
        const username = urlParams.get('username') || '';
        const role = urlParams.get('role') || '';
        let parts;
        let departmentName = '';
        let addressName = '';
        if (department !== '') {
            parts = department.split(' - ');
            departmentName = parts[0].trim();
            addressName = parts[1].trim();
        }

        document.querySelector('#name').value = name;
        document.querySelector('#username').value = username;
        document.querySelector('#role_id').querySelector('option[value="' + role + '"]').selected = true;
        document.querySelector('#structure_id').querySelector('option[value="' + department + '"]').selected = true;

        try {
            const response = await fetch(
                `${BASE_URL}users?pageNumber=${searchParam}&name=${name}&department=${departmentName}&username=${username}&role=${role.toUpperCase()}&office=${addressName}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${state.user}`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            if (data.code === 303) {
                setPages(data.page);
                setUsers(data.result);
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'USER_VIEW', true);
            await getStructures(state.user).then((result) => setStructures(result));
            await getRoles(state.user).then((result) => setRoles(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await fetchData();
        })();
    }, [tableData, state.isAuthenticated, state.loading, location]);

    // sự kiện xóa người dùng
    const clickDelete = async (event, name) => {
        event.preventDefault();
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(name);
    };

    // xóa người dùng
    const handleClickDelete = async (name) => {
        try {
            const response = await fetch(`${BASE_URL}users?userId=${name}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();

            if (data.code === 303) if (data.code === 303) setTableData((prevData) => prevData.filter((item) => item.name !== name));
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    const changeStatus = (e) => {
        let isCheck = e.target.checked ? 1 : 0;
        handleChangeStt(isCheck, e.target.id);
    };

    const handleChangeStt = async (status, id) => {
        try {
            const response = await fetch(`${BASE_URL}users/stt?id=${id}&status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                {t('common.Employees')} <small>{t('common.List')}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10', 'm-12')}>
                                                <div id="search">
                                                    <form>
                                                        <input type="hidden" name="search" value="1" />
                                                        <div className={cx('row', 'no-gutters', 'form-group')}>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    id="name"
                                                                    className={cx('form-control', 'form-control-sm')}
                                                                    placeholder={t('common.Name')}
                                                                    name="name"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    id="username"
                                                                    className={cx('form-control', 'form-control-sm')}
                                                                    placeholder={t('common.username')}
                                                                    name="username"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select id="structure_id" name="department" className={cx('form-control', 'select')}>
                                                                    <option value="">-- {t('common.Department')} --</option>
                                                                    {structures.map((item, index) => (
                                                                        <option key={index} value={item.name + ' - ' + item.officeI.name}>
                                                                            {item.name} - {item.officeI.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select id="role_id" name="role" className={cx('form-control', 'select')}>
                                                                    <option value="">-- {t('common.Decentralization')} --</option>
                                                                    {roles.map((item) => (
                                                                        <option key={item.name} value={item.name}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-2')} style={{ height: '36.6px' }}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> {t('common.Search')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a className={cx('btn')} href={routes.userCreate}>
                                                    <i className={cx('fa fa-plus')}></i> {t('common.button.create')}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center', 'm-0')}>{t('common.username')}</th>
                                                    <th className={cx('text-center')}>{t('common.Name')}</th>
                                                    <th className={cx('text-center', 'm-0')}>{t('common.Decentralization')}</th>
                                                    <th className={cx('text-center', 'm-0')}>{t('common.Department')}</th>
                                                    <th className={cx('text-center')}>Reset password</th>
                                                    <th className={cx('text-center')}>{t('common.Status')}</th>
                                                    <th className={cx('text-center')}>{t('common.Edit')}</th>
                                                    <th className={cx('text-center')}>{t('common.Delete')}</th>
                                                </tr>
                                                {user.map((item, index) => (
                                                    <tr key={item.id} id={`record-${item.id}`}>
                                                        <td className={cx('text-center')}>{(+pages.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.username}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.role.name}</td>
                                                        <td className={cx('text-center', 'm-0')}>
                                                            {item.employee.department.name} ({item.employee.department.officeI.name})
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a href={routes.userRsPass.replace(':name', item.id)}>Reset</a>
                                                        </td>
                                                        <td
                                                            style={{
                                                                width: '120px',
                                                            }}
                                                        >
                                                            <Status id={item.id} isStatus={item.status} handleChange={(e) => changeStatus(e)} />
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a className={cx('edit-record')} href={routes.userEdit.replace(':name', item.id)}>
                                                                <i className={cx('fas fa-edit')}></i>
                                                            </a>
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a className={cx('delete-record')} onClick={(e) => clickDelete(e, item.id)}>
                                                                <i className={cx('far fa-trash-alt text-red')}></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={cx('pagination', 'pc-12')}>
                                            <div className={cx('pc-7')}>
                                                <p>
                                                    {t('common.Show')} <b>{pages.totalItemsPerPage}</b> / <b>{pages.totalItems}</b> {t('common.Row')}
                                                </p>
                                            </div>
                                            <div className={cx('pc-5')}>
                                                <Page style={{ float: 'right' }} page={+pages.currentPage} total={+pages.totalPages} />
                                            </div>
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
