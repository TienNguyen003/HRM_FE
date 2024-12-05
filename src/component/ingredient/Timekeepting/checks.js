import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../list.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { getStructures } from '../ingredient';
import { Page } from '../../layout/pagination/pagination';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Checks() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const [time, setTime] = useState([]);
    const [structures, setStructures] = useState([]);
    const [page, setPage] = useState([]);
    const location = useLocation();

    const getTime = async (id) => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 1;
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
    }, [tableData, state.isAuthenticated, state.loading, location]);

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
                            {t('common.Check in')} <small>{t('common.List')}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10', 'm-12')}>
                                                <div id="search">
                                                    <form>
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input type="text" className={cx('form-control')} name="name" id="name" placeholder={t('common.Name')} />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input type="date" className={cx('form-control')} name="date" id="date" />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} name="department" id="department">
                                                                    <option value="">-- {t('common.Department')} --</option>
                                                                    {structures.map((item, index) => (
                                                                        <option key={index} value={item.name + ' - ' + item.officeI.name}>
                                                                            {item.name} - {item.officeI.name}
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
                                                <a href={routes.checkCreate} className={cx('btn')}>
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
                                                    <th className={cx('text-center')}>{t('common.Name')}</th>
                                                    <th className={cx('text-center', 'm-0')}>{t('common.Department')}</th>
                                                    <th className={cx('text-center')}>{t('common.Date')}</th>
                                                    <th className={cx('text-center')}>{t('common.Hours')}</th>
                                                    {checkRole(state.account.role.permissions, 'ATTD_EDIT') && <th className={cx('text-center')}>{t('common.Edit')}</th>}
                                                    {checkRole(state.account.role.permissions, 'ATTD_DELETE') && <th className={cx('text-center')}>{t('common.Delete')}</th>}
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
                                        <div className={cx('pagination', 'pc-12', 'm-12', 't-12')}>
                                            <div className={cx('pc-7', 'm-4', 't-7')}>
                                                <p>
                                                {t('common.Show')} <b>{page.totalItemsPerPage}</b> / <b>{page.totalItems}</b> {t('common.Row')}
                                                </p>
                                            </div>
                                            <div className={cx('pc-5', 'm-8', 't-5')}>
                                                <Page style={{ float: 'right' }} page={parseInt(page.currentPage)} total={parseInt(page.totalItems)} />
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
