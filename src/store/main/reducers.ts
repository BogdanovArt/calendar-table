
// Import Reducer type
import { Reducer } from 'redux';
import {
  TodoActions,
  TodoActionTypes,
} from './actions';

// Define the Character type
export interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// Define the Character State
export interface ITodoState {
  readonly todos: ITodo[];
}

// Define the initial state
const initialTodoState: ITodoState = {
  todos: [],
};

export const todoReducer: Reducer<ITodoState, TodoActions> = (
  state = initialTodoState,
  action
) => {
  switch (action.type) {
    case TodoActionTypes.GET_ALL_TODOS: {
      // console.warn(action);
      return {
        ...state,
        todos: action.todos,
      };
    }
    default:
      return state;
  }
};
