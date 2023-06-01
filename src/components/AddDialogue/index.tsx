import React, { useContext } from 'react';
import classnames from 'classnames/bind';
import axios from 'axios';

import { TextField } from '../TextField/TextField';
import { DatePicker } from '../DatePicker/DatePicker';
import styles from './AddDialogue.module.css';
import { addTodoItem } from '../../actions/todoActions';
import { TodoContext } from '../../features/Todo/contexts/TodoProvider';
import { ProgressContext } from '../../features/Todo/contexts/ProgressProvider';
import { toggleProgressState } from '../../actions/progressActions';

const cx = classnames.bind(styles);

interface PropsType {
  display: boolean
  setDisplay: Function
}

interface Item {
  id: string
  title: string
  status: string
  date: string
  time: string
}

const AddDialogue = (props: PropsType): JSX.Element => {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  // get value from context
  const todoValue = useContext(TodoContext);
  const progressValue = useContext(ProgressContext);
  // set document title
  React.useEffect(() => {
    document.title = title;
  }, [title]);
  // dispatch so as to add a new item
  const handleDispatch = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault();
      props.setDisplay(false);
      // dispatch for toggling progress state -- true
      let toggleProgressAction = toggleProgressState(true);
      progressValue.handleDispatch(toggleProgressAction);
      // post API
      let newItem: Item = { id: '', title: title, status: 'active', date: date, time: time };
      await axios.post(`${process.env.REACT_APP_MOCKAPI as string}`, newItem)
        .then(res => { newItem = res.data; })
        .catch(err => { throw Error(err); });
      // Adding to todoApp
      const addTodoAction = addTodoItem(newItem);
      todoValue.handleDispatch(addTodoAction);
      // dispatch for toggling progress state -- false
      toggleProgressAction = toggleProgressState(false);
      progressValue.handleDispatch(toggleProgressAction);
      setTitle('');
      setDate('');
      setTime('');
      alert('Adding a new item successfully!');
    } catch (err) {
      alert(err);
    }
  };
  // Adding styles based on display value
  const style: React.CSSProperties = {
    visibility: props.display ? 'visible' : 'hidden',
    opacity: props.display ? '1' : '0',
    top: props.display ? '15%' : '25%'
  };

  return (
    <div className={cx('wrapper')} style={style}>
      <h3 className={cx('title')}>Adding an Item</h3>
      <form onSubmit={(e) => { void handleDispatch(e); }} className={cx('form')}>
        <div className={cx('input-group')}>
          <TextField
            setValue={setTitle}
            value={title}
            placeholder='Type title...'
            title='Job title (what you are gonna go)'
          />
          <DatePicker
            setDate={setDate}
            date={date}
            time={time}
            setTime={setTime}
            title='Due day (fulfill it before this milestone)'
          />
        </div>
        <div className={cx('btn-group')}>
          <button className={cx('btn', 'ok-btn', 'primary')}>Ok</button>
          <button className={cx('btn', 'cancel-btn', 'danger')} onClick={() => {
            props.setDisplay(false);
            setTitle('');
            setDate('');
            setTime('');
          }} type='button'>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddDialogue;
