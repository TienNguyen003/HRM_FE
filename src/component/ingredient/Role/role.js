import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import styles from './role.module.scss';
import routes from '../../../config/routes';
import { urlPattern } from '../../../config/config';
import { isCheck } from '../../globalstyle/checkToken';

const cx = classNames.bind(styles);

function Role() {
    (async function () {
        await isCheck();
    })();

    const [roles, setRoles] = useState([]);
    const [nameParam, setNameParam] = useState('');
    const token = localStorage.getItem('authorizationData') || '';

    // lấy role
    async function fetchData() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search') || 1;
        const name = (urlParams.get('name') || '').toUpperCase();

        setNameParam(name);
        try {
            const response = await fetch(`${urlPattern}roles?pageNumber=${searchParam}&name=${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            setRoles(data.result);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
            // Xử lý lỗi tại đây (ví dụ: hiển thị thông báo cho người dùng)
        }
    }

    useEffect(() => {
        (async function () {
            await fetchData();
        })();
        
    }, [token]);

    const clickDelete = async (event, name) => {
        event.preventDefault();
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(name);
    };

    async function handleClickDelete(name) {
        try {
            const response = await fetch(`${urlPattern}roles?name=${name}`, {
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
                console.log(window.location.reload());
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
                                Phân quyền <small>Danh sách</small>
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
                                                        <div className={cx('row', 'no-gutters', 'form-group', 'mb-0')}>
                                                            <div className={cx('pc-3')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control', 'form-control-sm')}
                                                                    placeholder="Thuộc module"
                                                                    name="name"
                                                                    value={nameParam}
                                                                    onChange={(e) =>
                                                                        setNameParam(e.target.value.toUpperCase())
                                                                    }
                                                                />
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
                                                <a className={cx('btn')} href={routes.roleCreate}>
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
                                                    <th className={cx('text-center')}>Thuộc module</th>
                                                    <th className={cx('text-center')}>Mô tả</th>
                                                    <th className={cx('text-center')}>Sửa</th>
                                                    <th className={cx('text-center')}>Xóa</th>
                                                </tr>
                                                {roles.map((item, index) => (
                                                    <tr
                                                        key={item.name}
                                                        className={cx('record-data')}
                                                        id={`record-${item.name}`}
                                                        data-id={item.name}
                                                        data-table="roles"
                                                    >
                                                        <td className={cx('text-center')}>{index + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.des}</td>
                                                        <td className={cx('text-center')}>
                                                            <a
                                                                className={cx('edit-record')}
                                                                href={routes.roleEdit.replace(':name', item.name)}
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </a>
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a
                                                                className={cx('delete-record')}
                                                                onClick={(e) => clickDelete(e, item.name)}
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
                                                    Hiển thị <b>{roles.length}</b> dòng / tổng <b>{roles.length}</b>
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

export default Role;
