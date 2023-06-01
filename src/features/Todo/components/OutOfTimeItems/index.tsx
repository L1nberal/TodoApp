import React from 'react';
import classnames from 'classnames/bind';
import { IoIosRemoveCircle } from 'react-icons/io';
import axios from 'axios';

import styles from './OutOfTimeItems.module.css';
import { TodoContext } from '../../contexts/TodoProvider';
import { removeTodoItem } from '../../../../actions/todoActions';
import Tooltip from '../../../../components/Tooltip';
import { ProgressContext } from '../../contexts/ProgressProvider';
import { toggleProgressState } from '../../../../actions/progressActions';

const cx = classnames.bind(styles);

interface itemType {
  id: string
  title: string
  status: string
  date: string
  time: string
}

interface PropsType {
  display: boolean
}

function OutOfTimeItems (props: PropsType): JSX.Element {
  // Get value from context
  const todoValue = React.useContext(TodoContext);
  const progressValue = React.useContext(ProgressContext);
  // Adding hours to date
  function addHours (date: Date, hours: number): Date {
    date.setTime(date.getTime() + Math.floor(hours) * 60 * 60 * 1000 + (hours - Math.floor(hours)) * 100 * 60 * 1000);
    return date;
  }
  // check the deadline
  const handleCheckDeadline = (item: itemType): { timeLeft: number } => {
    const dueDay = new Date(item.date);
    dueDay.setHours(0, 0, 0);
    const newDueDay = addHours(dueDay, Number(item.time.replace(':', '.')));
    const timeLeft = (newDueDay.getTime() - new Date().getTime()) / (1000 * 60 * 60);

    return { timeLeft: timeLeft };
  };
  // Get out of time items
  const newArray = todoValue.state.myTodoItems.filter(item => {
    const timeLeft = handleCheckDeadline(item).timeLeft;
    return timeLeft < 0 && item.status !== 'completed';
  });
  // handle remove item
  const handleRemoveItem = (item: itemType): void => {
    if (confirm('Are you really want to delete it?')) {
      // dispatch for toggling progress state -- true
      let toggleProgressAction = toggleProgressState(true);
      // post API
      progressValue.handleDispatch(toggleProgressAction);
      axios.delete(`${process.env.REACT_APP_MOCKAPI as string}/${item.id}`)
        .then(res => {
          const removeItemAction = removeTodoItem(item);
          todoValue.handleDispatch(removeItemAction);
          // dispatch for toggling progress state -- false
          toggleProgressAction = toggleProgressState(false);
          progressValue.handleDispatch(toggleProgressAction);
        })
        .catch(err => alert(err));
    }
  };

  return (
    <div className={cx('wrapper')} style={{ display: props.display ? 'block' : 'none' }}>
      <table className={cx('table')}>
        <thead className={cx('head')}>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className={cx('body')}>
          {newArray.map((item, index) => {
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
              if (metrics !== null && metrics !== undefined && metrics.width > 200) {
                showFullTitle = true;
              }
            }

            return (
              <tr key={index} className={cx('body__row')}>
                <td>{index + 1}</td>
                <td>
                  {showFullTitle
                    ? (
                      <Tooltip text={item.title} position='bottom'>
                        <div className={cx('body__row-title')}>
                          {item.title}
                        </div>
                      </Tooltip>
                      )
                    : (
                      <React.Fragment>
                        <div className={cx('body__row-title')}>
                          {item.title}
                        </div>
                      </React.Fragment>
                      )
                  }
                </td>
                <td><b className={cx('body__row-date')}>{formattedTime} on {item.date}</b></td>
                <td><button className={cx('btn', 'danger')} onClick={() => { handleRemoveItem(item); }}><IoIosRemoveCircle/></button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OutOfTimeItems;
