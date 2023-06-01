import React from 'react';
import classnames from 'classnames/bind';

import styles from './AddBtn.module.css';
import AddDialogue from '../../../../components/AddDialogue';

const cx = classnames.bind(styles);

const AddBtn = (): JSX.Element => {
  const [display, setDisplay] = React.useState(false);

  return (
    <div className={cx('wrapper')}>
      <button className={cx('btn')} onClick={() => setDisplay(true)}>Add</button>
      {display && <div className={cx('curtain')}></div>}
      <AddDialogue display={display} setDisplay={setDisplay}/>
    </div>
  );
};

export default AddBtn;
