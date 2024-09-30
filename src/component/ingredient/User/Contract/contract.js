import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../list.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck, decodeToken } from '../../../globalstyle/checkToken';
import { Pagination } from '../../../layout/pagination/pagination';
import { Status } from '../../../layout/status/status';

const cx = classNames.bind(styles);

function Contract() {
    (async function () {
        await isCheck();
        decodeToken(token, 'CONT_VIEW', true);
    })();

    const [tableData, setTableData] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [page, setPage] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const employee = JSON.parse(localStorage.getItem('employee')) || '';

    //lấy thông tin hợp đồng
    const fetchData = async (id) => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search') || 1;
        const name = urlParams.get('name') || '';
        const status = urlParams.get('status') || '';

        document.querySelector('#user_name').value = name;
        document.querySelector('#status').querySelector('option[value="' + status + '"]').selected = true;

        try {
            const response = await fetch(`${BASE_URL}contracts?pageNumber=${searchParam}&name=${name}&status=${status}&id=${id}`, {
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
            setContracts(data.result);
            setPage(data.page);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        (async function () {
            await new Promise((resolve) => setTimeout(resolve, 1));
            await fetchData(decodeToken(token, 'ROLE_NHÂN') ? employee.id : '');
        })();
    }, [tableData]);

    // ấn xóa hop dong
    const clickDelete = async (event, id) => {
        event.preventDefault();
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(id);
    };

    // xóa hop dong
    const handleClickDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}contracts?id=${id}`, {
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
    };

    const changeStatus = (e) => {
        let isCheck = e.target.checked ? 1 : 0;
        handleChangeStt(isCheck, e.target.id);
    };

    const handleChangeStt = async (status, id) => {
        try {
            const response = await fetch(`${BASE_URL}contracts/stt?id=${id}&status=${status}`, {
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
                                Hợp đồng <small>Danh sách</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10', 'm-10')}>
                                                <div id="search">
                                                    <form>
                                                        <input type="hidden" name="search" value="1" />
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    id="user_name"
                                                                    name="name"
                                                                    placeholder="Họ tên"
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} id="status" name="status">
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
                                            {decodeToken(token, 'CONT_ADD') && (
                                                <div className={cx('pc-2', 'text-right')}>
                                                    <a href={routes.userContractsCreate} className={cx('btn')}>
                                                        <i className={cx('fa fa-plus')}></i>
                                                        &nbsp;Thêm mới
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>Họ tên</th>
                                                    <th className={cx('text-center', 'm-0')}>Ngày bắt đầu</th>
                                                    <th className={cx('text-center', 'm-0')}>Ngày kết thúc</th>
                                                    <th className={cx('text-center')}>Tệp đính kèm</th>
                                                    {decodeToken(token, 'CONT_EDIT') && (
                                                        <>
                                                            <th className={cx('text-center')}>Trạng thái</th>
                                                            <th className={cx('text-center')}>Sửa</th>
                                                        </>
                                                    )}
                                                    {decodeToken(token, 'CONT_DELETE') && <th className={cx('text-center')}>Xóa</th>}
                                                </tr>
                                                {contracts.map((item, index) => (
                                                    <tr className={cx('record-data')} key={item.id}>
                                                        <td className={cx('text-center')}>{(+page.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.hire_date}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.dismissal_date}</td>
                                                        <td>
                                                            {item.urlFile ? (
                                                                <a href={item.linkFile} target="_blank">
                                                                    {item.urlFile}&nbsp;
                                                                    <i className={cx('fa fa-fw fa-download')}></i>
                                                                </a>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </td>
                                                        {decodeToken(token, 'CONT_EDIT') && (
                                                            <>
                                                                <td>
                                                                    <Status id={item.id} isStatus={item.status} handleChange={(e) => changeStatus(e)} />
                                                                </td>
                                                                <td className={cx('text-center')}>
                                                                    <a href={routes.userContractsEdit.replace(':name', item.id)} className={cx('edit-record')}>
                                                                        <i className={cx('fas fa-edit')}></i>
                                                                    </a>
                                                                </td>
                                                            </>
                                                        )}
                                                        {decodeToken(token, 'CONT_DELETE') && (
                                                            <td className={cx('text-center')}>
                                                                <a className={cx('delete-record')} onClick={(e) => clickDelete(e, item.id)}>
                                                                    <i className={cx('far fa-trash-alt text-red')}></i>
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

export default Contract;
