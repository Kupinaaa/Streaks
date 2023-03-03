const Streaks = () => {

  const getStreaks = () => {
    const StreaksJSON = fetch(
      'localhost:3000',
      {
        method: 'GET'
      }
    )
    return JSON.stringify(StreaksJSON)
  }

  const PrototypeOfStreaks = [{streakName: "StreakTest", streak: 10}, {streakName: "Streak test No2", streak: 2}]

  const StreakElements = PrototypeOfStreaks.map((Streak) => {
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
