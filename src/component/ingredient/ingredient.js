import classNames from 'classnames/bind';
import styles from './create.module.scss';
import { BASE_URL } from '../../config/config';

const cx = classNames.bind(styles);

// dinh dang tien
export const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

// css alert
export const handleAlert = (css, content) => {
    const alert = document.querySelector(`.${cx('alert')}`);
    const alertCt = document.querySelector(`.${cx('alert-content')}`);

    alert.setAttribute('class', `${cx('alert')}`);
    alert.classList.remove(`${cx('hidden')}`);
    alert.classList.add(`${cx(css)}`);
    alertCt.textContent = content;
};

// check mạnh yếu mật khẩu
const checkValid = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

    if (hasLowercase && hasUppercase && hasDigit && hasSpecialChar) return 4;
    else if (
        (hasLowercase && hasUppercase && hasDigit) ||
        (hasLowercase && hasUppercase && hasSpecialChar) ||
        (hasLowercase && hasDigit && hasSpecialChar) ||
        (hasUppercase && hasDigit && hasSpecialChar)
    )
        return 3;
    else if (
        (hasLowercase && hasUppercase) ||
        (hasLowercase && hasDigit) ||
        (hasLowercase && hasSpecialChar) ||
        (hasUppercase && hasDigit) ||
        (hasUppercase && hasSpecialChar) ||
        (hasDigit && hasSpecialChar)
    )
        return 2;
    else if (hasLowercase || hasDigit || hasSpecialChar || hasUppercase) {
        return 1;
    } else return -1;
};

// check mật khẩu de css
const evaluatePasswordStrength = (password) => {
    const isValid = checkValid(password);
    if (password.length === 0) evaluatePasswordColor(0, '', '', '');
    else if (password.length <= 4) {
        if (isValid >= 3 && isValid <= 4) evaluatePasswordColor(2, 'box4', 'text-orange', 'yếu');
        else evaluatePasswordColor(1, 'box5', 'text-red', 'rất yếu');
    } else if (password.length <= 6) {
        if (isValid > 3 && isValid <= 4) evaluatePasswordColor(3, 'box3', 'text-grey', 'bình thường');
        else if (isValid >= 2 && isValid <= 3) evaluatePasswordColor(2, 'box4', 'text-orange', 'yếu');
        else evaluatePasswordColor(1, 'box5', 'text-red', 'rất yếu');
    } else if (password.length <= 8) {
        if (isValid > 3 && isValid <= 4) evaluatePasswordColor(4, 'box2', 'text-blue', 'mạnh');
        else if (isValid >= 2 && isValid <= 3) evaluatePasswordColor(3, 'box3', 'text-grey', 'bình thường');
        else evaluatePasswordColor(2, 'box4', 'text-orange', 'yếu');
    } else {
        if (isValid > 3 && isValid <= 4) evaluatePasswordColor(5, 'box1', 'text-green', 'rất mạnh');
        else if (isValid >= 2 && isValid <= 3) evaluatePasswordColor(4, 'box2', 'text-blue', 'mạnh');
        else evaluatePasswordColor(2, 'box4', 'text-orange', 'yếu');
    }
};

// css cho mật khẩu
const evaluatePasswordColor = (length, className, classText, value) => {
    const strongPass = document.querySelectorAll(`.${cx('strong-pass')}`);
    const result = document.querySelector(`.${cx('result')}`);
    if (length > 0) {
        result.setAttribute('class', 'result');
        result.classList.add(`${cx(classText)}`);
        result.classList.add(`${cx('text-result')}`);
        result.textContent = value;

        strongPass.forEach((element) => {
            element.setAttribute('class', 'strong-pass');
        });
        for (let index = 0; index < length; index++) {
            strongPass[index].classList.add(`${cx(className)}`);
        }
    } else {
        result.textContent = '';
        result.setAttribute('class', 'result');

        strongPass.forEach((element) => {
            element.setAttribute('class', 'strong-pass');
        });
    }
};

export const tooglePass = (isVisible) => {
    const showPassw = document.querySelector('#iconShow');
    const hiddenPassw = document.querySelector('#iconHidden');
    const password = document.querySelector('#password');
    showPassw.classList.toggle(`${cx('hidden')}`);
    hiddenPassw.classList.toggle(`${cx('hidden')}`);
    password.type = isVisible ? 'text' : 'password';
};

// input thay đổi giá trị
export const changePassword = (e) => {
    let password = e.target.value;
    if (password.includes(' ')) password = password.replace(/ /g, '');
    password = password
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    evaluatePasswordStrength(password);
    e.target.value = password;
    let confim_pass = document.querySelector('#comfirm_password');
    if (confim_pass) confim_pass.value = password;
};

// tự tạo mật khẩu
export const clickAutoPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    const prompt = window.prompt('Mật khẩu đã được tạo tự động, hãy lưu lại mật khẩu', password);
    if (prompt) {
        evaluatePasswordStrength(prompt);
        let confim_pass = document.querySelector('#comfirm_password');
        document.querySelector('#password').value = prompt;
        if (confim_pass) confim_pass.value = prompt;
    }
};

// lấy phòng làm việc
export async function getStructures(token) {
    try {
        const response = await fetch(`${BASE_URL}structures/struc`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch offices');
        }

        const data = await response.json();
        if (data.code === 303) return data.result;
    } catch (error) {
        console.error('Error fetching offices:', error.message);
    }
}

// lấy role
export async function getRoles(token) {
    try {
        const response = await fetch(`${BASE_URL}roles/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch offices');
        }

        const data = await response.json();
        if (data.code === 303) return data.result;
    } catch (error) {
        console.error('Error fetching offices:', error.message);
    }
}

// lấy user
export async function getAllUser(token) {
    try {
        const response = await fetch(`${BASE_URL}users/getAll`, {
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
        if (data.code === 303) return data.result;
    } catch (error) {
        console.error('Error fetching roles:', error.message);
    }
}

// danh sach ngay nghi
export const getDayOffCate = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}day_off_categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (data.code === 303) return data.result;
    } catch (error) {
        console.log(error);
    }
};

// tong thoi gian nghi le theo thang
export const getTotalTimeHoliday = async (token, time) => {
    try {
        const response = await fetch(`${BASE_URL}holidays/time?time=${time}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (data.code === 303) return data.result;
    } catch (error) {
        console.log(error);
    }
};

// danh sach ngay nghi
export const getAdvances = async (advancesId, token) => {
    try {
        const response = await fetch(`${BASE_URL}advances/advance?advaceId=${advancesId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (data.code === 303) return data.result;
    } catch (error) {
        console.log(error);
    }
};

// danh muc luong theo loai
export const getSalaryCate = async (type, token) => {
    try {
        const response = await fetch(`${BASE_URL}salary_categories/type?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (data.code === 303) return data.result;
    } catch (error) {
        console.log(error);
    }
};
