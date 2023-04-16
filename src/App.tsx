import { useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './features/counter/counterSlice'
import type { RootState } from './app/store'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthContext } from './context/AuthContext'


function App() {
  const [count, setCount] = useState(0)
  const value = useSelector((state: RootState) => state.counter.value)
  const { googleSignIn, googleSignOut, isSignIn } = useContext(AuthContext)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>value inside counterSlice: {value}</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      isSign : { isSignIn ? 
        (<span>true</span>): 
        (<span>false
            <button onClick={() => googleSignIn()}>
              Google sign in
            </button>
          </span>
        )
      }
    
      <button onClick={() => googleSignOut()}>
         Google signout
      </button>
    </div>
  )
}

export default App
