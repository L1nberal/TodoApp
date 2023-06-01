import React from 'react';
import classnames from 'classnames/bind';

import styles from './App.module.css';
import { Todo } from './features/Todo/Todo';

const cx = classnames.bind(styles);

function App (): JSX.Element {
  return (
    <div className={cx('wrapper')}>
      <Todo />
    </div>
  );
}

export default App;
