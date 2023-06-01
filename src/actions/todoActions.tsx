interface Item {
  id: string
  title: string
  status: string
  date: string
  time: string
}

interface TodoAction {
  type: string
  payload: Item
}

const addTodoItem = (payload: Item): TodoAction => {
  return { type: 'ADD', payload: payload };
};

const removeTodoItem = (payload: Item): TodoAction => {
  return { type: 'REMOVE', payload: payload };
};

const updateTodoItem = (payload: Item): TodoAction => {
  return { type: 'UPDATE', payload: payload };
};

const changeStatus = (payload: Item): TodoAction => {
  return { type: 'TOGGLE-STATUS', payload: payload };
};

const updateInitialState = (payload: Item): TodoAction => {
  return { type: 'UPDATE_INITIAL_STATE', payload: payload };
};

export {
  addTodoItem,
  type TodoAction,
  removeTodoItem,
  updateTodoItem,
  changeStatus,
  updateInitialState
};
