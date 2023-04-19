import { useState, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './features/counter/counterSlice'
import type { RootState } from './app/store'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthContext } from './context/AuthContext'
import { db } from './firebase'
import { addDoc, collection, getDocs, setDoc, updateDoc, deleteDoc, doc, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";

function App() {
  const [count, setCount] = useState(0)
  const [firebaseData, setFirebaseData] = useState<{doc_id: string, data: any}[]>([])
  const value = useSelector((state: RootState) => state.counter.value)
  const { googleSignIn, googleSignOut, isSignIn } = useContext(AuthContext)
  
  function dealWithTime(seconds: number, nanoseconds: number) {
    let date = null
    let timestamp = seconds * 1000 + nanoseconds / 1000000
    const d = new Date(timestamp)
    date = d.toString();
    return date
  }

  const collectionRef = collection(db, "myCollections"); // get collection 
  
  useEffect(() => {
    const getData = async () => {
      const data = await query(collectionRef) // Get multiple documents from a collection
      onSnapshot(data, (querySnapshot) => {
        console.log('num of docs of a collection: ', querySnapshot.docs)
        const docDataArray = querySnapshot.docs.map((doc) => {
          const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
          if (source === 'Local') {
            return (
              {
                doc_id: doc.id,
                data: '',
              }
            )
          } else {
            return (
              {
                doc_id: doc.id,
                data: doc.data(),
              }
            )
          }
          // if(row.Time === null) {
          //   row.Time = doc.get('Time', {serverTimestamps: 'estimate'})
          // } 
          }
        )
        console.log(docDataArray)
        setFirebaseData(docDataArray)
      })
    }
    getData()
  }, [])

  const addData = async () => {
    try{
      await addDoc(collectionRef, {"Time": serverTimestamp()})
    } catch(e){
      console.log(e)
    } 
  }
  const cleanData = async () => {
    const querySnapshot = await getDocs(collectionRef)
    querySnapshot.forEach(async (document) => {
      try {
        await deleteDoc(doc(db, 'myCollections', document.id))
      } catch (e) {
        console.log(e)
      }
    });
    alert('delete all docs of collection')
  }

  const updateData = async() => {
    const docRef = doc(db, 'myCollections', 'myDoc');
    try {
      await updateDoc(docRef, {
        Test: true
      });
    } catch (e) {
      console.log(e)
    } 
  }
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
     
      <div>
      <div>
        <button onClick={() => addData()}>
          Create data
        </button>
        <button onClick={() => cleanData()}>
          Clean data
        </button>
        <button onClick={() => updateData()}>
          Update data 
        </button>
      </div>
        firebase data: 
        {firebaseData.map((item, index) => {
          return (
            <div key={item.doc_id}>
              {index + 1} doc_id : {item.doc_id} 
              {
                Object.keys(item.data).map((k) => {
                  return (
                  <div key={k}>key: {k} value: { 
                    typeof(item.data[k]) !== "object" && k !== "Time" ? 
                    item.data[k] : 
                    dealWithTime(item.data[k]['seconds'], item.data[k]['nanoseconds'])
                    }
                  </div>)
                })
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
