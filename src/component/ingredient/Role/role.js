import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../list.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { Page } from '../../layout/pagination/pagination';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Role() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [page, setPage] = useState([]);
    const [nameParam, setNameParam] = useState('');
    const location = useLocation();

    // lấy role
    const fetchData = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('page') || 1;
        const name = (urlParams.get('name') || '').toUpperCase();

        setNameParam(name);
        try {
            const response = await fetch(`${BASE_URL}roles?pageNumber=${searchParam}&name=${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            if (data.code === 303) {
                setRoles(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'PERM_VIEW', true);
            await fetchData();
        })();
    }, [state.user, tableData, state.isAuthenticated, state.loading, location]);

    const clickDelete = async (event, name) => {
        event.preventDefault();
        const result = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (result) handleClickDelete(name);
    };

    const handleClickDelete = async (name) => {
        try {
            const response = await fetch(`${BASE_URL}roles?name=${name}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();

            if (data.code === 303) setTableData((prevData) => prevData.filter((item) => item.name !== name));
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
                                {t('common.Decentralization')} <small>{t('common.List')}</small>
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
                                                        <div className={cx('row', 'no-gutters', 'form-group', 'mb-0')}>
                                                            <div className={cx('pc-3')} style={{ marginRight: '10px' }}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control', 'form-control-sm')}
                                                                    placeholder={t('common.Belonging to module')}
                                                                    name="name"
                                                                    value={nameParam}
                                                                    onChange={(e) => setNameParam(e.target.value.toUpperCase())}
                                                                />
                                                            </div>
                                                            <div className={cx('pc-2')}>
                                                                <button type="submit" className={cx('btn')}>
                                                                    <i className={cx('fa fa-search')}></i> {t('common.Search')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className={cx('pc-2', 'text-right')}>
                                                <a className={cx('btn')} href={routes.roleCreate}>
                                                    <i className={cx('fa fa-plus')}></i> {t('common.button.create')}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body', 'table-responsive')}>
                                        <table className={cx('table')}>
                                            <tbody>
                                                <tr className={cx('non-bg')}>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>{t('common.Belonging to module')}</th>
                                                    <th className={cx('text-center')}>{t('common.Describe')}</th>
                                                    <th className={cx('text-center')}>{t('common.Edit')}</th>
                                                    <th className={cx('text-center')}>{t('common.Delete')}</th>
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
                                                            <a className={cx('edit-record')} href={routes.roleEdit.replace(':name', item.name)}>
                                                                <i className={cx('fas fa-edit')}></i>
                                                            </a>
                                                        </td>
                                                        <td className={cx('text-center')}>
                                                            <a className={cx('delete-record')} onClick={(e) => clickDelete(e, item.name)}>
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

export default Role;
