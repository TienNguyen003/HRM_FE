import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../create.module.scss';
import routes from '../../../config/routes';
import { BASE_URL } from '../../../config/config';
import { isCheck, reloadAfterDelay } from '../../globalstyle/checkToken';
import { getAdvances, handleAlert, formatter } from '../ingredient';
import Status from '../../globalstyle/Status/status';

const cx = classNames.bind(styles);

function Approvals() {
    (async function () {
        await isCheck();
    })();

    const [isStatus, setIsStatus] = useState(0);
    const [advances, setAdvances] = useState([]);
    const token = localStorage.getItem('authorizationData') || '';
    const approvedBy = JSON.parse(localStorage.getItem('employee')).name || '';
    const path = window.location.pathname.replace('/advances/approvals/edit/', '');

    useEffect(() => {
        (async function () {
            await getAdvances(path, token).then((result) => {
                setAdvances([result]);
                setIsStatus(result.status);
            });
        })();
    }, []);

    const updateSttAdvances = async () => {
        const status = document.querySelector('#status').value;

        try {
            const response = await fetch(`${BASE_URL}advances/approvals?advaceId=${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    approvedBy,
                    status,
                }),
            });

            const data = await response.json();
            if (data.code === 303) {
                handleAlert('alert-success', 'Cập nhật thành công!');
                reloadAfterDelay(1000);
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
                                Ứng lương <small>Duyệt yêu cầu</small>
                            </h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                {advances.map((item) => (
                                    <div key={item.id} className={cx('card')}>
                                        <div className={cx('card-header', 'row', 'no-gutters')}>
                                            <p className={cx('card-title', 'pc-10')}>
                                                Trạng thái: <Status status={item.status} />
                                                <br />
                                                Người thực hiện: <strong>{item.approvedBy}</strong>
                                            </p>
                                            {isStatus === 0 ? (
                                                <div className={cx('pc-2')}>
                                                    <select className={cx('form-control', 'select')} id="status">
                                                        <option value="1">Phê duyệt</option>
                                                        <option value="2">Từ chối</option>
                                                        <option value="3">Huỷ</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div className={cx('card-body')}>
                                            <div className={cx('row', 'no-gutters', 'form-group')}>
                                                <label className={cx('pc-2')}>Họ tên:</label>
                                                <div className={cx('pc-8')}>
                                                    <p>{item.employee.name}</p>
                                                </div>
                                            </div>
                                            <div className={cx('row', 'no-gutters', 'form-group')}>
                                                <label className={cx('pc-2')}>Số tiền:</label>
                                                <div className={cx('pc-8')}>
                                                    <p>{formatter.format(item.money)}</p>
                                                </div>
                                            </div>
                                            <div className={cx('row', 'no-gutters', 'form-group')}>
                                                <label className={cx('pc-2')}>Ghi chú:</label>
                                                <div className={cx('pc-8')}>
                                                    <p>
                                                        <i>{item.note}</i>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cx('row', 'no-gutters', 'form-group')}>
                                                <label className={cx('pc-2')}>Bình luận:</label>
                                                <div className={cx('pc-8')}>
                                                    <textarea
                                                        className={cx('form-control', 'message')}
                                                        rows="6"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className={cx('alert')}>
                                                <ul className={cx('pc-11')}>
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
                                                    Lưu
                                                </button>
                                                <a href={routes.advanceApprovals}>
                                                    <button type="submit" className={cx('btn', 'btn-default')}>
                                                        Thoát
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
