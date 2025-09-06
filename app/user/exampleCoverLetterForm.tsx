"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addExampleCoverLetter } from "./addExampleCoverLetter";
import { Loader } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent, CardWithBorder } from "@/components/ui/card";
import { toast, Toaster } from "sonner";

const schema = z.object({
  coverLetter: z.string().min(100, "Minimum 100 characters required."),
});

type FormValues = z.infer<typeof schema>;

const AddExampleLetterForm = () => {
  const [state, formAction, isPending] = useActionState(addExampleCoverLetter, null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { coverLetter: "" },
  });

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    formData.append("coverLetter", values.coverLetter.trim());
    startTransition(() => formAction(formData));
  };

  useEffect(() => {
    // display toast and reset form on success
    if (state?.data?.id) {
      toast.success("Example Cover Letter Added.");
      form.reset();
    }
  }, [state?.data?.id, form]);

  return (
    <section className="w-full flex flex-col items-center justify-start px-4 md:px-8">
      <Toaster position="bottom-right" richColors />
      <CardWithBorder className="mt-2 md:mt-8">
        <CardHeader>
          <CardTitle>Add Example Cover Letter</CardTitle>
          <CardDescription>
            Paste or write example cover letters into the text box and click the submit button
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              key={state?.success ? `reset-${state.data?.id ?? Date.now()}` : "initial-key"}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={10}
                        placeholder="Paste or write a sample cover letter..."
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {state?.error && <p className="text-xs text-red-500">{state.error}</p>}

              <div className="flexCol">
                <Button type="submit" disabled={isPending} className="min-w-[180px]">
                  {isPending ? <Loader className="h-4 w-4 animate-spin" /> : "Add Example Cover Letter"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </CardWithBorder>
    </section>
  );
};

export default AddExampleLetterForm;
