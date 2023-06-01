import React from 'react';
import classnames from 'classnames/bind';
import moment from 'moment';

import styles from './DatePicker.module.css';

const cx = classnames.bind(styles);

interface Props {
  setDate: (value: string) => void
  date: string
  setTime: (value: string) => void
  time: string
  title: string
}

export const DatePicker: React.FC<Props> = ({ setDate, date, title, setTime, time }) => {
  const newDate = date.split('/').reverse().join('-');
  const today = moment(new Date().getTime()).format('YYYY-MM-DD');
  const minTime = moment(new Date()).format('HH:mm');

  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}>{title}:</div>
      <div className={cx('input-group')}>
        <input
          type='date'
          value={newDate}
          onChange={(e) => setDate(e.target.value)}
          min={today}
          required
        />
        <p>at</p>
        <input
          type='time'
          value={time}
          onChange={(e) => setTime(e.target.value)}
          min={today === date ? minTime : '00:00'}
          required
        />
      </div>
    </div>
  );
};
