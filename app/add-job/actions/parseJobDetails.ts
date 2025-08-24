'use server'

import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const parseJobDetails = async (
  prevState: unknown,
  formData: FormData
) => {
  const text = formData.get('text') as string
  const url = formData.get('url') as string

  const prompt = `
    Extract the following fields from the pasted job description:
    - title
    - company
    - location
    - url
    - description

    Return the result as a JSON object.
    The returned object must be valid JSON and parsable by JSON.parse()

    I do not want a OpenAI response which sometimes includes Markdown formatting
    (like triple backticks and a json code block), so the result is not valid JSON for
    JSON.parse.

    I must have valid JSON returned.

    Job description:
    ${text}
    URL: ${url || ''}
  `

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.2,
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error('No content from OpenAI')

    const data = JSON.parse(content)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: String(error),
    }
  }
}
