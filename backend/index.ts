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
   lastDate: string 
}

const streakSchema = new mongoose.Schema<IStreak>({
   streak: Number,
   streakName: String,
   lastDate: String
})

const Streak = mongoose.model<IStreak>('Streak', streakSchema)

app.use(express.json())

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
         lastDate: new Date().toJSON()
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

      if (streak == null) {
         return res.status(404).json({ message: "Bad request: Streak not found", code: -1 })
      }

      if(req.body.lastDate == null) {
         return res.status(400).json({ message: "Bad request: No lastDate property", code: -1 })
      }

      //Date check
      const currDate = Date.now(), prevDate = Date.parse(streak.lastDate)      
      let days = (currDate - prevDate) / (1000 * 3600 * 24)

      if (days < 1) return res.status(200).json({ streak, days: days, message: "Streak not updated: It hasn't been 24 hours yet", code: 0 })

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

         const updStreak = await streak.save()

         return res.status(200).json({ updStreak, message: `Streak updated: The streak is now ${updStreak.streak}`, code: 1 })
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
