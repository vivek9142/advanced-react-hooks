// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 03 make safeDispatch with useCallback, useRef, and useEffect

/*we're going to ensure that we dont call dispatch 
when the comp are unmounted . for ex I search for pikachu n run away to
another screen while the result comes, it will lead to  
warning-can't perform state update on an unmounted comp.
, its kind of a data leak.
*/
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
//making safedispatch hook  for future use.
function useSafeDispatch(dispatch){

  const mountedRef = React.useRef(false);

  /* uselayoutEffect will ensure that func is called as soon as we're mounted
    without waiting for the browser to paint the screen n also ensure cleanup is called
    as soon as we're unmounted without waiting
  */
  React.useLayoutEffect(()=>{
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    }
  },[dispatch]);

  return React.useCallback((...args) => {
    if(mountedRef.current){
      dispatch(...args)
    }
  },[dispatch]);
}



function useAsync(initialState){
  /*1-unsafe func prefix is saying that if I call this func,
  comp will rerender comp even if comp is not being mounted*/

  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState
  });
  
  // /* 3- we're making sure this dispatch func is not called when 
  // comp is unmounted. to know this we'll make a new ref*/
  // const mountedRef = React.useRef(false);

  // //here when the comp is mounted,mountedRef is set to true else false
  // React.useEffect(()=>{
  //   mountedRef.current = true;
  //   return () => {
  //     mountedRef.current = false;
  //   }
  // });

  // //2-dispatch func with all same args. it is a typical wrapper func
  // const dispatch = React.useCallback((...args) => {
  //   //if mountedRef.current is true then dispatch so it will prevent effect.
  //   if(mountedRef.current){
  //     unsafeDispatch(...args)
  //   }
    
  // },[]); //dependency list is empty since useReducer dispatch func is 
  // //stable n will not change

  //making new hook for same functionality
  const dispatch = useSafeDispatch(unsafeDispatch);

  const run = React.useCallback(promise => {
    dispatch({type:'pending'});
    promise.then(data => {
      dispatch({type:'resolved',data});
    },
    error => {
      dispatch({type:'rejected',error});
    })
  },[dispatch]);

  return {...state,run};
}

function PokemonInfo({pokemonName}) {
  const {data: pokemon, status, error, run} = useAsync({
    status: pokemonName ? 'pending' : 'idle',
  })
  
  React.useEffect(() => { 
    if (!pokemonName) {
      return
    }
    return run(fetchPokemon(pokemonName))
  }, [pokemonName, run]);


  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
