import express, { Request, Response } from "express"
import mongoose from "mongoose"
const app = express()

mongoose.set('strictQuery', false)

mongoose.connect("mongodb://127.0.0.1:27017/streaks")
const db = mongoose.connection
db.on('error', (err) => console.error(err))
db.once('connected', () => console.log("Succesfuly connected to db"))

interface IStreak extends mongoose.Document {
   streak: number,
   streakName: string,
   lastDate: string,
   dates: string[],
   done: boolean
}

const streakSchema = new mongoose.Schema<IStreak>({
   streak: Number,
   streakName: String,
   lastDate: String,
   dates: [String],
   done: Boolean
})

const Streak = mongoose.model<IStreak>('Streak', streakSchema)

app.use(express.json())

app.use(function (req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
   next();
});

app.get("/", async (_req: Request, res: Response) => {
   try {
      const allStreaks = await Streak.find()
      res.status(200).json(allStreaks)
   } catch (err:any) {
      res.status(500).json({message: err.message})
   }
})

app.post("/", async (req: Request, res: Response) => {
   try {
      const streak = await Streak.findOne({streakName: req.body.streakName})

      if(req.body.streakName == null) return res.status(400).json({ message: "Bad request: No streakName" })
      if(streak != null) return res.status(403).json({ message: "Bad request: The Streak already exists" })

      const newStreak = new Streak ({
         streak: 0,
         streakName: req.body.streakName,
         lastDate: req.body.lastDate,
         dates: req.body.dates,
         done: req.body.done
      })

      await newStreak.save()
      res.status(201).json(newStreak)
   } catch (err:any) {
      res.status(400).json({message: err.message})
   }
})

app.patch("/", async (req: Request, res: Response) => {
   try {
      const streak = await Streak.findOne({streakName: req.body.streakName})

      console.log(req.body)

      if (streak == null) {
         return res.status(404).json({ message: "Bad request: Streak not found" })
      }
      if(req.body.lastDate == null) {
         return res.status(400).json({ message: "Bad request: No lastDate property" })
      }
      if(req.body.dates == null) {
         return res.status(400).json({ message: "Bad request: No dates array" })
      }

      //Date array check(s)
      for (let i = 0; i < streak.dates.length; i++){
         if(streak.dates[i] != req.body.dates[i]) return res.status(400).json({ message: "Bad request: the dates array does not match up with the records"})
      }

      if(req.body.dates[req.body.dates.length - 1] != req.body.lastDate) return res.status(400).json({ message: "Bad request: the last entry in the dates array doesn not match up the lastDate value"})
      
      //Date check
      //The date sent by the user will be the start of their current day (0h 0m 0s), written in the frontend
      const currDate = Date.parse(req.body.lastDate), prevDate = Date.parse(streak.lastDate)      
      let days = (currDate - prevDate) / (1000 * 3600 * 24)

      console.log(currDate, prevDate)

      if (isNaN(days)) return res.status(500).json({message: `Invalid dates: ${currDate}, and ${prevDate}`})

      if (days < 1) return res.status(200).json({ streak, days: days, message: "Streak not updated: A day hasn't passed yet", code: 0 })

      if (days > 2) {
         if (req.body.upd == true) {
            days = 1.5 // Cheat and make the streak upd go through
         } else {
            res.status(200).json({ streak, days: days, message: "Streak not updated: It has been more than 2 days", code: 2 })
         }
      }

      if (days >= 1 && days <= 2) {
         // DB manipulations
         streak.lastDate = req.body.lastDate
         streak.streak += 1 
         streak.dates = req.body.dates

         const updStreak = await streak.save()

         return res.status(200).json({ updStreak, message: `Streak updated: The streak is now ${updStreak.streak}` })
      }
      
   } catch (err:any) {
      res.status(400).json({message: err.message})
   }
})

app.delete("/", async (req: Request, res: Response) => {
   const streak: IStreak | null = await Streak.findOne({streakName: req.body.streakName})

   if (streak == null) return res.status(404).json({ message: "Bad request: Streak not found", code: -1 })

   streak.deleteOne()
   res.status(200).json({ deleted: true, streak })
})

app.listen(3000, () => {
   console.log("Listening on port 3000")
})
