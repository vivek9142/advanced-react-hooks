
import * as React from 'react'

function Counter({initialCount = 0, step = 1}) {


  //1- normal -  just returning the new State by setcount(dispatch) method
  // function countReducer(state,newState){
  //   return newState;
  // }
  // const [count,setCount] = React.useReducer(countReducer,initialCount);
  // const increment = () => setCount(count + step)
  // return <button onClick={increment}>{count}</button>

  //2 Ex-CR-1- accept the step as the action

  // function countReducer(state,step){
  //   return state+step;
  // }
  // const [count, changeCount] = React.useReducer(countReducer, initialCount)
  // const increment = () => changeCount(step)


  //3 Ex-CR-2-simulate setState with an object
  // function countReducer(state,action){
  //   return {...state,...action};
  // }
  // const [state, setState] = React.useReducer(countReducer, {
  //   count: initialCount,
  // })
  // const {count} = state
  // const increment = () => setState({count: count + step})
  // return <button onClick={increment}>{count}</button>

  //4 Ex-CR-3-simulate setState with an object OR function
  // const countReducer = (state,action) => ({
  //   //since the action being sent is func so we need to call it with args
  //   //this accepts objs n func both as param n acts accordingly
  //   ...state,
  //   ...(typeof action === 'function' ? action(state) : action),
  // });

  // const [state, setState] = React.useReducer(countReducer, {
  //   count: initialCount,
  // })
  // const {count} = state
  // const increment = () =>
  //   setState(currentState => ({count: currentState.count + step}))
  // return <button onClick={increment}>{count}</button>


  //5 Ex-CR4-traditional dispatch object with a type and switch statement
  const countReducer = (state,action) => {
    switch(action.type){
      case 'INCREMENT':
        return {...state,count:state.count+action.step};
      default:
        throw new Error(`Unsupported action type : ${action.type}`);
    }
  };

  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state
  const increment = () => dispatch({type: 'INCREMENT', step})
  
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
