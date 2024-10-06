import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'

dotenv.config()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { input } = req.body
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error('OpenAI API key is not set')
    return res.status(500).json({ message: 'OpenAI API key is not set' })
  }

  const configuration = new Configuration({
    apiKey: apiKey,
  })
  const openai = new OpenAIApi(configuration)

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that organizes tasks. Given a list of tasks, you should return a JSON array of tasks with 'startTime', 'endTime', and 'description' fields. Times should be in 24-hour format (HH:MM)."
        },
        {
          role: "user",
          content: input
        }
      ],
    })

    const tasksString = completion.data.choices[0].message.content
    const tasks = JSON.parse(tasksString)

    res.status(200).json({ tasks })
  } catch (error) {
    console.error('Error processing tasks:', error.response ? error.response.data : error.message)
    res.status(500).json({ message: 'Error processing tasks', error: error.message })
  }
}