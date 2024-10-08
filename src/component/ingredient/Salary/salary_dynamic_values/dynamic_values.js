import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../../list.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { isCheck, decodeToken } from '../../../globalstyle/checkToken';
import { formatter, getSalaryCate } from '../../ingredient';
import { Pagination } from '../../../layout/pagination/pagination';

const cx = classNames.bind(styles);

function Static_values() {
    (async function () {
        await isCheck();
        decodeToken(token, 'SAUP_VIEW', true);
    })();

    const [tableData, setTableData] = useState([]);
    const [salary, setSalary] = useState([]);
    const [salaryCate, setSalaryCate] = useState([]);
    const [page, setPage] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const employee = JSON.parse(localStorage.getItem('employee')) || '';

    const getSalary = async (id) => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 1;
        const name = urlParams.get('name') || '';
        const category_id = urlParams.get('category_id') || '';
        const time = urlParams.get('time') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#time').value = time;
        document.querySelector('#category_id').querySelector('option[value="' + category_id + '"]').selected = true;

        try {
            const response = await fetch(
                `${BASE_URL}salary_dynamic_values?pageNumber=${page}&type=Lương theo tháng&name=${name}&wageCategories=${category_id}&time=${time}&id=${id}`,
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
                setSalary(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async function () {
            await getSalaryCate('Lương theo tháng', token).then((result) => setSalaryCate(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getSalary(decodeToken(token, 'ROLE_NHÂN') ? employee.id : '');
        })();
    }, [tableData]);

    const clickDelete = async (id) => {
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(id);
    };

    const handleClickDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}salary_dynamic_values?wageId=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) setTableData((prevData) => prevData.filter((item) => item.id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                Lương theo tháng <small>Danh sách</small>
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
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input type="text" className={cx('form-control')} name="name" id="name" placeholder="Họ tên" />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input type="text" className={cx('form-control')} name="time" id="time" placeholder="Tháng" />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} name="category_id" id="category_id">
                                                                    <option value="">-- Danh mục lương --</option>
                                                                    {salaryCate.map((item) => (
                                                                        <option key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-2')} style={{ height: '36.6px' }}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> Tìm kiếm
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            {decodeToken(token, "SAUP_ADD") && <div className={cx('pc-2', 'text-right')}>
                                                <a href={routes.salaryDynamiCreate} className={cx('btn')}>
                                                    <i className={cx('fa fa-plus')}></i> Thêm mới
                                                </a>
                                            </div>}
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>Họ tên</th>
                                                    <th className={cx('text-center')}>Tháng</th>
                                                    <th className={cx('text-center')}>Danh mục lương</th>
                                                    <th className={cx('text-center')}>Giá trị</th>
                                                    {decodeToken(token, "SAUF_EDIT") && <th className={cx('text-center')}>Sửa</th>}
                                                    {decodeToken(token, "SAUF_DELETE") && <th className={cx('text-center')}>Xóa</th>}
                                                </tr>
                                                {salary.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className={cx('text-center')}>{(+page.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center')}>{item.time}</td>
                                                        <td className={cx('text-center')}>{item.wageCategories.name}</td>
                                                        <td className={cx('text-center')}>{formatter.format(item.salary)}</td>
                                                        {decodeToken(token, "SAUF_EDIT") && <td className={cx('text-center')}>
                                                            <a href={routes.salaryDynamiEdit.replace(':name', item.employee.id)} className={cx('edit-record')}>
                                                                <i className={cx('fas fa-edit')}></i>
                                                            </a>
                                                        </td>}
                                                        {decodeToken(token, "SAUF_DELETE") && <td className={cx('text-center')}>
                                                            <a className={cx('delete-record')} onClick={() => clickDelete(item.id)}>
                                                                <i className={cx('far fa-trash-alt text-red')}></i>
                                                            </a>
                                                        </td>}
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

export default Static_values;
