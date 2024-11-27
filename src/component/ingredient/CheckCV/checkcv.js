import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './check.module.scss';
import { BASE_URL } from '../../../config/config';

const cx = classNames.bind(styles);

export default function CheckCV() {
    const inputFileRef = useRef(null);
    const [combinedData, setCombinedData] = useState([]);

    const token = localStorage.getItem('authorizationData') || '';

    const getData = async (endpoint) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            return data.code === 303 ? data.result : null;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error.message);
            return null;
        }
    };
    
    const getAssessment = () => getData('assessment');
    const getRequirement = () => getData('require');
    
    useEffect(() => {
        (async () => {
            const [assessmentData, requirementData] = await Promise.all([getAssessment(), getRequirement()]);
            const combined = assessmentData.map(assItem => ({
                ...assItem,
                matchingAssessment: requirementData.filter(reqItem => assItem.id === reqItem.assessmentId),
            }));
            setCombinedData(combined);
        })();
    }, []);
    
    const handleClickFile = () => inputFileRef.current.click();
    
    const handleFilter = () => {
        const arrCondition = getInputCheck();
        if (arrCondition.length === 0) return alert('Bạn cần chọn');
    
        const files = inputFileRef.current.files;
        if (files.length > 0) {
            const formData = new FormData();
            Array.from(files).forEach(file => formData.append('file', file));
            formData.append('data', new Blob([JSON.stringify(arrCondition)], { type: 'application/json' }));
            upLoadFile(formData);
        }
    };
    
    const upLoadFile = async (file) => {
        try {
            const response = await fetch(`${BASE_URL}cv/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: file,
            });
            const data = await response.json();
            if (data.code === 303) alert("Lọc thành công");
        } catch (error) {
            console.error('Error uploading file:', error.message);
        }
    };
    
    const getInputCheck = () => {
        return Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(item => ({
            name: item.getAttribute('data-title'),
            value: item.getAttribute('data-text'),
            require: item.getAttribute('data-require')
        }));
    };
    
    const renderCriteriaList = (requirementValue, title) => (
        <>
            <h3>{title}</h3>
            <ul className={cx('criteria-list')}>
                {combinedData.filter(item => item.requirement === requirementValue).map((item, index) => (
                    <li key={index} className={cx('criteria-item')}>
                        <strong>{item.title}:</strong>
                        {item.matchingAssessment.map((i, count) => (
                            <ul className={cx('sub-criteria-list')} key={count}>
                                <li>
                                    <input
                                        type="checkbox"
                                        className={cx('checkbox')}
                                        id={`checkbox-${count}-${index}-${requirementValue}`}
                                        data-text={i.title}
                                        data-title={item.title}
                                        data-require={requirementValue}
                                    />
                                    <label htmlFor={`checkbox-${count}-${index}-${requirementValue}`}>{i.title}</label>
                                </li>
                            </ul>
                        ))}
                    </li>
                ))}
            </ul>
        </>
    );

    return (
        <>
            <div className={cx('row', 'no-gutters', 'check')}>
                <div className={cx('evaluation-form', 'pc-12', 'm-12')}>
                    <h2 className={cx('form-title')}>Tiêu chí đánh giá</h2>
                    {renderCriteriaList(1, 'Bắt buộc')}
                    {renderCriteriaList(0, 'Tùy chọn')}

                    <div className={cx('container')}>
                        <div className={cx('card')}>
                            <h3>Upload Files</h3>
                            <div className={cx('drop_box')}>
                                <header>
                                    <h4>Select File here</h4>
                                </header>
                                <p>Files Supported: PDF, TEXT, DOC , DOCX</p>
                                <input type="file" multiple hidden accept=".doc,.docx,.pdf" ref={inputFileRef} />
                                <button className={cx('btn')} onClick={handleClickFile}>
                                    Choose File
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={cx('text-center')}>
                        <button className={cx('btn', 'btn-success')} onClick={handleFilter}>
                            Lọc
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
