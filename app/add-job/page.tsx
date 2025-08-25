'use client'

import { startTransition, useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { processJobSubmission } from './addJob'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'

const schema = z.object({
  text: z.string().min(100, 'Job description must be at least 100 characters'),
  url: z.string().url('Please enter a valid URL'),
})

const JobParseForm = () => {
  const [state, formAction, pending] = useActionState(
    processJobSubmission,
    null
  )
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      text: '',
      url: '',
    },
  })

  const handleSubmit = (data: { text: string; url: string }) => {
    const formData = new FormData()
    formData.append('text', data.text)
    formData.append('url', data.url)
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <section className="px-4 w-full pb-20">
      <Card className="max-w-5xl mx-auto mt-8">
        <CardHeader>
          <PlusCircle className="w-10 h-10" />
          <CardTitle>Auto Fill Job Details</CardTitle>
        </CardHeader>

        <CardDescription className="px-6">
          Paste a job description and URL to auto-fill the job details
        </CardDescription>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col"
            >
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste job description here"
                        rows={10}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Job URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paste job URL here"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={pending}>
                {pending
                  ? 'Processing job details...'
                  : 'Auto Fill Job Details'}
              </Button>

              {state?.error && (
                <div className="text-red-500 mt-2">{state.error}</div>
              )}
            </form>
          </Form>
        </CardContent>

        {/* Uncomment to preview returned job data for debugging */}
        {/* <div className="px-8">
          <p className="mt-4">Preview job data</p>
          <pre className="bg-gray-100 rounded min-h-36 w-full">
            {JSON.stringify(state?.data, null, 2)}
          </pre>
        </div> */}
      </Card>
    </section>
  )
}

export default JobParseForm