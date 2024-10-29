import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../list.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { getStructures } from '../ingredient';
import { Pagination } from '../../layout/pagination/pagination';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Checks() {
    const { state, redirectLogin, checkRole } = useAuth();
    const [tableData, setTableData] = useState([]);
    const [time, setTime] = useState([]);
    const [structures, setStructures] = useState([]);
    const [page, setPage] = useState([]);

    const getTime = async (id) => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('search') || 1;
        const name = urlParams.get('name') || '';
        const department = urlParams.get('department') || '';
        const day = urlParams.get('date') || '';
        let parts;
        let departmentName = '';
        let addressName = '';
        if (department !== '') {
            parts = department.split(' - ');
            departmentName = parts[0].trim();
            addressName = parts[1].trim();
        }

        document.querySelector('#name').value = name;
        document.querySelector('#date').value = day;
        document.querySelector('#department').querySelector('option[value="' + department + '"]').selected = true;

        try {
            const response = await fetch(
                `${BASE_URL}checks?pageNumber=${page}&name=${name}&department=${departmentName}&office=${addressName}&day=${day}&id=${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${state.user}`,
                    },
                },
            );

            const data = await response.json();
            if (data.code === 303) {
                setTime(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'ATTD_VIEW', true);
            await getStructures(state.user).then((result) => setStructures(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getTime(checkRole(state.account.role.name, 'NHÂN VIÊN') ? state.account.employee.id : '');
        })();
    }, [tableData, state.isAuthenticated, state.loading]);

    const clickDelete = async (id) => {
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(id);
    };

    const handleClickDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}checks?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
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
                                Chấm công <small>Danh sách</small>
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
                                                                <input type="date" className={cx('form-control')} name="date" id="date" placeholder="Ngày" />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} name="department" id="department">
                                                                    <option value="">-- Phòng ban --</option>
                                                                    {structures.map((item, index) => (
                                                                        <option key={index} value={item.name + ' - ' + item.officeI.name}>
                                                                            {item.name} - {item.officeI.name}
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
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a href={routes.checkCreate} className={cx('btn')}>
                                                    <i className={cx('fa fa-plus')}></i> Thêm mới
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
                                                    <th className={cx('text-center', 'm-0')}>Văn phòng</th>
                                                    <th className={cx('text-center')}>Ngày</th>
                                                    <th className={cx('text-center')}>Giờ</th>
                                                    {checkRole(state.account.role.permissions, 'ATTD_EDIT') && <th className={cx('text-center')}>Sửa</th>}
                                                    {checkRole(state.account.role.permissions, 'ATTD_DELETE') && <th className={cx('text-center')}>Xóa</th>}
                                                </tr>
                                                {time.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className={cx('text-center')}>{(+page.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center', 'm-0')}>
                                                            {item.employee.department.name + ' - ' + item.employee.department.officeI.name}
                                                        </td>
                                                        <td className={cx('text-center')}>{item.date}</td>
                                                        <td className={cx('text-center')}>{item.time}</td>
                                                        {checkRole(state.account.role.permissions, 'ATTD_EDIT') && (
                                                            <td className={cx('text-center')}>
                                                                <a href={routes.checkEdit.replace(':name', item.id)} className={cx('edit-record')}>
                                                                    <i className={cx('fas fa-edit')}></i>
                                                                </a>
                                                            </td>
                                                        )}
                                                        {checkRole(state.account.role.permissions, 'ATTD_DELETE') && (
                                                            <td className={cx('text-center')}>
                                                                <a className={cx('delete-record')} onClick={() => clickDelete(item.id)}>
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

export default Checks;
