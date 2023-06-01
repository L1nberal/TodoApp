import React from 'react';
import classnames from 'classnames/bind';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

import AddBtn from './components/AddBtn';
import TodoItem from './components/TodoItem/TodoItem';
import styles from './Todo.module.css';
import Filters from './components/Filters/Filters';
import Counter from './components/Counter';
import OutOfTimeItems from './components/OutOfTimeItems';
import Progress from '../../components/Progress';
import { ProgressContext } from './contexts/ProgressProvider';

const cx = classnames.bind(styles);

export const Todo = (): JSX.Element => {
  const [status, setStatus] = React.useState('all'); // Storing filtered status
  const [display, setDisplay] = React.useState(false); // displaying failed to fulfill list
  //  get value from context
  const progressValue = React.useContext(ProgressContext);

  return (
    <div className={cx('wrapper')}>
      {progressValue.state.isRotated && <Progress />}

      <h3 className={cx('title')}>Todo Application</h3>

      <div className={cx('action-container')}>
        <Filters status={status} setStatus={setStatus}/>
        <AddBtn />
      </div>

      <TodoItem status={status}/>

      <div className={cx('footer')}>
        <OutOfTimeItems display={display}/>

        <button className={cx('footer__btn', 'secondary')} onClick={() => setDisplay(!display)}>
          <BsFillArrowLeftCircleFill className={cx('footer__btn-icon')}/>
          <p className={cx('footer__btn-text')}>Failed to fulfill</p>
        </button>

        <Counter/>
      </div>
    </div>
  );
};
