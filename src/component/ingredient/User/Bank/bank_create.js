import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../Create/create.module.scss';
import routes from '../../../../config/routes';
import { isCheck } from '../../../globalstyle/checkToken';

const cx = classNames.bind(styles);

function Bank() {
    (async function () {
        await isCheck();
    })();

    const [user, setUser] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const path = window.location.pathname.replace('/users/bank_account/edit/', '');

    //regex
    const numberRegex = /[0-9]/;
    const specialRegex = /^[a-zA-Z0-9\s]*$/;

    // lấy user
    async function getAllUser() {
        try {
            const response = await fetch(`http://localhost:8083/api/users/getAll`, {
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
            setUser(data.result);
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    }

    // lấy bank
    async function getBank() {
        if (path.includes('/users/bank_account')) return '';
        try {
            const response = await fetch(`http://localhost:8083/api/bank_accounts/bank?id=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                const dataRs = data.result;
                document
                    .querySelector('#prioritize')
                    .querySelector('option[value="' + dataRs.priority + '"]').selected = true;
                document
                    .querySelector('#user_id')
                    .querySelector('option[value="' + dataRs.employee.id + '"]').selected = true;
                document.querySelector('#bank_name').value = dataRs.nameBank;
                document.querySelector('#bank_account').value = dataRs.owner;
                document.querySelector('#bank_number').value = dataRs.numberBank;
            }
        } catch (error) {
            console.error('Error fetching roles:', error.message);
        }
    }

    useEffect(() => {
        (async function () {
            await getAllUser();
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getBank();
        })();
    }, []);

    // css alert
    const handleAlert = (css, content) => {
        const alert = document.querySelector(`.${cx('alert')}`);
        const alertCt = document.querySelector(`.${cx('alert-content')}`);

        alert.setAttribute('class', `${cx('alert')}`);
        alert.classList.remove(`${cx('hidden')}`);
        alert.classList.add(`${cx(css)}`);
        alertCt.textContent = content;
    };

    const saveBank = async () => {
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

        if (numberRegex.test(nameBank) || !specialRegex.test(nameBank))
            handleAlert('alert-danger', 'Tên ngân hàng không được bỏ trống, không chứa số hoặc kí tự đặc biệt');
        else if (owner === '' || numberRegex.test(owner) || !specialRegex.test(owner))
            handleAlert('alert-danger', 'Tên chủ tài khoản không được bỏ trống, không chứa số hoặc kí tự đặc biệt');
        else if (numberBank === '' || !numberRegex.test(numberBank) || numberBank.includes(' '))
            handleAlert('alert-danger', 'Số tài khoản chỉ chấp nhận chữ số và không cho phép khoảng trắng');
        else handleSaveUser(nameBank, owner, numberBank, nameUser, prioritize);
    };

    const handleSaveUser = async (nameBank, owner, numberBank, nameUser, prioritize) => {
        try {
            const response = await fetch(`http://localhost:8083/api/bank_accounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nameBank: nameBank,
                    owner: owner,
                    numberBank: numberBank,
                    priority: prioritize,
                    employeeId: +nameUser,
                }),
            });

            const data = await response.json();
            if (data.code === 303) handleAlert('alert-success', 'Thêm dữ liệu thành công');
            else handleAlert('alert-danger', data.message);
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
                                Tài khoản ngân hàng <small>Thêm mới</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <p className={cx('card-title')}>
                                            Những trường đánh dấu (<span className={cx('text-red')}>*</span>) là bắt
                                            buộc
                                        </p>
                                    </div>

                                    <form onSubmit={(e) => handleSubmitForm(e)}>
                                        <div className={cx('card-body')}>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Họ tên<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <select id="user_id" className={cx('form-control', 'select')}>
                                                        {user.map((item) => (
                                                            <option key={item.id} value={item.employee.id}>
                                                                {item.employee.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span
                                                        className={cx(
                                                            'select2 select2-container select2-container--default',
                                                        )}
                                                    ></span>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Tên ngân hàng<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="text"
                                                        id="bank_name"
                                                        placeholder="Vietcombank"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Chủ tài khoản<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="text"
                                                        id="bank_account"
                                                        placeholder="NGUYEN VAN A"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Số tài khoản<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
                                                    <input
                                                        className={cx('form-control')}
                                                        type="text"
                                                        id="bank_number"
                                                        placeholder="012345678910JQKÁT"
                                                    />
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>
                                                    Độ ưu tiên<span className={cx('text-red')}> *</span>
                                                </label>
                                                <div className={cx('pc-8')}>
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
                                                <ul className={cx('pc-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                                <button
                                                    type="button"
                                                    className={cx('close', 'pc-1')}
                                                    onClick={clickClose}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div className={cx('text-center')}>
                                                {path.includes('/bank_account') ? (
                                                    <button
                                                        type="submit"
                                                        className={cx('btn', 'btn-success')}
                                                        onClick={saveBank}
                                                    >
                                                        Thêm mới
                                                    </button>
                                                ) : (
                                                    <button
                                                        name="redirect"
                                                        className={cx('btn', 'btn-info')}
                                                        // onClick={clickUpdate}
                                                    >
                                                        Lưu lại
                                                    </button>
                                                )}
                                                <button type="reset" className={cx('btn', 'btn-default')}>
                                                    Nhập lại
                                                </button>
                                                <button type="button" className={cx('btn', 'btn-danger')}>
                                                    <a href={routes.userBank}>Thoát</a>
                                                </button>
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
