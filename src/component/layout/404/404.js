import React, { useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './404.module.scss';

const cx = classNames.bind(styles);

export default function Error() {
    useEffect(() => {
        let arr = [];
        let container = document.querySelector(`.${cx('container-star')}`);
        for (let i = 0; i < 30; i++) {
            let star = document.createElement('div');
            star.className = `${cx('star-1')}`;
            star.style.left = Math.random() * container.clientWidth + 'px';
            star.style.top = Math.random() * container.clientHeight + 'px';
            container.appendChild(star);
        }
    }, []);

    return (
        <>
            <div className={cx('container', 'container-star')}></div>
            <div className={cx('container', 'container-bird')}>
                <div className={cx('bird', 'bird-anim')}>
                    <div className={cx('bird-container')}>
                        <div className={cx('wing', 'wing-left')}>
                            <div className={cx('wing-left-top')}></div>
                        </div>
                        <div className={cx('wing', 'wing-right')}>
                            <div className={cx('wing-right-top')}></div>
                        </div>
                    </div>
                </div>
                <div className={cx('bird', 'bird-anim')}>
                    <div className={cx('bird-container')}>
                        <div className={cx('wing', 'wing-left')}>
                            <div className={cx('wing-left-top')}></div>
                        </div>
                        <div className={cx('wing', 'wing-right')}>
                            <div className={cx('wing-right-top')}></div>
                        </div>
                    </div>
                </div>
                <div className={cx('bird', 'bird-anim')}>
                    <div className={cx('bird-container')}>
                        <div className={cx('wing', 'wing-left')}>
                            <div className={cx('wing-left-top')}></div>
                        </div>
                        <div className={cx('wing', 'wing-right')}>
                            <div className={cx('wing-right-top')}></div>
                        </div>
                    </div>
                </div>
                <div className={cx('bird', 'bird-anim')}>
                    <div className={cx('bird-container')}>
                        <div className={cx('wing', 'wing-left')}>
                            <div className={cx('wing-left-top')}></div>
                        </div>
                        <div className={cx('wing', 'wing-right')}>
                            <div className={cx('wing-right-top')}></div>
                        </div>
                    </div>
                </div>
                <div className={cx('bird', 'bird-anim')}>
                    <div className={cx('bird-container')}>
                        <div className={cx('wing', 'wing-left')}>
                            <div className={cx('wing-left-top')}></div>
                        </div>
                        <div className={cx('wing', 'wing-right')}>
                            <div className={cx('wing-right-top')}></div>
                        </div>
                    </div>
                </div>
                <div className={cx('bird', 'bird-anim')}>
                    <div className={cx('bird-container')}>
                        <div className={cx('wing', 'wing-left')}>
                            <div className={cx('wing-left-top')}></div>
                        </div>
                        <div className={cx('wing', 'wing-right')}>
                            <div className={cx('wing-right-top')}></div>
                        </div>
                    </div>
                </div>
                <div className={cx('container-title')}>
                    <div className={cx('title')}>
                        <div className={cx('number')}>4</div>
                        <div className={cx('moon')}>
                            <div className={cx('face')}>
                                <div className={cx('mouth')}></div>
                                <div className={cx('eyes')}>
                                    <div className={cx('eye-left')}></div>
                                    <div className={cx('eye-right')}></div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('number')}>4</div>
                    </div>
                    <div className={cx('subtitle')}>oops. looks like you took a wrong turn.</div>
                    <a href="/">
                        <button className={cx('button')}>Go back</button>
                    </a>
                </div>
            </div>
        </>
    );
}
