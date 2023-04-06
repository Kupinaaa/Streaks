import { useEffect, useState, useRef } from "react"

const Streaks = () => {

  interface StreakInterface {
    streakName: string,
    streak: number,
    lastDate: string,
    done: boolean
  }

  const [StreakData, setStreakData] = useState<StreakInterface[]>([
    { streakName: "L", streak: 10000, lastDate: "test", done: true },
    { streakName: "Working Out", streak: 2, lastDate: "test", done: false },
    { streakName: "Doing Github", streak: 225, lastDate: "test", done: false }
  ])
  
  // const [StreakData, setStreakData] = useState<StreakInterface[]>([])
  const [newStreakModal, setNewStreakModal] = useState(false)
  const [newStreakName, setNewStreakName] = useState('')
  const newStreakFocusRef = useRef<any>()

  const [streakDisplayModal, setStreakDisplayModal] = useState(false)
  const streakDisplay = useRef<any>(null)

  useEffect( () => { 
    (async () => {
      const StreaksJSON = await fetch('http://localhost:3000', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      })

      let FetchedStreaks = await StreaksJSON.json()

      const Today = new Date()
      Today.setHours(0, 0, 0, 0)

      setStreakData(FetchedStreaks.map((streak: StreakInterface) => {
        if (streak.lastDate === Today.toJSON()){
          console.log({...streak, done: true})
          return {...streak, done: true}
        } else return {...streak, done: false}
      }))
    })()
    console.log('aboba')
  }, [] )

  useEffect( () => {
    if (newStreakFocusRef.current != null) newStreakFocusRef.current.focus()
  }, [newStreakModal] )

  // if (!StreakData) throw {error: 'StreakData undefined'}

  const serverUpdateStreak = (changeStreakName: string) => {
    const changeStreak = StreakData.find((Streak) => {
      if (Streak.streakName === changeStreakName) return true
      else return false
    })
    if(changeStreak == null) return

    const Today = new Date()
    Today.setHours(0, 0, 0, 0)
    changeStreak.lastDate = Today.toJSON()

    fetch('http://localhost:3000', {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(changeStreak)
    })
  }

  const addNewStreak = (newStreakName: string) => {
    if(newStreakName == '' || StreakData.find((Streak) => { if(Streak.streakName == newStreakName) return true })) return

    const Yesterday = new Date()
    Yesterday.setHours(-24, 0, 0, 0)    // Set date to prev day

    const newStreak: StreakInterface = {
      streakName: newStreakName,
      streak: 0,
      done: false,
      lastDate: Yesterday.toJSON()
    }

    setStreakData((prev) => {
      return [...prev, newStreak]
    })

    fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newStreak)
    })
  }

  const handleStreakClick = (changeStreakName: string) => {
    setStreakData(() => {
      let changed: StreakInterface | undefined
      let newStreakData: StreakInterface[] = []

      StreakData.forEach((streak, index) => {
        if (streak.streakName === changeStreakName){
          changed = StreakData[index]
        } else {
          newStreakData.push(StreakData[index])
        } 
      })

      if(changed != undefined) {
        changed.done = !changed.done
        if (changed.done === true) changed.streak++
        else changed.streak--
        newStreakData.push(changed)
      }

      return newStreakData
    })
    serverUpdateStreak(changeStreakName)
  }
  
  let notDoneStreakElements: JSX.Element[] = [], doneStreakElements: JSX.Element[] = []

  StreakData.forEach((Streak:StreakInterface) => {
    const StreakElement = (
      <div key={Streak.streakName}
           className="streakWrapper"
           onClick={() => {
            setStreakDisplayModal(true)
            streakDisplay.current = Streak
          }}
      >
        <div className="streakName">{Streak.streakName}</div>
        <div className="streakNumber">{Streak.streak}</div>
      </div>
    )
    if (Streak.done == true) doneStreakElements.push(StreakElement)
    else notDoneStreakElements.push(StreakElement)
  })

  console.log(newStreakName)

  return ( 
    <>
    <div className="Streaks" >
      <div className="notDoneStreaks">
        <div className="title">Not Done</div>
        {notDoneStreakElements}
        <div className="addStreak"
        onClick={() => { setNewStreakModal(prev => !prev) }}>
          <div className="plus">
            <div className="vert"></div>
            <div className="horiz"></div>
          </div>
        </div>
      </div>
      <div className="doneStreaks">
        <div className="title">Done</div>
        {doneStreakElements}
      </div>
    </div>
    { newStreakModal && <div className="newStreakModal frosted" 
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          setNewStreakModal(false)
        } 
      }}
      onKeyDown={(e) => {
        if(e.key == 'Enter' || e.key == 'Escape'){
          addNewStreak(newStreakName)
          setNewStreakModal(false)
          setNewStreakName('')
        }
      }}>
      <div className="newStreakBox">
        <input className="newStreakInput" ref={newStreakFocusRef} name="newStreakName" type="text" placeholder="Streak name" value={newStreakName} onChange={e => setNewStreakName(e.target.value)}/>
        <div className="bottomNav">
          <div className="button cancel" onClick={(e) => {setNewStreakModal(false)}}>Cancel</div>
          <div className="button add" onClick={(e) => {
            addNewStreak(newStreakName)
            setNewStreakModal(false)
            setNewStreakName('')
          }} >Add</div>
        </div>
      </div>
    </div> } 
    { streakDisplayModal && 
      <div className="streakDisplayModal"
        onClick={(e) => {
          if (e.target == e.currentTarget) {
            setStreakDisplayModal(false)
          } 
        }}
        onKeyDown={(e) => {
          if(e.key == 'Enter' || e.key == 'Escape'){
            setStreakDisplayModal(false)
            console.log(e.key)
          }
        }}
      >
        <div className="streakDisplayBox">{ "bruh (the ref bs doesn't work lol)" }</div>
      </div>
    }
    </>
  )
}

export default Streaks