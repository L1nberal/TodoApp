import React, { Reducer } from 'react';

import progressReducer from '../../../reducers/progressReducer';
import { ProgressAction } from '../../../actions/progressActions';

interface stateType {
  isRotated: boolean
}

interface ProgressContextValue {
  state: stateType
  handleDispatch: (newState: { type: string, payload: boolean }) => void
}

interface PropsType{
  children: React.ReactNode
}

const ProgressContext = React.createContext<ProgressContextValue>({ state: { isRotated: false }, handleDispatch: () => {} });

const ProgressContextProvider = ({ children }: PropsType): JSX.Element => {
  const [state, dispatch] = React.useReducer<Reducer<stateType, ProgressAction>>(progressReducer, { isRotated: false });

  // define value
  const value: ProgressContextValue = {
    state: state,
    handleDispatch: (newState): void => {
      dispatch(newState);
    }
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export { ProgressContextProvider, ProgressContext };
