import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../../list.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { Page } from '../../../layout/pagination/pagination';
import { Status } from '../../../layout/status/status';
import { useAuth } from '../../../../untils/AuthContext';
import { WebSocketService } from '../../../../untils/WebSocketService';

const cx = classNames.bind(styles);

function Bank() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const [bank, setBank] = useState([]);
    const [page, setPage] = useState([]);
    const [sortOrder, setSortOrder] = useState({
        name: 'desc',
        nameBank: 'desc',
        owner: 'desc',
        numberBank: 'desc',
        priority: 'desc',
    });
    const location = useLocation();

    //lấy thông tin ngân hàng
    const fetchData = async (id = '', sort = 'id', desc = 'asc') => {
        const urlParams = new URLSearchParams(window.location.search);

        const params = {
            pageNumber: urlParams.get('page') || 1,
            name: urlParams.get('name') || '',
            priority: urlParams.get('priority') || '',
            nameBank: urlParams.get('nameBank') || '',
            status: urlParams.get('status') || '',
            id,
            sort,
            desc,
        };

        document.querySelector('#name').value = params.name;
        document.querySelector('#bank').value = params.nameBank;
        document.querySelector('#status').querySelector(`option[value="${params.status}"]`).selected = true;
        document.querySelector('#prioritize').querySelector(`option[value="${params.priority}"]`).selected = true;

        try {
            const response = await fetch(`${BASE_URL}bank_accounts?${new URLSearchParams(params)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                setBank(data.result);
                setPage(data.page);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        if (!state.isAuthenticated) redirectLogin();
        else {
            let id = checkRole(state.account.role.name, 'NHÂN VIÊN') ? state.account.employee.id : '';
            (async function () {
                await checkRole(state.account.role.permissions, 'BANK_VIEW', true);
                await new Promise((resolve) => setTimeout(resolve, 1));
                await fetchData(id);
            })();

            const handleWebSocketMessage = () => {
                fetchData(id);
            };

            const cleanup = WebSocketService({
                urlWs: 'bank',
                callback: handleWebSocketMessage,
            });

            return cleanup;
        }
    }, [tableData, state.isAuthenticated, state.loading, location]);

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
                    Authorization: `Bearer ${state.user}`,
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
            const response = await fetch(`${BASE_URL}bank_accounts/stt?id=${id}&status=${status}`, {
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

    const handleSort = (value, desc) => {
        setSortOrder((prev) => {
            const newSortOrder = { ...prev, [value]: desc };
            return newSortOrder;
        });
        let id = checkRole(state.account.role.name, 'NHÂN VIÊN') ? state.account.employee.id : '';
        let sort = value == 'name' ? 'employee.name' : value;
        fetchData(id, sort, desc);
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                {t('common.Bank Account')} <small>{t('common.List')}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-10', 'm-12', 't-10')}>
                                                <div id="search">
                                                    <form>
                                                        <div className={cx('row', 'no-gutters', 'form-group')}>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    id="name"
                                                                    className={cx('form-control')}
                                                                    name="name"
                                                                    placeholder={t('common.Name')}
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    id="bank"
                                                                    className={cx('form-control')}
                                                                    name="nameBank"
                                                                    placeholder={t('common.Bank Name')}
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} id="prioritize" name="priority">
                                                                    <option value="">-- {t('common.Prioritize')} --</option>
                                                                    <option value="1">1</option>
                                                                    <option value="2">2</option>
                                                                    <option value="3">3</option>
                                                                    <option value="4">4</option>
                                                                    <option value="5">5</option>
                                                                </select>
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select id="status" className={cx('form-control', 'select')} name="status">
                                                                    <option value="">-- {t('common.Status')} --</option>
                                                                    <option value="0">{t('common.No Active')}</option>
                                                                    <option value="1">{t('common.Active')}</option>
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
                                            {checkRole(state.account.role.permissions, 'BANK_ADD') && (
                                                <div className={cx('pc-2', 'text-right')}>
                                                    <a href={routes.userBankCreate} className={cx('btn')}>
                                                        <i className={cx('fa fa-plus')}></i>
                                                        &nbsp;{t('common.button.create')}
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
                                                    <th className={cx('text-center')}>
                                                        {t('common.Name')} &nbsp;
                                                        <i
                                                            className={cx('fa-solid fa-chevron-up', { hidden: sortOrder.name === 'desc' })}
                                                            onClick={() => handleSort('name', 'desc')}
                                                        ></i>
                                                        <i
                                                            className={cx('fa-solid fa-chevron-down', { hidden: sortOrder.name === 'asc' })}
                                                            onClick={() => handleSort('name', 'asc')}
                                                        ></i>
                                                    </th>

                                                    <th className={cx('text-center')}>
                                                        {t('common.Bank Name')} &nbsp;
                                                        <i
                                                            className={cx('fa-solid fa-chevron-up', { hidden: sortOrder.nameBank === 'desc' })}
                                                            onClick={() => handleSort('nameBank', 'desc')}
                                                        ></i>
                                                        <i
                                                            className={cx('fa-solid fa-chevron-down', { hidden: sortOrder.nameBank === 'asc' })}
                                                            onClick={() => handleSort('nameBank', 'asc')}
                                                        ></i>
                                                    </th>

                                                    <th className={cx('text-center', 'm-0')}>
                                                        {t('common.Owner')} &nbsp;
                                                        <i
                                                            className={cx('fa-solid fa-chevron-up', { hidden: sortOrder.owner === 'desc' })}
                                                            onClick={() => handleSort('owner', 'desc')}
                                                        ></i>
                                                        <i
                                                            className={cx('fa-solid fa-chevron-down', { hidden: sortOrder.owner === 'asc' })}
                                                            onClick={() => handleSort('owner', 'asc')}
                                                        ></i>
                                                    </th>

                                                    <th className={cx('text-center', 'm-0')}>
                                                        {t('common.Bank Number')} &nbsp;
                                                        <i
                                                            className={cx('fa-solid fa-chevron-up', { hidden: sortOrder.numberBank === 'desc' })}
                                                            onClick={() => handleSort('numberBank', 'desc')}
                                                        ></i>
                                                        <i
                                                            className={cx('fa-solid fa-chevron-down', { hidden: sortOrder.numberBank === 'asc' })}
                                                            onClick={() => handleSort('numberBank', 'asc')}
                                                        ></i>
                                                    </th>

                                                    <th className={cx('text-center', 'm-0')}>
                                                        {t('common.Prioritize')} &nbsp;
                                                        <i
                                                            className={cx('fa-solid fa-chevron-up', { hidden: sortOrder.priority === 'desc' })}
                                                            onClick={() => handleSort('priority', 'desc')}
                                                        ></i>
                                                        <i
                                                            className={cx('fa-solid fa-chevron-down', { hidden: sortOrder.priority === 'asc' })}
                                                            onClick={() => handleSort('priority', 'asc')}
                                                        ></i>
                                                    </th>
                                                    {checkRole(state.account.role.permissions, 'BANK_EDIT') && (
                                                        <>
                                                            <th className={cx('text-center')}>{t('common.Status')}</th>
                                                            <th className={cx('text-center')}>{t('common.Edit')}</th>
                                                        </>
                                                    )}
                                                    {checkRole(state.account.role.permissions, 'BANK_DELETE') && (
                                                        <th className={cx('text-center')}>{t('common.Delete')}</th>
                                                    )}
                                                </tr>
                                                {bank.map((item, index) => (
                                                    <tr className={cx('record-data')} key={index}>
                                                        <td className={cx('text-center')}>{(+page.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>{item.employee.name}</td>
                                                        <td>{item.nameBank}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.owner}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.numberBank}</td>
                                                        <td className={cx('text-center', 'm-0')}>{item.priority}</td>
                                                        {checkRole(state.account.role.permissions, 'BANK_EDIT') && (
                                                            <>
                                                                <td>
                                                                    <Status id={item.id} isStatus={item.status} handleChange={(e) => changeStatus(e)} />
                                                                </td>
                                                                <td className={cx('text-center')}>
                                                                    <a href={routes.userBankEdit.replace(':name', item.id)} className={cx('edit-record')}>
                                                                        <i className={cx('fas fa-edit')}></i>
                                                                    </a>
                                                                </td>
                                                            </>
                                                        )}
                                                        {checkRole(state.account.role.permissions, 'BANK_DELETE') && (
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

export default Bank;
