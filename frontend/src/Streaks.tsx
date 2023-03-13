import { JSXElementConstructor, ReactElement, ReactFragment, useEffect, useState } from "react"

const Streaks = () => {


  interface StreakInterface {
    streakName: string,
    streak: number,
    lastDate: string,
    done: boolean
  }

  const [StreakData, setStreakData] = useState<StreakInterface[]>([
    { streakName: "StreakName", streak: 5, lastDate: "test", done: true },
    { streakName: "Working Out", streak: 2, lastDate: "test", done: false },
    { streakName: "Doing Github", streak: 225, lastDate: "test", done: false }
  ])
  
  // const [StreakData, setStreakData] = useState<StreakInterface[]>([])

  useEffect( () => { 
    (async () => {
        const StreaksJSON = await fetch('http://localhost:3000', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      let FetchedStreaks = await StreaksJSON.json()
      const Today = new Date()
      Today.setHours(0, 0, 0, 0)
      setStreakData(FetchedStreaks.map((streak:StreakInterface) => {
        if (streak.lastDate === Today.toJSON()){
          console.log({...streak, done: true})
          return {...streak, done: true}
        } else return {...streak, done: false}
      }))
    })()
  }, [] )



  // if (!StreakData) throw {error: 'StreakData undefined'}

  const sendNewStreak = (changeStreakName: string) => {
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

  const handleClick = (changeStreakName: string) => {
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
    sendNewStreak(changeStreakName)
  }
  
  let notDoneStreakElements: JSX.Element[] = [], doneStreakElements: JSX.Element[] = []

  StreakData.forEach((Streak:StreakInterface) => {
    const StreakElement = (
      <div key={Streak.streakName}
           className="streak-wrapper"
           onClick={() => {handleClick(Streak.streakName)}}
      >
        <div className="streak-name">{Streak.streakName}</div>
        <div className="streak-number">{Streak.streak}</div>
      </div>
    )

    if (Streak.done == true) doneStreakElements.push(StreakElement)
    else notDoneStreakElements.push(StreakElement)
  })
  

  return ( 
    <div className="Streaks">
      <div className="notDoneStreaks">
        <div className="title">Not Done</div>
        {notDoneStreakElements}
      </div>
      <div className="doneStreaks">
        <div className="title">Done</div>
        {doneStreakElements}
      </div>
    </div>
  )
}

export default Streaks
