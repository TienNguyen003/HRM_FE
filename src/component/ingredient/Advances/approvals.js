import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import styles from '../create.module.scss';
import routes from '../../../config/routes';
import Status from '../../globalstyle/Status/status';
import { BASE_URL } from '../../../config/config';
import { getAdvances, formatter } from '../ingredient';
import { useAuth } from '../../../untils/AuthContext';

const cx = classNames.bind(styles);

function Approvals() {
    const { state, redirectLogin, checkRole } = useAuth();
    const { t } = useTranslation();
    const [isStatus, setIsStatus] = useState(0);
    const [advances, setAdvances] = useState([]);
    const path = window.location.pathname.replace('/advances/approvals/edit/', '');

    useEffect(() => {
        !state.isAuthenticated && redirectLogin();
        (async function () {
            await checkRole(state.account.role.permissions, 'ADV_APPROVALS', true);
            await getAdvances(path, state.user).then((result) => {
                setAdvances([result]);
                setIsStatus(result.status);
            });
        })();
    }, [isStatus, state.isAuthenticated, state.loading]);

    const updateSttAdvances = async () => {
        const status = document.querySelector('#status').value;

        try {
            const response = await fetch(`${BASE_URL}advances/approvals?advaceId=${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.user}`,
                },
                body: JSON.stringify({
                    approvedBy: state.account.employee.name,
                    status,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                alert('Cập nhật thành công!');
                setIsStatus((pre) => !pre);
            }
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
                                {t('common.Salary Advance')} <small>{t('common.Approval')}</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12', 'm-12')}>
                                {advances.map((item) => (
                                    <div key={item.id} className={cx('card')}>
                                        <div className={cx('card-header', 'row', 'no-gutters')}>
                                            <p className={cx('card-title', 'pc-10', 'm-9')}>
                                                {t('common.Status')}: <Status status={item.status} />
                                                <br />
                                                {t('common.Approval')} {t('common.By')}: <strong>{item.approvedBy}</strong>
                                            </p>
                                            {isStatus === 0 ? (
                                                <div className={cx('pc-2', 'm-3')}>
                                                    <select className={cx('form-control', 'select')} id="status">
                                                        <option value="1">{t('common.Approval')}</option>
                                                        <option value="2">{t('common.Rejected')}</option>
                                                        <option value="3">{t('common.Cancelled')}</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div className={cx('card-body')}>
                                            <div className={cx('row', 'no-gutters', 'form-group')}>
                                                <label className={cx('pc-2', 'm-3')}>{t('common.Name')}:</label>
                                                <div className={cx('pc-8', 'm-8')}>
                                                    <p>{item.employee.name}</p>
                                                </div>
                                            </div>
                                            <div className={cx('row', 'no-gutters', 'form-group')}>
                                                <label className={cx('pc-2', 'm-3')}>{t('common.Money')}:</label>
                                                <div className={cx('pc-8', 'm-8')}>
                                                    <p>{formatter.format(item.money)}</p>
                                                </div>
                                            </div>
                                            <div className={cx('row', 'no-gutters', 'form-group')}>
                                                <label className={cx('pc-2', 'm-3')}>{t('common.Note')}:</label>
                                                <div className={cx('pc-8', 'm-8')}>
                                                    <p>
                                                        <i>{item.note}</i>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cx('row', 'no-gutters', 'form-group')}>
                                                <label className={cx('pc-2', 'm-3')}>{t('common.Comment')}:</label>
                                                <div className={cx('pc-8', 'm-8')}>
                                                    <textarea className={cx('form-control', 'message')} rows="6"></textarea>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11', 't-11', 'm-11')}>
                                                    <li className={cx('alert-content')}>Tên không được để trống.</li>
                                                </ul>
                                            </div>
                                            <div className={cx('text-center')}>
                                                <button
                                                    type="submit"
                                                    className={cx('btn', 'btn-success')}
                                                    disabled={isStatus !== 0}
                                                    onClick={updateSttAdvances}
                                                >
                                                    {t('common.button.save')}
                                                </button>
                                                <a href={routes.advanceApprovals}>
                                                    <button type="submit" className={cx('btn', 'btn-default')}>
                                                        {t('common.button.exit')}
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Approvals;
