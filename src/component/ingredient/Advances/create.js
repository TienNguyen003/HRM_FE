import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import styles from '../create.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { getAllUser, getAdvances, handleAlert, getUser } from '../ingredient';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Create() {
    const specialRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?\/\\~-]/;
    const numberRegex = /[0-9]/;

    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [isStatus, setIsStatus] = useState(0);
    const [user, setUser] = useState([]);
    const path = window.location.pathname.replace('/advances/edit/', '');

    const handleAdvances = (advance) => {
        setIsStatus(advance.status);
        document.querySelector('#user_id').querySelector('option[value="' + advance.employee.id + '"]').selected = true;
        document.querySelector('#price').value = advance.money;
        document.querySelector(`.${cx('message')}`).value = advance.note;
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account && state.account.role.permissions, 'ADV_ADD', true);
            if (checkRole(state.account.role.name, 'NHÂN VIÊN')) getUser(state.user, state.account.id).then((result) => setUser([result]));
            else await getAllUser(state.user).then((result) => setUser(result));
            await new Promise((resolve) => setTimeout(resolve, 1));
            if (path.includes('/advances/create')) return;
            await getAdvances(path, state.user).then((result) => handleAdvances(result));
        })();
    }, [state.isAuthenticated, state.loading]);

    const handleSaveAdvances = async (employeeId, money, note, method = 'POST') => {
        let url = `${BASE_URL}advances`;
        if (method == 'PUT') url += `?advaceId=${path}`;
        try {
            const response = await fetch(`${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({
                    money,
                    note,
                    employeeId,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Thành công');
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

    const saveAdvances = () => {
        const employeeId = document.querySelector('#user_id').value;
        let price = document.querySelector('#price');
        const note = document.querySelector(`.${cx('message')}`);
        if (price.value == '') handleAlert('alert-danger', 'Só tiền không được để trống');
        else if (!numberRegex.test(price.value)) handleAlert('alert-danger', 'Só tiền chỉ được phép nhập số');
        else if (specialRegex.test(price.value)) handleAlert('alert-danger', 'Só tiền không được chứa kí tự đặc biệt');
        else {
            if (path.includes('/advances/create')) handleSaveAdvances(employeeId, Number(price.value), note.value);
            else handleSaveAdvances(employeeId, Number(price.value), note.value, 'PUT');
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
    };

    //đóng alert
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
                                {t('common.Salary Advance')}
                                <small>{path.includes('/advances/create') ? `${t('common.button.create')}` : `${t('common.Edit')}`}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12', 't-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>{t('common.Required field')}</p>
                                    </div>

                                    <div className={cx('card-body')}>
                                        <form onSubmit={(e) => submitForm(e)} id="formReset">
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Name')}
                                                    <span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <select id="user_id" className={cx('form-control', 'select')}>
                                                        {user.map((item) => (
                                                            <option key={item.id} value={item.employee.id}>
                                                                {item.employee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>
                                                    {t('common.Money')}
                                                    <span className={cx('text-red')}> *</span>{' '}
                                                </label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <input className={cx('form-control')} id="price" placeholder="0" />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2', 'm-3', 't-4')}>{t('common.Note')}</label>
                                                <div className={cx('pc-8', 'm-8', 't-8')}>
                                                    <textarea className={cx('form-control', 'message')} rows="6"></textarea>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11', 't-11', 'm-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button type="button" className={cx('close')} onClick={clickClose}>
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('box-footer', 'text-center')}>
                                                {path.includes('/advances/create') ? (
                                                    <button className={cx('btn', 'btn-success')} onClick={saveAdvances}>
                                                        {t('common.button.create')}
                                                    </button>
                                                ) : (
                                                    <button className={cx('btn', 'btn-success')} disabled={isStatus !== 0} onClick={saveAdvances}>
                                                        {t('common.button.save')}
                                                    </button>
                                                )}
                                                <button type="reset" className={cx('btn', 'btn-danger')}>
                                                    {t('common.button.confluent')}
                                                </button>
                                                <a href={routes.advances}>
                                                    <button type="button" className={cx('btn', 'btn-default')}>
                                                        {t('common.button.exit')}
                                                    </button>
                                                </a>
                                            </div>
                                        </form>
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

export default Create;
