import React, { createContext, Reducer } from 'react';
import axios from 'axios';

import todoReducer from '../../../reducers/todoReducer';
import { TodoAction, addTodoItem } from '../../../actions/todoActions';

interface Props {
  children: React.ReactNode
}

interface Item {
  id: string
  title: string
  status: string
  date: string
  time: string
}

interface stateType {
  myTodoItems: Item[]
}

interface TodoContextValue {
  state: stateType
  handleDispatch: (newItem: { type: string, payload: { id: string, title: string, status: string, date: string, time: string } }) => void
}
// get items from localStorage
const storedTodoItems = localStorage.getItem('myTodoItems');

const todoItems: Item[] = storedTodoItems === null ? [] : JSON.parse(storedTodoItems);
// create context
const TodoContext = createContext<TodoContextValue>({
  state: { myTodoItems: todoItems },
  handleDispatch: () => {}
});
// create context provider
const TodoContextProvider = ({ children }: Props): JSX.Element => {
  const [state, dispatch] = React.useReducer<Reducer<stateType, TodoAction>>(todoReducer, { myTodoItems: todoItems });
  // fetch API
  React.useEffect(() => {
    axios.get('https://6465ec77228bd07b3556739a.mockapi.io/api/todo-items')
      .then(res => {
        res.data.forEach(async (item: Item) => {
          let isExist: boolean = false;
          await state.myTodoItems.forEach(stateItem => {
            if (stateItem.id === item.id) {
              isExist = true;
            }
          });

          if (!isExist) {
            const addTodoAction = addTodoItem(item);
            dispatch(addTodoAction);
          }
        });
      })
      .catch(err => { throw Error(err); });
  }, []);
  // define value
  const value: TodoContextValue = {
    state: state,
    handleDispatch: (newItem): void => {
      dispatch(newItem);
    }
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export { TodoContextProvider, TodoContext };
