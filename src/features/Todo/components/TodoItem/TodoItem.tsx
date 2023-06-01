import React from 'react';
import classnames from 'classnames/bind';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { IoIosTime } from 'react-icons/io';
import { FcAlarmClock } from 'react-icons/fc';
import moment from 'moment';
import axios from 'axios';

import styles from './TodoItem.module.css';
import { TodoContext } from '../../contexts/TodoProvider';
import { removeTodoItem, changeStatus } from '../../../../actions/todoActions';
import UpdateDialogue from '../../../../components/UpdateDialogue';
import Tooltip from '../../../../components/Tooltip';
import { ProgressContext } from '../../contexts/ProgressProvider';
import { toggleProgressState } from '../../../../actions/progressActions';

interface itemType {
  id: string
  title: string
  status: string
  date: string
  time: string
}

interface PropsType {
  status: string
}

const cx = classnames.bind(styles);

const TodoItem = (props: PropsType): JSX.Element => {
  // set display to update modal
  const [display, setDisplay] = React.useState('');
  // get value from context
  const todoValue = React.useContext(TodoContext);
  const progressValue = React.useContext(ProgressContext);
  // create toggle progress action
  let toggleProgressAction = toggleProgressState(true);
  // Adding hours to date
  function addHours (date: Date, hours: number): Date {
    date.setTime(date.getTime() + Math.floor(hours) * 60 * 60 * 1000 + (hours - Math.floor(hours)) * 100 * 60 * 1000);
    return date;
  }
  // reorganizing the order of items in the array
  let temporary;

  for (let i = 0; i <= todoValue.state.myTodoItems.length - 1; i++) {
    for (let j = i + 1; j < todoValue.state.myTodoItems.length; j++) {
      const dueDayI = new Date(todoValue.state.myTodoItems[i].date);
      dueDayI.setHours(0, 0, 0);
      const newDueDayI = addHours(dueDayI, Number(todoValue.state.myTodoItems[i].time.replace(':', '.')));
      const dueDayJ = new Date(todoValue.state.myTodoItems[j].date);
      dueDayJ.setHours(0, 0, 0);
      const newDueDayJ = addHours(dueDayJ, Number(todoValue.state.myTodoItems[j].time.replace(':', '.')));

      if (newDueDayI.getTime() > newDueDayJ.getTime()) {
        temporary = todoValue.state.myTodoItems[i];
        todoValue.state.myTodoItems[i] = todoValue.state.myTodoItems[j];
        todoValue.state.myTodoItems[j] = temporary;
      }
    }
  }
  // dispatch for Removing an item from the myTodoItems
  const handleTodoDispatch = (item: itemType): void => {
    if (confirm('Are you really want to delete it?')) {
      try {
        // dispatch for toggling progress state -- true
        progressValue.handleDispatch(toggleProgressAction);
        // post API
        axios.delete(`${process.env.REACT_APP_MOCKAPI as string}/${item.id}`)
          .then(res => {
            const removeTodoAction = removeTodoItem(item);
            todoValue.handleDispatch(removeTodoAction);
            // dispatch for toggling progress state -- false
            toggleProgressAction = toggleProgressState(false);
            progressValue.handleDispatch(toggleProgressAction);
          })
          .catch(err => alert(err));
      } catch (err) {
        alert(err);
      }
    }
  };
  // Update status
  const handleUpdateStatus = async (item: itemType): Promise<void> => {
    const updatedItem = {
      id: item.id,
      title: item.title,
      status: 'completed',
      date: item.date,
      time: item.time
    };

    if (confirm('Are you sure to mark it as completed?')) {
      // dispatch for toggling progress state -- true
      progressValue.handleDispatch(toggleProgressAction);
      // post API
      await axios.put(`${process.env.REACT_APP_MOCKAPI as string}/${item.id}`, updatedItem)
        .then(res => {
          console.log('run');
          const changeStatusAction = changeStatus(updatedItem);
          todoValue.handleDispatch(changeStatusAction);
        })
        .catch(err => alert(err));
      // dispatch for toggling progress state -- false
      toggleProgressAction = toggleProgressState(false);
      progressValue.handleDispatch(toggleProgressAction);
    }
  };
  // check the deadline
  const handleCheckDeadline = (item: itemType): { timeLeft: number, warningTime: string } => {
    const dueDay = new Date(item.date);
    dueDay.setHours(0, 0, 0);
    const newDueDay = addHours(dueDay, Number(item.time.replace(':', '.')));
    const timeLeft = (newDueDay.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const warningTime = moment(newDueDay).fromNow();
    return { timeLeft: timeLeft, warningTime: warningTime };
  };
  // remove out of time items
  const newArray = todoValue.state.myTodoItems.filter(item => {
    const timeLeft = handleCheckDeadline(item).timeLeft;
    return timeLeft > 0 || item.status === 'completed';
  });

  return (
    <div className={cx('wrapper')}>
      <table className={cx('table')}>
        <thead className={cx('head')}>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Status</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={cx('body')}>
          {newArray.length > 0
            ? (<React.Fragment>
              {newArray.map((item, index) => {
                // Stylizing status
                const statusStyle = { color: item.status === 'completed' ? '#67c23a' : '#f56c6c' };
                // Check the deadline
                const timeObject = handleCheckDeadline(item);
                // format time
                function formatTime (time: string): string {
                  const [hourString, minute] = time.split(':');
                  const hour = +hourString % 24;
                  const amPm = hour < 12 ? 'AM' : 'PM';
                  const formattedHour = (hour % 12).toString();
                  const result = formattedHour + ':' + minute + amPm;
                  return result;
                }
                const formattedTime = formatTime(item.time);
                // check if the title overflows its parent
                let showFullTitle = false;
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const font = '17px Arial';
                let metrics;
                if (context !== null) {
                  context.font = font;
                  metrics = context?.measureText(item.title);
                  if (metrics !== null && metrics !== undefined && metrics.width > 280) {
                    showFullTitle = true;
                  }
                }
                return (
                  <React.Fragment key={index}>
                    {(props.status === 'all' ? true : props.status === item.status) && (
                      <tr className={cx('item')}>
                        <td className={cx('item__infor')}>
                          <div className={cx('item__order')}>{index + 1}</div>
                        </td>
                        <td className={cx('item__infor')}>
                          <div className={cx('item__title-container')}>
                            {showFullTitle
                              ? (
                                <Tooltip text={item.title} position='bottom'>
                                  <div className={cx('item__title')}>
                                    <span id='item__title-text'>{item.title}</span>
                                  </div>
                                </Tooltip>)
                              : (
                                <div className={cx('item__title')}>
                                  <span id='item__title-text'>{item.title}</span>
                                </div>)
                            }

                            {timeObject.timeLeft <= 24 && item.status !== 'completed' && (
                              <span className={cx('item__title-warning')}>
                                <FcAlarmClock className={cx('item__title-warning-icon')}/>
                                {timeObject.warningTime}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={cx('item__infor', 'item__infor-status')} style={statusStyle}>
                          {item.status}
                        </td>
                        <td className={cx('item__infor', 'item__date')}>
                          <b>{formattedTime}</b> on <b>{item.date}</b>
                        </td>
                        <td className={cx('item__btn-group')}>
                          <div className={cx('item__actions-container')}>
                            {item.status !== 'completed' && (
                              <Tooltip text='edit item' position='left'>
                                <button
                                  className={cx('item__btn', 'item__edit-btn')}
                                  onClick={() => { setDisplay(item.id); }}
                                >
                                  <AiFillEdit/>
                                </button>
                              </Tooltip>
                            )}
                            <Tooltip text='delete item' position='left'>
                              <button
                                className={cx('item__btn', 'item__delete-btn')}
                                onClick={() => handleTodoDispatch(item)}
                              >
                                <AiFillDelete/>
                              </button>
                            </Tooltip>
                            {item.status !== 'completed' && (
                              <Tooltip text='mark it as completed' position='left'>
                                <button
                                  className={cx('item__btn', 'item__btn-toggle-status')}
                                  onClick={() => { void handleUpdateStatus(item); }}
                                >
                                  <IoIosTime className={cx('item__active-icon')}/>
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                        <UpdateDialogue
                          id={item.id}
                          title={item.title}
                          time={item.time}
                          date={item.date}
                          status={item.status}
                          display={display}
                          setDisplay={setDisplay}
                        />
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>)
            : (<tr><td colSpan={5}>No items</td></tr>)}
        </tbody>
      </table>

      {display.length > 0 && <span className={cx('curtain')}></span>}
    </div>
  );
};

export default TodoItem;
