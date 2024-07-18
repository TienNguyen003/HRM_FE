import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';

import routesConfig from '../../config/routes';
import styles from './home.module.scss';
import '../../component/globalstyle/LibaralyLayout/grid.css';
import { isCheck } from '../../component/globalstyle/checkToken';

const cx = classNames.bind(styles);

function Home() {
    (async function () {
        await isCheck();
    })();

    return (
        <>
            <div className={cx('content-wrapper', 'grid')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <div className={cx('row', 'dashboard', 'no-gutters')}>
                            <div className={cx('pc-9')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <h3 className={cx('card-title')}> Danh sách duyệt đơn</h3>
                                        <div className={cx('card-tools')}>
                                            <button type="button" className={cx('btn')} data-card-widget="collapse">
                                                <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                                            </button>
                                            <button type="button" className={cx('btn')} data-card-widget="remove">
                                                <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                                            </button>
                                        </div>
                                    </div>

                                    <div className={cx('card-body', 'pc-12')}>
                                        <div className={cx('table-responsive', 'text-center')}>
                                            <table className={cx('table', 'pc-12')}>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Họ tên</th>
                                                        <th>Loại nghỉ</th>
                                                        <th>Thời gian bắt đầu</th>
                                                        <th>Thời gian kết thúc</th>
                                                        <th>Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody></tbody>
                                            </table>
                                        </div>

                                        <div className={cx('clearfix')}>
                                            <a href={routesConfig.leaveApprovals} className={cx('float-right')}>
                                                Xem tất cả
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('pc-3')}>
                                <div className={cx('info-box', 'day-off-item')}>
                                    <span className={cx('info-box-icon', 'bg-danger')}>
                                        <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>
                                    </span>
                                    <div className={cx('info-box-content')}>
                                        <h5>
                                            <a
                                                href={routesConfig.leaveHs}
                                                className={cx('info-box-number', 'name-category')}
                                            >
                                                Nghỉ phép
                                            </a>
                                        </h5>
                                        <span className={cx('info-box-text')}>Đã dùng: 0 ngày (0 giờ)</span>
                                        <span className={cx('info-box-text')}>Còn lại: 0 ngày (0 giờ)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-3')}>
                                <div className={cx("sticky-top", "pc-12")}>
                                    <div className={cx("card")}>
                                        <div className={cx("card-header")}>
                                            <h4 className={cx("card-title", "text-center")}>Thông tin tháng 07/2024</h4>
                                        </div>
                                        <div>
                                            <table className={cx("table")}>
                                                <tbody>
                                                    <tr>
                                                        <td>Giờ cần làm việc</td>
                                                        <td className={cx("text-right")}>200</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Giờ chấm công</td>
                                                        <td className={cx("text-right")}>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Giờ nghỉ lễ</td>
                                                        <td className={cx("text-right")}>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Giờ nghỉ phép</td>
                                                        <td className={cx("text-right")}>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nghỉ có lý do</td>
                                                        <td className={cx("text-right")}>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nghỉ không lý do</td>
                                                        <td className={cx("text-right")}>200</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Số lần đi muộn</td>
                                                        <td className={cx("text-right")}>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Số lần quên chấm công</td>
                                                        <td className={cx("text-right")}>0</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className={cx("card")}>
                                        <div className={cx("card-body", "note")}>
                                            <div className={cx("alert", "text-center", "note-item", "bg-green")}>Chấm công (vào)</div>
                                            <div className={cx("alert", "text-center", "note-item", "bg-yellow")}>Chấm công (ra)</div>
                                            <div className={cx("alert", "text-center", "note-item", "bg-blue")}>Nghỉ lễ</div>
                                            <div className={cx("alert", "text-center", "note-item", "bg-grey")}>Xin nghỉ</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('pc-9')}></div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Home;
