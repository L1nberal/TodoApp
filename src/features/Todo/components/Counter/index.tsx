import React from 'react';
import classnames from 'classnames/bind';

import { TodoContext } from '../../contexts/TodoProvider';
import styles from './Counter.module.css';

const cx = classnames.bind(styles);

interface itemType {
  id: string
  title: string
  status: string
  date: string
  time: string
}

function Counter (): JSX.Element {
  const [activeItems, setActiveItems] = React.useState(0);
  const [completedItems, setCompletedItems] = React.useState(0);
  const [allItems, setAllItems] = React.useState(0);
  // get value from todo context
  const value = React.useContext(TodoContext);
  // add hours to date which start from 00:00AM
  function addHours (date: Date, hours: number): Date {
    date.setTime(date.getTime() + Math.floor(hours) * 60 * 60 * 1000 + (hours - Math.floor(hours)) * 100 * 60 * 1000);
    return date;
  }
  // check the deadline
  const handleCheckDeadline = (item: itemType): { timeLeft: number, newDueDate: Date } => {
    const dueDay = new Date(item.date);
    dueDay.setHours(0, 0, 0);
    const newDueDay = addHours(dueDay, Number(item.time.replace(':', '.')));
    const timeLeft = (newDueDay.getTime() - new Date().getTime()) / (1000 * 60 * 60);

    return { timeLeft: timeLeft, newDueDate: newDueDay };
  };

  React.useEffect(() => {
    let active = 0;
    let completed = 0;
    let all = 0;

    const handleCount = async (): Promise<void> => {
      const newArray = await value.state.myTodoItems.filter((item) => {
        const timeLeft = handleCheckDeadline(item).timeLeft;
        return timeLeft > 0 || item.status === 'completed';
      });

      await newArray.forEach((item) => {
        all++;

        item.status === 'active' ? active++ : completed++;
      });

      setActiveItems(active);
      setCompletedItems(completed);
      setAllItems(all);
    };

    void handleCount();
  }, [value.state.myTodoItems]);

  return (
    <ul className={cx('wrapper')}>
      <li className={cx('quantity', 'all')}>All: {allItems}</li>
      <li className={cx('quantity', 'active')}>Active: {activeItems}</li>
      <li className={cx('quantity', 'completed')}>Completed: {completedItems}</li>
    </ul>
  );
}

export default Counter;
