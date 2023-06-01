interface ProgressAction {
  type: string
  payload: boolean
}

const toggleProgressState = (payload: boolean): ProgressAction => {
  return { type: 'TOGGLE-PROGRESS-STATE', payload: payload };
};

export { toggleProgressState, type ProgressAction };
