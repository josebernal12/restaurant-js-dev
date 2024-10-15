import { addActivities, getActivities } from "../services/activitiesRecently.js"

export const addActivitiesController = async (req, res) => {
  const { message, date, description } = req.body
  const { id } = req.params
  const activitie = await addActivities(id, message, date, description)
  res.json(activitie)
}

export const getActivitiesController = async (req, res) => {
  let page;
  if (req.query.page) {
    page = req.query.page
  }
  const activities = await getActivities(page)
  res.json(activities)
}