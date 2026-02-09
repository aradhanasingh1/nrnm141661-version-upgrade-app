import * as express from "express"
import auth from "../middleware/auth"

const router = express.Router()

router.get("/", auth, (req: any, res) => {
  res.json({
    success: true,
    user: req.user
  })
})

export default router
