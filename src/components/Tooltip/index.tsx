import React from 'react';
import classnames from 'classnames/bind';

import styles from './Tooltip.module.css';

const cx = classnames.bind(styles);

interface Props {
  children: React.ReactNode
  text: String
  position: string
}

function Tooltip (props: Props): JSX.Element {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('tooltip__container', `${props.position}`)}>
        <span className={cx('tooltip__text')}>
          {props.text}
        </span>
      </div>
      {props.children}
    </div>
  );
}

export default Tooltip;
