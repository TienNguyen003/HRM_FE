import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../../list.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { formatter, getSalaryCate } from '../../ingredient';
import { Page } from '../../../layout/pagination/pagination';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Static_values() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const [salary, setSalary] = useState([]);
    const [salaryCate, setSalaryCate] = useState([]);
    const [page, setPage] = useState([]);
    const location = useLocation();

    const getSalary = async (id) => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 1;
        const name = urlParams.get('name') || '';
        const category_id = urlParams.get('category_id') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#category_id').querySelector('option[value="' + category_id + '"]').selected = true;

        try {
            const response = await fetch(
                `${BASE_URL}salary_static_values?pageNumber=${page}&type=Lương cố định&name=${name}&wageCategories=${category_id}&id=${id}`,
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
                setSalary(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'SAFI_VIEW', true);
            await getSalaryCate('Lương cố định', state.user).then((result) => setSalaryCate(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getSalary(checkRole(state.account.role.name, 'NHÂN VIÊN') ? state.account.employee.id : '');
        })();
    }, [tableData, state.isAuthenticated, state.loading, location]);

    const clickDelete = async (id) => {
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(id);
    };

    const handleClickDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}salary_static_values?wageId=${id}`, {
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
                            {t('common.Fixed Salary')} <small>{t('common.List')}</small>
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
                                                                <input type="text" className={cx('form-control')} name="name" id="name" placeholder={t('common.Name')} />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} name="category_id" id="category_id">
                                                                    <option value="">-- {t('common.Salary Categories')} --</option>
                                                                    {salaryCate.map((item) => (
                                                                        <option key={item.id} value={item.id}>
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
                                            {checkRole(state.account.role.permissions, 'SAFI_ADD') && (
                                                <div className={cx('pc-2', 'text-right')}>
                                                    <a href={routes.salaryCreate} className={cx('btn')}>
                                                        <i className={cx('fa fa-plus')}></i> {t('common.button.create')}
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
                                                    <th className={cx('text-center')}>{t('common.Name')}</th>
                                                    <th className={cx('text-center')}>{t('common.Salary Categories')}</th>
                                                    <th className={cx('text-center')}>{t('common.Money')}</th>
                                                    {checkRole(state.account.role.permissions, 'SAFI_EDIT') && <th className={cx('text-center')}>{t('common.Edit')}</th>}
                                                    {checkRole(state.account.role.permissions, 'SAFI_DELETE') && <th className={cx('text-center')}>{t('common.Delete')}</th>}
                                                </tr>
                                                {salary.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className={cx('text-center')}>{(+page.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td className={cx('text-center')}>{item.wageCategories.name}</td>
                                                        <td className={cx('text-center')}>{formatter.format(item.salary)}</td>
                                                        {checkRole(state.account.role.permissions, 'SAFI_EDIT') && (
                                                            <td className={cx('text-center')}>
                                                                <a href={routes.salaryEdit.replace(':name', item.employee.id)} className={cx('edit-record')}>
                                                                    <i className={cx('fas fa-edit')}></i>
                                                                </a>
                                                            </td>
                                                        )}
                                                        {checkRole(state.account.role.permissions, 'SAFI_DELETE') && (
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
                                            <div className={cx('pc-7')}>
                                                <p>
                                                {t('common.Show')} <b>{page.totalItemsPerPage}</b> / <b>{page.totalItems}</b> {t('common.Row')}
                                                </p>
                                            </div>
                                            <div className={cx('pc-5')}>
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

export default Static_values;
