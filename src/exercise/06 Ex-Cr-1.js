import * as React from 'react'

//1 -ExCr1 - use the format function

const formatCountDebugValue = ({query,state}) => `\`${query}\` => ${state}`;
function useMedia(query, initialState = false) {
  const [state, setState] = React.useState(initialState)
  //2nd param will take the object in 1st arg as its arg n return the value to debug value
  React.useDebugValue({query, state}, formatCountDebugValue);
  // 💰 here's the formatted label I use: `\`${query}\` => ${state}`

  React.useEffect(() => {
    let mounted = true
    const mql = window.matchMedia(query)
    function onChange() {
      if (!mounted) {
        return
      }
      setState(Boolean(mql.matches))
    }

    mql.addListener(onChange)
    setState(mql.matches)

    return () => {
      mounted = false
      mql.removeListener(onChange)
    }
  }, [query])

  return state
}

function Box() {
  const isBig = useMedia('(min-width: 1000px)')
  const isMedium = useMedia('(max-width: 999px) and (min-width: 700px)')
  const isSmall = useMedia('(max-width: 699px)')
  const color = isBig ? 'green' : isMedium ? 'yellow' : isSmall ? 'red' : null

  return <div style={{width: 200, height: 200, backgroundColor: color}} />
}

function App() {
  return <Box />
}

export default App
