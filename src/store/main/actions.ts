
// Import redux types
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import axios from 'axios';

// Import Character Typing
import { ITodo, ITodoState } from './reducers';

// Create Action Constants
export enum TodoActionTypes {
  GET_ALL_TODOS = 'GET_ALL_TODOS',
}

// Interface for Get All Action Type
export interface ITodoGetAllAction {
  type: TodoActionTypes.GET_ALL_TODOS;
  todos: ITodo[];
}

/*
Combine the action types with a union (we assume there are more)
example: export type CharacterActions = IGetAllAction | IGetOneAction ...
*/
export type TodoActions = ITodoGetAllAction;

/* Get All Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const getAllTodos: ActionCreator<
  ThunkAction<Promise<any>, ITodoState, null, ITodoGetAllAction>
  > = (index: number) => {
  return async (dispatch: Dispatch) => {
    try {
      console.warn(index);
      const response = await axios.get(`https://jsonplaceholder.typicode.com/todos${ index ? '?userId=' + index: '' }`);
      dispatch({
        todos: response.data,
        type: TodoActionTypes.GET_ALL_TODOS,
      });
    } catch (err) {
      console.error(err);
    }
  };
};
