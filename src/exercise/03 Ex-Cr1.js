import * as React from 'react'

const CountContext = React.createContext();
//03-EX-CR1 create a consumer hook

function useCount(){
  //get the context n return error if not getting it 
  const context = React.useContext(CountContext);
  if(!context) {
    throw new Error('Counter must be use within the CountProvider');
  }

  return context;
}
function CountProvider(props) {
  const [count,setCount] = useCount();
  const value = [count,setCount];
  return <CountContext.Provider value={value} {...props}/>
}
function CountDisplay() {
  const [count] = useCount();
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  //moving all the concerned items into new hook useCount
  const [,setCount] = useCount();
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {

  return (
    <div>
      <CountProvider>
      <CountDisplay />
      <Counter />
      </CountProvider>

      {/* If we pass this below calling comp you will get the
      error  - The provider is not enclsing the Counter comp 
      so the Counter comp will not get context but it can get the 
      default values defined in the createContext func*/}

      {/* <CountProvider>
      <CountDisplay />
      </CountProvider>
      <Counter /> */}
      
    </div>
  )
}

export default App
