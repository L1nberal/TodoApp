import React from 'react';
import classnames from 'classnames/bind';

import styles from './TextField.module.css';

const cx = classnames.bind(styles);

interface Props {
  setValue: (value: string) => void
  value: string
  placeholder: string
  title: string
}

export const TextField: React.FC<Props> = ({ setValue, value, placeholder, title }) => {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}>{title}:</div>
      <input
        type="text"
        className={cx('input')}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value.toLowerCase());
        }}
        required
      />
    </div>
  );
};
