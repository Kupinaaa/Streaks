import { useEffect, useState } from "react"

const Streaks = () => {


  interface StreakInterface {
    streakName: string,
    streak: number,
    lastDate: string
  }

  const [StreakData, setStreakData] = useState([])

  useEffect( () => { 
    (async () => {
        const StreaksJSON = await fetch('/', {
          method: 'GET',
        }
      )
      console.log(StreaksJSON)
      setStreakData(await StreaksJSON.json())
    })()
  }, [] )


  if (!StreakData) throw {error: 'StreakData undefined'}

  const StreakElements = StreakData.map((Streak:StreakInterface) => {
    return(
      <div key={Streak.streakName}
           className="streak-wrapper"
      >
        <div className="streak-name">{Streak.streakName}</div>
        <div className="streak-number">{Streak.streak}</div>
      </div>
    )
  })

  return <div className="Streaks">{StreakElements}</div>
}

export default Streaks
