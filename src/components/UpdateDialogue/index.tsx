import React from 'react';
import classnames from 'classnames/bind';
import axios from 'axios';

import styles from './UpdateDialogue.module.css';
import { TextField } from '../TextField/TextField';
import { DatePicker } from '../DatePicker/DatePicker';
import { TodoContext } from '../../features/Todo/contexts/TodoProvider';
import { updateTodoItem } from '../../actions/todoActions';
import { ProgressContext } from '../../features/Todo/contexts/ProgressProvider';
import { toggleProgressState } from '../../actions/progressActions';

const cx = classnames.bind(styles);

interface PropsType {
  id: string
  title: string
  time: string
  date: string
  status: string
  display: string
  setDisplay: Function
}

interface Item {
  id: string
  title: string
  status: string
  date: string
  time: string
}

function UpdateDialogue (props: PropsType): JSX.Element {
  const [title, setTitle] = React.useState(props.title);
  const [date, setDate] = React.useState(props.date);
  const [time, setTime] = React.useState(props.time);
  // Get value from context
  const todoValue = React.useContext(TodoContext);
  const progressValue = React.useContext(ProgressContext);
  // set document title
  React.useEffect(() => {
    document.title = title;

    if (props.display === '') {
      document.title = '';
    }
  }, [props.display, title]);
  // updating title, date, time
  React.useEffect(() => {
    setTitle(props.title);
    setTime(props.time);
    setDate(props.date);
  }, [props.title, props.date, props.time]);
  // dispatch action to update
  const handleTodoDispatch = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      props.setDisplay('');
      event.preventDefault();
      // dispatch for toggling progress state -- true
      let toggleProgressAction = toggleProgressState(true);
      progressValue.handleDispatch(toggleProgressAction);
      const newItem: Item = { id: props.id, title: title, time: time, date: date, status: props.status };
      await axios.put(`${process.env.REACT_APP_MOCKAPI as string}/${props.id}`, newItem)
        .then(res => {})
        .catch(err => { throw Error(err); });
      // Adding the new item to todo app
      const updateTodoAction = updateTodoItem(newItem);
      todoValue.handleDispatch(updateTodoAction);
      // dispatch for toggling progress state -- false
      toggleProgressAction = toggleProgressState(false);
      progressValue.handleDispatch(toggleProgressAction);
      alert('Updating the item successfully!');
    } catch (err) {
      alert(err);
    }
  };
  // Adding styles based on display value
  const style: React.CSSProperties = {
    visibility: props.display !== '' && props.display === props.id ? 'visible' : 'hidden',
    opacity: props.display !== '' ? '1' : '0',
    top: props.display !== '' ? '15%' : '25%'
  };

  return (
    <td className={cx('wrapper')} style={style}>
      <h2 className={cx('title')}>Update</h2>
      <form onSubmit={(e) => { void handleTodoDispatch(e); }} className={cx('form')}>
        <div className={cx('input-group')}>
          <TextField
            setValue={setTitle}
            value={title}
            placeholder="Type title..."
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
          <button className={cx('btn', 'ok-btn', 'primary')} type='submit'>Ok</button>
          <button className={cx('btn', 'cancel-btn', 'danger')} onClick={() => props.setDisplay('')} type='button'>Cancel</button>
        </div>
      </form>
    </td>
  );
}

export default UpdateDialogue;
