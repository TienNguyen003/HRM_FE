import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../user.module.scss';
import routes from '../../../../config/routes';
import { urlPattern } from '../../../../config/config';
import { isCheck } from '../../../globalstyle/checkToken';

const cx = classNames.bind(styles);

function Contract() {
    (async function () {
        await isCheck();
    })();

    const [contracts, setContracts] = useState([]);
    const [page, setPage] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';

    //lấy thông tin hợp đồng
    async function fetchData() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search') || 1;
        const name = urlParams.get('name') || '';
        const status = urlParams.get('status') || '';

        document.querySelector('#user_name').value = name;
        document.querySelector('#status').querySelector('option[value="' + status + '"]').selected = true;

        try {
            const response = await fetch(
                `${urlPattern}contracts?pageNumber=${searchParam}&name=${name}&status=${status}`,
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
            setContracts(data.result);
            setPage(data.page);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    }

    useEffect(() => {
        (async function () {
            await new Promise((resolve) => setTimeout(resolve, 1));

            await fetchData();
        })();
    }, []);

    // ấn xóa hop dong
    const clickDelete = async (event, id) => {
        event.preventDefault();
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(id);
    };

    // xóa hop dong
    async function handleClickDelete(id) {
        try {
            const response = await fetch(`${urlPattern}contracts?id=${id}`, {
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
                                Hợp đồng <small>Danh sách</small>
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
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    id="user_name"
                                                                    name="name"
                                                                    placeholder="Họ tên"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'post-form')}>
                                                                <select
                                                                    className={cx('form-control', 'select')}
                                                                    id="status"
                                                                    name="status"
                                                                >
                                                                    <option value="">-- Trạng thái --</option>
                                                                    <option value="0">Không hoạt động</option>
                                                                    <option value="1">Hoạt động</option>
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-2')}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> Tìm kiếm
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a href={routes.userContractsCreate} className={cx('btn')}>
                                                    <i className={cx('fa fa-plus')}></i>
                                                    &nbsp;Thêm mới
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>Họ tên</th>
                                                    <th className={cx('text-center')}>Ngày bắt đầu</th>
                                                    <th className={cx('text-center')}>Ngày kết thúc</th>
                                                    <th className={cx('text-center')}>Tệp đính kèm</th>
                                                    <th className={cx('text-center')}>Trạng thái</th>
                                                    <th className={cx('text-center')}>Sửa</th>
                                                    <th className={cx('text-center')}>Xóa</th>
                                                </tr>
                                                {contracts.map((item, index) => (
                                                    <tr className={cx('record-data')} key={item.id}>
                                                        <td className={cx('text-center')}>{index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center')}>{item.employee.hire_date}</td>
                                                        <td className={cx('text-center')}>
                                                            {item.employee.dismissal_date}
                                                        </td>
                                                        <td>
                                                            {item.urlFile ? (
                                                                <a>
                                                                    {item.urlFile}&nbsp;
                                                                    <i className={cx('fa fa-fw fa-download')}></i>
                                                                </a>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            {item.status === 1 ? 'ON' : 'OFF'}
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a
                                                                href={routes.userContractsEdit.replace(
                                                                    ':name',
                                                                    item.id,
                                                                )}
                                                                className={cx('edit-record')}
                                                            >
                                                                <i className={cx('fas fa-edit')}></i>
                                                            </a>
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a
                                                                className={cx('delete-record')}
                                                                onClick={(e) => clickDelete(e, item.id)}
                                                            >
                                                                <i className={cx('far fa-trash-alt text-red')}></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={cx('pc-4')}>
                                            <div className={cx('float-left')}>
                                                <p>
                                                    Hiển thị <b>{page.totalItemsPerPage}</b> dòng / tổng{' '}
                                                    <b>
                                                        {page.totalItemsPerPage < 30
                                                            ? page.totalItemsPerPage
                                                            : page.totalItems}
                                                    </b>
                                                </p>
                                            </div>
                                            <div className={cx('pagination', 'float-right')}></div>
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

export default Contract;
