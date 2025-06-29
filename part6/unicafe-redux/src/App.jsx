import React from 'react'

const App = ({ store }) => {
  const good = () => {
    store.dispatch({ type: 'GOOD' })
  }

  const ok = () => {
    store.dispatch({ type: 'OK' })
  }

  const bad = () => {
    store.dispatch({ type: 'BAD' })
  }

  const reset = () => {
    store.dispatch({ type: 'ZERO' })
  }

  const state = store.getState()

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={good}>good</button>
      <button onClick={ok}>ok</button>
      <button onClick={bad}>bad</button>
      <button onClick={reset}>reset stats</button>

      <h2>statistics</h2>
      <div>good {state.good}</div>
      <div>ok {state.ok}</div>
      <div>bad {state.bad}</div>
    </div>
  )
}

export default App
