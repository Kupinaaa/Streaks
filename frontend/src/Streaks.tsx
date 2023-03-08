import { JSXElementConstructor, ReactElement, ReactFragment, useEffect, useState } from "react"

const Streaks = () => {


  interface StreakInterface {
    streakName: string,
    streak: number,
    lastDate: string,
    done: boolean
  }

  const [StreakData, setStreakData] = useState([
    { streakName: "StreakName", streak: 5, lastDate: "test", done: true },
    { streakName: "Working Out", streak: 2, lastDate: "test", done: false },
    { streakName: "Doing Github", streak: 225, lastDate: "test", done: false }
  ])

  useEffect( () => { 
    (async () => {
        const StreaksJSON = await fetch('http://localhost:3000', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      console.log(StreaksJSON)
      setStreakData(await StreaksJSON.json())
    })()
  }, [] )


  if (!StreakData) throw {error: 'StreakData undefined'}
  
  let notDoneStreakElements: JSX.Element[] = [], doneStreakElements: JSX.Element[] = []

  StreakData.forEach((Streak:StreakInterface) => {
    const StreakElement = (
      <div key={Streak.streakName}
           className="streak-wrapper"
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
