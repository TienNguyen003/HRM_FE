import classNames from 'classnames/bind';
import { useState } from 'react';
import DatePicker from 'react-date-picker';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import styles from '../globalStyles.module.scss';

const cx = classNames.bind(styles);

export default function Sample({ className, id }) {
    const [value, onChange] = useState(new Date());

    return (
        <div style={{ width: '100%' }}>
            <DatePicker id={id} className={cx(className)} onChange={onChange} value={value} />
        </div>
    );
}
