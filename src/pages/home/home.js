import classNames from 'classnames/bind';

import styles from './home.module.scss';
import { isCheck } from '../../component/globalstyle/checkToken';

const cx = classNames.bind(styles);

function Home() {
    isCheck();

    return <></>
}

export default Home;
