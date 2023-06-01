import React from 'react';
import classnames from 'classnames/bind';

import styles from './Filters.module.css';

const cx = classnames.bind(styles);

interface PropsType {
  status: string
  setStatus: Function
}

const statuses = ['All', 'Active', 'Completed'];

const Filters = (props: PropsType): JSX.Element => {
  return (
    <div className={cx('wrapper')}>
      {statuses.map(status => {
        return <button
          key={status}
          className={cx('btn', `${status.toLowerCase()}-btn`, props.status === status.toLowerCase() && 'active')}
          onClick={() => props.setStatus(status.toLowerCase())}>{status}</button>;
      })}
    </div>
  );
};

export default Filters;
