import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import styles from '../../list.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck, decodeToken } from '../../../globalstyle/checkToken';
import { Pagination } from '../../../layout/pagination/pagination';
import { Status } from '../../../layout/status/status';

const cx = classNames.bind(styles);

function Bank() {
    (async function () {
        await isCheck();
        decodeToken(token, 'BANK_VIEW', true);
    })();

    const [tableData, setTableData] = useState([]);
    const [bank, setBank] = useState([]);
    const [page, setPage] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const employee = JSON.parse(localStorage.getItem('employee')) || '';

    //lấy thông tin ngân hàng
    async function fetchData(id) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search') || 1;
        const name = urlParams.get('name') || '';
        const prioritize = urlParams.get('priority') || '';
        const bank = urlParams.get('nameBank') || '';
        const status = urlParams.get('status') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#bank').value = bank;
        document.querySelector('#status').querySelector('option[value="' + status + '"]').selected = true;
        document.querySelector('#prioritize').querySelector('option[value="' + prioritize + '"]').selected = true;

        try {
            const response = await fetch(
                `${BASE_URL}bank_accounts?pageNumber=${searchParam}&name=${name}&priority=${prioritize}&nameBank=${bank}&status=${status}&id=${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();
            if (data.code === 303) {
                setBank(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    }

    useEffect(() => {
        (async function () {
            await new Promise((resolve) => setTimeout(resolve, 1));
            if (decodeToken(token, 'ROLE_NHÂN')) await fetchData(employee.id);
            else await fetchData('');
        })();
    }, [tableData]);

    // ấn xóa tài khoản ngân hàng
    const clickDelete = async (event, id) => {
        event.preventDefault();
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(id);
    };

    // xóa người dùng
    const handleClickDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}bank_accounts?id=${id}`, {
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

            if (data.code === 303) setTableData((prevData) => prevData.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    }

    const changeStatus = (e) => {
        let isCheck = e.target.checked ? 1 : 0;
        handleChangeStt(isCheck, e.target.id);
    };

    const handleChangeStt = async (status, id) => {
        try {
            const response = await fetch(`${BASE_URL}bank_accounts/stt?id=${id}&status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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
                                Tài khoản ngân hàng <small>Danh sách</small>
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
                                                        <div className={cx('row', 'no-gutters', 'form-group')}>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input type="text" id="name" className={cx('form-control')} name="name" placeholder="Họ tên" />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    id="bank"
                                                                    className={cx('form-control')}
                                                                    name="nameBank"
                                                                    placeholder="Tên ngân hàng"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} id="prioritize" name="priority">
                                                                    <option value="">-- Độ ưu tiên --</option>
                                                                    <option value="1">1</option>
                                                                    <option value="2">2</option>
                                                                    <option value="3">3</option>
                                                                    <option value="4">4</option>
                                                                    <option value="5">5</option>
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select id="status" className={cx('form-control', 'select')} name="status">
                                                                    <option value="">-- Trạng thái --</option>
                                                                    <option value="0">Không hoạt động</option>
                                                                    <option value="1">Hoạt động</option>
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-2')} style={{ height: '36.6px' }}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <FontAwesomeIcon icon={faSearch} />
                                                                    &ensp;Tìm Kiếm
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            {decodeToken(token, 'BANK_ADD') && (
                                                <div className={cx('pc-2', 'text-right')}>
                                                    <a href={routes.userBankCreate} className={cx('btn')}>
                                                        <i className={cx('fa fa-plus')}></i>
                                                        &nbsp;Thêm mới
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={cx('card-body', 'table-responsive')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>Họ tên</th>
                                                    <th className={cx('text-center')}>Tên ngân hàng</th>
                                                    <th className={cx('text-center', 'm-0')}>Chủ tài khoản</th>
                                                    <th className={cx('text-center', 'm-0')}>Số tài khoản</th>
                                                    <th className={cx('text-center', 'm-0')}>Độ ưu tiên</th>
                                                    {decodeToken(token, 'BANK_EDIT') && (
                                                        <>
                                                            <th className={cx('text-center')}>Trạng thái</th>
                                                            <th className={cx('text-center')}>Sửa</th>
                                                        </>
                                                    )}
                                                    {decodeToken(token, 'BANK_DELETE') && <th className={cx('text-center')}>Xoá</th>}
                                                </tr>
                                                {bank.map((item, index) => (
                                                    <tr className={cx('record-data')} key={index}>
                                                        <td className={cx('text-center')}>{(+page.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td>{item.nameBank}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.owner}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.numberBank}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.priority}</td>
                                                        {decodeToken(token, 'BANK_EDIT') && (
                                                            <>
                                                                <td>
                                                                    <Status id={item.id} isStatus={item.status} handleChange={(e) => changeStatus(e)} />
                                                                </td>
                                                                <td className={cx('text-center')}>
                                                                    <a href={routes.userBankEdit.replace(':name', item.id)} className={cx('edit-record')}>
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </a>
                                                                </td>
                                                            </>
                                                        )}
                                                        {decodeToken(token, 'BANK_DELETE') && (
                                                            <td className={cx('text-center')}>
                                                                <a className={cx('delete-record')} onClick={(e) => clickDelete(e, item.id)}>
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </a>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={cx('pagination', 'pc-12')}>
                                            <div className={cx('pc-10')}>
                                                <p>
                                                    Hiển thị <b>{page.totalItemsPerPage}</b> dòng / tổng <b>{page.totalItems}</b>
                                                </p>
                                            </div>
                                            <div className={cx('pc-2')}>
                                                <Pagination currentPage={page.currentPage} totalPages={page.totalPages} />
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

export default Bank;
