"use client";

import { useActionState, startTransition, useEffect } from "react";
import { addRoleAndIndustry } from "./addRoleAndIndustry";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardWithBorder, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  jobRole: z.string().min(2, "Please provide a valid job role."),
  industry: z.string().min(2, "Please provide a valid industry."),
});

type FormValues = z.infer<typeof schema>;

const RoleAndIndustryForm = () => {
  const [state, formAction, isPending] = useActionState(addRoleAndIndustry, null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { jobRole: "", industry: "" },
  });

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    formData.append("jobRole", values.jobRole);
    formData.append("industry", values.industry);
    startTransition(() => formAction(formData));
  };

  // the effect key to trigger a form reset and toast on successful addition of a cover letter
  // a new data id is only created if a cover letter is successfully added to the database
  const dataSubmitSuccess = state?.data?.id;

  useEffect(() => {
    if (dataSubmitSuccess) {
      toast.success("Role and Industry details saved.");
      form.reset();
    }
  }, [dataSubmitSuccess, form]);

  return (
    <article className="w-full flex flex-col items-center justify-start md:px-8">
      <Toaster position="bottom-right" richColors />

      <CardWithBorder className="">
        <CardHeader>
          <CardTitle>Role and Industry Details</CardTitle>
        </CardHeader>

        <CardDescription className="hidden md:block">
          Provide your target role and industry so the AI can better tailor cover letter tone and relevance.
        </CardDescription>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-0 grid-cols-1">
                <FormField
                  control={form.control}
                  name="jobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Frontend Engineer" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. FinTech" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {state?.error && !state.success && <p className="text-xs text-red-500">{state.error}</p>}

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader className="animate-spin" /> : "Save Role and Industry Details"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </CardWithBorder>
    </article>
  );
};

export default RoleAndIndustryForm;
