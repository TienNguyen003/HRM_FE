import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from '../create.module.scss';
import { BASE_URL } from '../../../config/config';
import { isCheck } from '../../globalstyle/checkToken';

const cx = classNames.bind(styles);

function Setups() {
    (async function () {
        await isCheck();
    })();

    return (
        <>
            <div className={cx('content-wrapper')}>
                <section className={cx('content')}>
                    <div className={cx('container-fluid')}>
                        <section className={cx('content-header')}>
                            <h1>Cài đặt</h1>
                        </section>
                        <div className={cx('row', 'no-gutters')}>
                            <div className={cx('pc-12')}>
                                <div className={cx('card')}>
                                    <div className={cx('card-header')}>
                                        <h3 className={cx('card-title')}>Thời gian làm việc</h3>
                                    </div>
                                    <div className={cx('card-body')}>
                                        <form>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}></label>
                                                <div className={cx('pc-10')}>
                                                    <div className={cx('form-group', 'row', 'no-gutters')}>
                                                        <div className={cx('pc-4')}>
                                                            <label className={cx('pc-12', 'text-center')}>
                                                                Thời gian bắt đầu
                                                            </label>
                                                        </div>
                                                        <div className={cx('pc-4')}>
                                                            <label className={cx('pc-12', 'text-center')}>
                                                                Thời gian kết thúc
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('form-group', 'row', 'no-gutters')}>
                                                <label className={cx('pc-2')}>Thứ hai:</label>
                                                <div className={cx('pc-10')}>
                                                    <div className={cx('form-group', 'row', 'no-gutters')}>
                                                        <div className={cx('pc-4', 'post-form')}>
                                                            <div className={cx('input-group')}>
                                                                <input
                                                                    type="time"
                                                                    className={cx('form-control')}
                                                                    name="time_start_1[]"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={cx('pc-4', 'post-form')}>
                                                            <div className={cx('input-group')}>
                                                                <input
                                                                    type="time"
                                                                    className={cx('form-control')}
                                                                    name="time_end_1[]"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={cx('pc-2')}>
                                                            <button type="button" className={cx('btn', 'btn-success')}>
                                                                <i className={cx('fas fa-plus')}></i>
                                                            </button>
                                                            <button type="button" className={cx('btn', 'btn-danger')}>
                                                                <i className={cx('fa fa-trash-alt')}></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('text-center')}>
                                                <button type="submit" className={cx('btn', 'btn-success')}>
                                                    Cập nhật
                                                </button>
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

export default Setups;
