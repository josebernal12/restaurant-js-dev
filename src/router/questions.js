import { Router } from 'express';
import { questionAnsweringDashboard, questionAnsweringUsers, } from '../helpers/huggingFace.js';

const router = Router()

router.post('/dashboard', async (req, res) => {
    const { question } = req.body
    const result = await questionAnsweringDashboard(question)
    // res.json(result)
    res.json(result.answer)
})
router.post('/user', async (req, res) => {
    const { question } = req.body
    const result = await questionAnsweringUsers(question)
    // res.json(result)
    res.json(result.answer)
})

export default router