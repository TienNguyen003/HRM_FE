import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import styles from '../../create.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { getAllUser, getUser, handleAlert } from '../../ingredient';
import { useAuth } from '../../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Bank() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [user, setUser] = useState([]);

    const path = window.location.pathname.replace('/users/bank_account/edit/', '');

    //regex
    const numberRegex = /[0-9]/;
    const specialRegex = /^[a-zA-Z0-9\s]*$/;

    // lấy bank
    const getBank = async () => {
        if (path.includes('/users/bank_account')) return '';
        try {
            const response = await fetch(`${BASE_URL}bank_accounts/bank?id=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                const dataRs = data.result;
                document.querySelector('#prioritize').querySelector('option[value="' + dataRs.priority + '"]').selected = true;
                document.querySelector('#user_id').querySelector('option[value="' + dataRs.employee.id + '"]').selected = true;
                document.querySelector('#bank_name').value = dataRs.nameBank;
                document.querySelector('#bank_account').value = dataRs.owner;
                document.querySelector('#bank_number').value = dataRs.numberBank;
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'BANK_ADD', true);
            if (checkRole(state.account.role.name, 'NHÂN VIÊN')) getUser(state.user, state.account.id).then((result) => setUser([result]));
            else await getAllUser(state.user).then((result) => setUser(result));
            await getBank();
        })();
    }, [state.isAuthenticated, state.loading]);

    const saveBank = () => {
        const nameBank = document.querySelector('#bank_name').value;
        const owner = document
            .querySelector('#bank_account')
            .value.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
        const numberBank = document.querySelector('#bank_number').value;
        const nameUser = document.querySelector('#user_id').value;
        const prioritize = document.querySelector('#prioritize').value;

        if (nameBank === '' || numberRegex.test(nameBank) || !specialRegex.test(nameBank))
            handleAlert('alert-danger', 'Tên ngân hàng không được bỏ trống, không chứa số hoặc kí tự đặc biệt');
        else if (owner === '' || numberRegex.test(owner) || !specialRegex.test(owner))
            handleAlert('alert-danger', 'Tên chủ tài khoản không được bỏ trống, không chứa số hoặc kí tự đặc biệt');
        else if (numberBank === '' || !numberRegex.test(numberBank) || numberBank.includes(' '))
            handleAlert('alert-danger', 'Số tài khoản chỉ chấp nhận chữ số và không cho phép khoảng trắng');
        else {
            if (path.includes('/users/bank_account')) {
                handleSaveUpdateUser('POST', '', nameBank, owner, numberBank, nameUser, prioritize, 'Thêm thành công');
            } else {
                handleSaveUpdateUser('PUT', `?id=${path}`, nameBank, owner, numberBank, nameUser, prioritize, 'Cập nhật thành công');
            }
        }
    };

    const handleSaveUpdateUser = async (method, query, nameBank, owner, numberBank, nameUser, priority, message) => {
        try {
            const response = await fetch(`${BASE_URL}bank_accounts${query}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({
                    nameBank,
                    owner,
                    numberBank,
                    priority,
                    employeeId: +nameUser,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', message);
                setTimeout(() => {
                    if (method === 'POST') {
                        document.querySelector('#formReset').reset();
                    }
                    clickClose();
                }, 3000);
            } else handleAlert('alert-danger', data.message);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
    };

    const clickClose = () => {
        const alert = document.querySelector(`.${cx('alert')}`);
        alert.classList.add(`${cx('hidden')}`);
    };

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                {t('common.Bank Account')}{' '}
                                <small>{path.includes('/users/bank_account/create') ? `${t('common.button.create')}` : `${t('common.Edit')}`}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>{t('common.Required field')}</p>
                                    </div>

                                    <form onSubmit={(e) => handleSubmitForm(e)} id="formReset">
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Name')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="user_id" className={cx('form-control', 'select')}>
                                                        {user.map((item) => (
                                                            <option key={item.id} value={item.employee.id}>
                                                                {item.employee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span className={cx('select2 select2-container select2-container--default')}></span>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Bank Name')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" id="bank_name" placeholder="Vietcombank" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Owner')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" id="bank_account" placeholder="NGUYEN VAN A" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Bank Number')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} type="text" id="bank_number" placeholder="012345678910JQKÁT" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Prioritize')}
                                                    <span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="prioritize" className={cx('form-control', 'select')}>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11', 'm-11', 't-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button type="button" className={cx('close', 'pc-1')} onClick={clickClose}>
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                {path.includes('/bank_account') ? (
                                                    <button type="submit" className={cx('btn', 'btn-success')} onClick={saveBank}>
                                                        {t('common.button.create')}
                                                    </button>
                                                ) : (
                                                    <button name="redirect" className={cx('btn', 'btn-info')} onClick={saveBank}>
                                                        {t('common.button.save')}
                                                    </button>
                                                )}
                                                <button type="reset" className={cx('btn', 'btn-danger')}>
                                                    {t('common.button.confluent')}
                                                </button>
                                                <a href={routes.userBank}>
                                                    <button type="button" className={cx('btn', 'btn-default')}>
                                                        {t('common.button.exit')}
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </form>
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
