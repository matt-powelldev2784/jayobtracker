import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const POST = async (request: Request) => {
  try {
    const { text, url } = await request.json()

    const prompt = `
    Extract the following fields from the pasted job description:
    - title
    - company
    - location
    - url
    - description

    Return the result as a JSON object.

    Job description:
    ${text}
    URL: ${url || ''} `

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.2,
    })

    // Parse the response
    const content = completion.choices[0].message.content
    if (!content) throw new Error('No content from OpenAI')

    const job = JSON.parse(content)
    return Response.json({ success: true, job }, { status: 200 })
  } catch {
    return Response.json(
      { success: false, error: 'Could not parse response' },
      { status: 500 }
    )
  }
}
