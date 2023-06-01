import { TodoAction } from '../actions/todoActions';

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

const todoReducer = (state: stateType, action: TodoAction): stateType => {
  switch (action.type) {
    case 'ADD': {
      const newArray = [...state.myTodoItems];
      newArray.push(action.payload);
      localStorage.setItem('myTodoItems', JSON.stringify(newArray));
      return { myTodoItems: newArray };
    }
    case 'REMOVE': {
      const newArray = state.myTodoItems.filter(item => item.id !== action.payload.id);
      localStorage.setItem('myTodoItems', JSON.stringify(newArray));
      return { myTodoItems: newArray };
    }
    case 'UPDATE': {
      const newArray = state.myTodoItems.map(item => {
        if (item.id === action.payload.id) {
          item = action.payload;
        }
        return item;
      });
      localStorage.setItem('myTodoItems', JSON.stringify(newArray));
      return { myTodoItems: newArray };
    }
    case 'TOGGLE-STATUS': {
      const newArray = state.myTodoItems.map(item => {
        if (item.id === action.payload.id) {
          item = action.payload;
        }
        return item;
      });
      localStorage.setItem('myTodoItems', JSON.stringify(newArray));
      return { myTodoItems: newArray };
    }
    case 'UPDATE_INITIAL_STATE': {
      const newArray = [...state.myTodoItems];
      newArray.forEach(item => {
        if (item.id !== action.payload.id) {
          newArray.push(action.payload);
        }
      });
      localStorage.setItem('myTodoItems', JSON.stringify(newArray));

      return { myTodoItems: newArray };
    }
    default:
      return state;
  }
};

export default todoReducer;
