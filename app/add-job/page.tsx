'use client'

import { useActionState } from 'react'
import { parseJobDetails } from './actions/parseJobDetails'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function JobParseForm() {
  const [state, formAction, pending] = useActionState(parseJobDetails, null)

  return (
    <form
      action={formAction}
      className="max-w-xl mx-auto p-4 flex flex-col gap-4"
    >
      <label>
        Job Description:
        <Textarea
          name="text"
          rows={10}
          className="border p-2 w-full"
          placeholder="Paste job description here"
          required
        />
      </label>
      <label>
        Job URL:
        <Input
          name="url"
          type="text"
          className="border p-2 w-full"
          placeholder="Paste job URL here"
          required
        />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? 'Parsing...' : 'Parse Job'}
      </Button>

      {state?.error && <div className="text-red-500 mt-2">{state.error}</div>}

      <p className="mt-4">Preview </p>
      <pre className="bg-gray-100 rounded min-h-36">
        {JSON.stringify(state?.data, null, 2)}
      </pre>
    </form>
  )
}
