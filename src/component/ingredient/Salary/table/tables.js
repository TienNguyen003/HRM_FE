import React from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../../list.module.scss';
import routes from '../../../../config/routes';
import { BASE_URL } from '../../../../config/config';
import { formatter } from '../../ingredient';
import { Page } from '../../../layout/pagination/pagination';
import { exportExcel } from '../../../layout/excel/excel';
import { useAuth } from '../../../../untils/AuthContext';
import Load from '../../../globalstyle/Loading/load';

const cx = classNames.bind(styles);

export default function Salary() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [checkStt, setCheck] = useState(false);
    const [salary, setSalary] = useState([]);
    const [page, setPage] = useState([]);
    const location = useLocation();

    const today = new Date();

    // Tạo một đối tượng Intl.DateTimeFormat để định dạng ngày
    const formatterDay = new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    // Định dạng ngày tháng năm hiện tại
    const formattedDate = formatterDay.format(today);

    const getSalary = async (id) => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 1;
        const name = urlParams.get('name') || '';
        const status = urlParams.get('status') || '';
        const time = urlParams.get('time') || '';

        document.querySelector('#name').value = name;
        document.querySelector('#time').value = time;
        document.querySelector('#status').querySelector('option[value="' + status + '"]').selected = true;

        try {
            const response = await fetch(`${BASE_URL}salary_tables?pageNumber=${page}&name=${name}&time=${time}&status=${status}&id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
            });

            const data = await response.json();
            if (data.code === 303) {
                setSalary(data.result);
                setPage(data.page);
                const isCheck = data.result.every((e) => e.status === 1);
                setCheck(isCheck);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async () => {
            await checkRole(state.account.role.permissions, 'SALA_VIEW', true);
            await new Promise((resolve) => setTimeout(resolve, 1));
            await getSalary(checkRole(state.account.role.name, 'NHÂN VIÊN') ? state.account.employee.id : '');
        })();
    }, [state.isAuthenticated, state.loading, location]);

    const handleExportExcel = async () => {
        const newArray = salary.map(({ status, advance, totalSalary, employee: { name, department }, bank: { owner, nameBank, numberBank }, ...rest }) => ({
            ...rest,
            'Tên nhân viên': name,
            'Tên phòng': department.name + ' - ' + department.officeI.name,
            'Tên chủ tài khoản': owner,
            'Tên ngân hàng': nameBank,
            'Số tài khoản': numberBank,
            'Ứng lương': formatter.format(advance),
            'Tổng lương': formatter.format(totalSalary),
        }));

        await exportExcel(newArray, 'Bảng lương', 'Bảng lương');
    };

    const showQRCode = (e) => {
        const info = e.target.querySelector('#vietqr');
        const name = info.getAttribute('bank_name').replace(/ /g, '');
        const number = info.getAttribute('bank_number');
        const owner = info.getAttribute('bank_account');
        const money = info.getAttribute('price');
        const time = e.target.parentElement.querySelector('#des').textContent;
        const email = info.getAttribute('email');

        const vietqr = document.querySelector('#vietqrInfo');
        vietqr.classList.remove(`${cx('hidden')}`);

        document.querySelector('#btnConfirm').setAttribute('data-email', email);
        document.querySelector('#bank_name').textContent = name;
        document.querySelector('#bank_number').textContent = number;
        document.querySelector('#bank_account').textContent = owner;
        document.querySelector('#price').textContent = formatter.format(money);
        document.querySelector('#content').textContent = 'Lương tháng ' + time;
        document.querySelector('#image-vietqr').src = `https://img.vietqr.io/image/${name}-${number}-compact2.png?amount=${money}&addInfo=${
            'Lương%20tháng%20' + time
        }&accountName=${owner.replace(/ /g, '%20')}`;
    };

    const clickCloseQrCode = (e) => {
        const parent = e.target.parentElement.parentElement;
        parent.classList.add(`${cx('hidden')}`);
    };

    const checkAllInput = (e) => {
        const ipPayroll = document.querySelectorAll(`input.${cx('minimal')}:not([disabled])`);
        let isCheck = false;
        isCheck = e.target.checked ? true : false;
        ipPayroll.forEach(function (i) {
            i.checked = isCheck;
        });
    };

    const clickCottar = async () => {
        const ipPayroll = document.querySelectorAll(`.${cx('minimal')}`);
        let arrIp = [];
        const load = document.querySelector('#load');
        load.classList.toggle(`${cx('hidden')}`);
        ipPayroll.forEach(function (i) {
            if (i.checked) arrIp.push(i.value);
        });

        try {
            const response = await fetch(`${BASE_URL}salary_tables/payroll`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify(arrIp),
            });

            const data = await response.json();
            if (data.code === 303) {
                alert(data.result);
                getSalary(checkRole(state.account.role.name, 'NHÂN VIÊN') ? state.account.employee.id : '');
            }
            load.classList.toggle(`${cx('hidden')}`);
        } catch (error) {
            console.log(error);
        }
    };

    const clickSendMail = () => {
        const ipPayroll = document.querySelectorAll(`.${cx('minimal')}`);
        let arrIp = [];
        ipPayroll.forEach(function (i) {
            if (i.checked) {
                const parent = i.parentElement.parentElement;
                const name = parent.querySelector('#name').textContent;
                const salary = parent.querySelector('#salary').textContent;
                const time = parent.querySelector('#des').textContent;
                const bankNanme = document.querySelector('#vietqr').getAttribute('bank_name');
                const bankAccount = document.querySelector('#vietqr').getAttribute('bank_number');

                const content = `<html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                width: 80%;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                background-color: #0044cc;
                                color: #ffffff;
                                padding: 10px;
                                border-radius: 8px 8px 0 0;
                                text-align: center;
                            }
                            .header img {
                                width: 120px;
                                height: auto;
                            }
                            .content {
                                margin: 20px 0;
                                background-size: contain;
                                background-repeat: no-repeat;
                                background-position: right;
                                background-image: url(https://i.imgur.com/j98aB90.jpeg)
                            }
                            .content img {
                                width: 150px;
                                height: auto;
                                margin: 10px;
                            }
                            .footer {
                                text-align: center;
                                font-size: 12px;
                                color: #777777;
                            }
                        </style>
                    </head>
                    <body>
                         <div class="container">
                            <div class="header">
                                <h1>Thông Báo Lương Tháng</h1>
                            </div>
                            <div class="content">
                                <p>Kính gửi: <strong>${name}</strong>,</p>
                                <p>Chúng tôi xin thông báo về việc thanh toán lương tháng <strong>${time}</strong> của bạn như sau:</p>
                                <p><strong>Mức lương:</strong> <span style="color: red">${salary}</span></p>
                                <p><strong>Thời gian thanh toán:</strong> ${formattedDate}</p>
                                <p>Lương của bạn sẽ được chuyển khoản vào tài khoản ngân hàng ${bankNanme} - ${bankAccount}.</p>
                                <p>Xin vui lòng kiểm tra tài khoản của bạn để xác nhận việc nhận lương.</p>
                                <p>Nếu bạn có bất kỳ câu hỏi nào liên quan đến lương tháng này, vui lòng liên hệ với bộ phận nhân sự qua email <a href="mailto:dinhtien17082003@gmail.com">dinhtien17082003@gmail.com</a> hoặc điện thoại <strong>0123456789</strong>.</p>
                                <p>Cảm ơn bạn vì sự đóng góp và cống hiến không ngừng cho công ty. Chúc bạn có một tháng mới làm việc hiệu quả và thành công!</p>
                                <p>Trân trọng,</p>
                            </div>
                            <div class="footer">
                                <p>© 2024 Công ty XYZ. Tất cả quyền lợi được bảo lưu.</p>
                                <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
                            </div>
                        </div>
                    </body>
                    </html>`;

                arrIp.push({ email: i.getAttribute('data-email'), content: content });
            }
        });

        handleSendEmail(arrIp);
    };

    const handleSendEmail = async (arrIp) => {
        const load = document.querySelector('#load');
        load.classList.toggle(`${cx('hidden')}`);
        try {
            const response = await fetch(`${BASE_URL}salary_tables/email`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify(arrIp),
            });

            const data = await response.json();
            if (data.code === 303) alert(data.result);
            load.classList.toggle(`${cx('hidden')}`);
        } catch (error) {
            console.log(error);
        }
    };

    const submitConfirm = async (e) => {
        let arrIp = [];
        arrIp.push({ email: e.target.getAttribute('data-email'), content: 'Đã thanh toán lương' });
        const closeQr = document.querySelector(`.${cx('modal-notif')}`);
        closeQr.classList.add(`${cx('hidden')}`);
        handleSendEmail(arrIp);
    };

    return (
        <>
            <Load className={cx('hidden')} id="load" />
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>
                                {t('common.Salary Table')} <small>{t('common.List')}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <div className={cx('row', 'no-gutters')}>
                                            <div className={cx('pc-9', 'm-12')}>
                                                <div>
                                                    <form>
                                                        <div className={cx('row', 'form-group', 'no-gutters')}>
                                                            <div className={cx('pc-3', 'm-5', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    name="name"
                                                                    id="name"
                                                                    placeholder={t('common.Name')}
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <input
                                                                    type="text"
                                                                    className={cx('form-control')}
                                                                    name="time"
                                                                    id="time"
                                                                    placeholder={t('common.Salary Month')}
                                                                />
                                                            </div>
                                                            <div className={cx('pc-3', 'm-5', 'post-form')}>
                                                                <select className={cx('form-control', 'select')} name="status" id="status">
                                                                    <option value="">-- {t('common.Status')} --</option>
                                                                    <option value="0">{t('common.Pending')}</option>
                                                                    <option value="1">{t('common.Approval')}</option>
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
                                            <div className={cx('pc-3', 'm-6', 'text-right')}>
                                                <button className={cx('btn', 'btn-success')} onClick={handleExportExcel}>
                                                    <i className={cx('fas fa-download')}></i> {t('common.Export Excel')}
                                                </button>
                                                {checkRole(state.account.role.permissions, 'SALA_ADD') && (
                                                    <a style={{ marginLeft: '5px' }} href={routes.salaryTableCreate} className={cx('btn')}>
                                                        <i className={cx('fa fa-plus')}></i> {t('common.button.create')} {t('common.Salary Table')}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('card-body')}>
                                        {checkRole(state.account.role.permissions, 'SALA_EDIT') && (
                                            <>
                                                <button disabled={checkStt} className={cx('btn', 'salary-locked', 'btn-default')} onClick={clickCottar}>
                                                    <i className={cx('fas fa-lock', 'text-danger')}></i>&ensp;{t('common.Approval')}
                                                </button>
                                                &ensp;
                                                <button className={cx('btn', 'send-mail', 'btn-success')} onClick={clickSendMail}>
                                                    <i className={cx('fas fa-lock', 'text-danger')}></i>&ensp;{t('common.Send')} mail
                                                </button>
                                            </>
                                        )}
                                        <div className={cx('modal', 'fade', 'modal-notif', 'hidden')} id="vietqrInfo">
                                            <div className={cx('modal-dialog', 'modal-dialog-centered')}>
                                                <div className={cx('modal-content')}>
                                                    <div className={cx('modal-body')}>
                                                        <div className={cx('row', 'no-gutters')}>
                                                            <div className={cx('pc-5')}>
                                                                <p className={cx('pc-6')}>{t('common.Bank Name')}:</p>
                                                                <p>
                                                                    <b id="bank_name"></b>
                                                                </p>
                                                                <p className={cx('pc-6')}>{t('common.Bank Number')}:</p>
                                                                <p>
                                                                    <b id="bank_number"></b>
                                                                </p>
                                                                <p className={cx('pc-6')}>{t('common.Owner')}:</p>
                                                                <p>
                                                                    <b id="bank_account"></b>
                                                                </p>
                                                                <p className={cx('pc-6')}>{t('common.Money')}:</p>
                                                                <p>
                                                                    <b id="price"></b>
                                                                </p>
                                                                <p className={cx('pc-6')}>{t('common.Content')}:</p>
                                                                <p>
                                                                    <b id="content"></b>
                                                                </p>
                                                            </div>
                                                            <div className={cx('pc-7', 'text-center')}>
                                                                <img src="" className={cx('image-vietqr')} id="image-vietqr" />
                                                                <button className={cx('btn', 'btn-success')} id="btnConfirm" onClick={(e) => submitConfirm(e)}>
                                                                    {t('common.Send')} mail {t('common.Confirmed Transfer')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cx('close-qrcode')} id="close-qrcode" onClick={(e) => clickCloseQrCode(e)}>
                                                    X
                                                </div>
                                            </div>
                                        </div>
                                        <table className={cx('table')} style={{ marginTop: '10px' }}>
                                            <tbody>
                                                <tr>
                                                    <th className={cx('text-center')}>STT</th>
                                                    <th className={cx('text-center')}>
                                                        <input type="checkbox" id="check_all" onClick={(e) => checkAllInput(e)} />
                                                    </th>
                                                    <th className={cx('text-center')}>{t('common.Name')}</th>
                                                    <th className={cx('text-center', 'm-0')}>{t('common.Department')}</th>
                                                    <th className={cx('text-center')}>{t('common.Salary Month')}</th>
                                                    <th className={cx('text-center')}>
                                                        {t('common.Total')} {t('common.Money')}
                                                    </th>
                                                    <th className={cx('text-center', 'm-0')}>{t('common.Status')}</th>
                                                    {checkRole(state.account.role.permissions, 'SALA_EDIT') && <th className={cx('text-center')}>VietQR</th>}
                                                    <th className={cx('text-center')}>{t('common.View')}</th>
                                                </tr>
                                                {salary.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className={cx('text-center')}>{(+page.currentPage - 1) * 30 + index + 1}</td>
                                                        <td className={cx('text-center')}>
                                                            <input
                                                                data-email={item.employee.email}
                                                                value={item.id}
                                                                type="checkbox"
                                                                disabled={item.status !== 0}
                                                                checked={item.status !== 0}
                                                                className={cx('minimal')}
                                                                id="minimal"
                                                            />
                                                        </td>
                                                        <td className={cx('text-center')} id="name">
                                                            {item.employee.name}
                                                        </td>
                                                        <td id="department" className={cx('m-0')}>
                                                            {item.employee.department.name} - {item.employee.department.officeI.name}
                                                        </td>
                                                        <td className={cx('text-center')} id="des">
                                                            {item.time}
                                                        </td>
                                                        <td className={cx('text-right')} id="salary">
                                                            {formatter.format(item.totalSalary)}
                                                        </td>
                                                        <td className={cx('text-center', 'text-danger', 'm-0')}>
                                                            {item.status === 0 ? (
                                                                <i className="fas fa-lock-open" title="Chưa khoá"></i>
                                                            ) : (
                                                                <i className="fas fa-lock" title="Chưa khoá"></i>
                                                            )}
                                                        </td>
                                                        {checkRole(state.account.role.permissions, 'SALA_EDIT') && (
                                                            <td className={cx('text-center')} onClick={(e) => showQRCode(e)} style={{ cursor: 'pointer' }}>
                                                                <a
                                                                    id="vietqr"
                                                                    bank_name={item.bank.nameBank}
                                                                    bank_number={item.bank.numberBank}
                                                                    bank_account={item.bank.owner}
                                                                    price={item.totalSalary}
                                                                    email={item.employee.email}
                                                                    style={{ pointerEvents: 'none' }}
                                                                >
                                                                    <i className={cx('fas fa-qrcode')}></i>
                                                                </a>
                                                            </td>
                                                        )}
                                                        <td className={cx('text-center')}>
                                                            <a href={routes.salaryTableDetail.replace(':name', item.id)}>
                                                                <i className={cx('fas fa-eye', 'text-green')}></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={cx('pagination', 'pc-12')}>
                                            <div className={cx('pc-7')}>
                                                <p>
                                                    {t('common.Show')} <b>{page.totalItemsPerPage}</b> /<b> {page.totalItems}</b> {t('common.Row')}
                                                </p>
                                            </div>
                                            <div className={cx('pc-5')}>
                                                <Page style={{ float: 'right' }} currentPage={page.currentPage} totalPages={page.totalPages} />
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
