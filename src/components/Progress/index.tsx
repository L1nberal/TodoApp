import React from 'react';
import classnames from 'classnames/bind';
import { GiCycle } from 'react-icons/gi';

import styles from './Progress.module.css';

const cx = classnames.bind(styles);

function Progress (): JSX.Element {
  return (
    <React.Fragment>
      <span className={cx('backdrop')}></span>

      <div className={cx('wrapper')}>
        <span className={cx('container')}>
          <GiCycle className={cx('icon')}/>
        </span>
      </div>
    </React.Fragment>
  );
}

export default Progress;
