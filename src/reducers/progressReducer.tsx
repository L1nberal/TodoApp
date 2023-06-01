import { ProgressAction } from '../actions/progressActions';

interface StateStype {
  isRotated: boolean
}

const progressReducer = (state: StateStype, action: ProgressAction): StateStype => {
  switch (action.type) {
    case 'TOGGLE-PROGRESS-STATE': {
      return { isRotated: action.payload };
    }
    default:
      return state;
  }
};

export default progressReducer;
