import { InfoIcon } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import AddExampleLetterForm from "./exampleCoverLetterForm";

const UserPage = () => {
  return (
    <main className="flex min-h-screen flex-col md:flex-row items-stretch w-screen">
      <LeftMenu />
      <AddExampleLetterForm />
    </main>
  );
};

export default UserPage;

const LeftMenu = () => {
  return (
    <Card className="w-full min-h-fit md:w-[350px] md:min-w-[300px] lg:min-w-[350px] gap-0 bg-neutral-100 flex flex-col pb-2 md:pb-12">
      <CardHeader className="mt-2 md:mt-4">
        <CardTitle>User Settings</CardTitle>
        <CardDescription className="">
          Adding your preferences here enhances the power of the AI to generate cover letters that match your style and
          tone.
        </CardDescription>
      </CardHeader>

      <CardContent className="gap-4 bg-white border-2 border-darkGrey rounded-lg mx-4 md:mx-6 p-4 text-sm hidden md:block">
        <div className="flexCol mb-2">
          <InfoIcon />
          <p className="text-center">Example Cover Letters</p>
        </div>
        <p className="rounded text-xs text-center md:text-justify">
          We recommend you submit example cover letters that demonstrate your preferred voice, style, and formatting.
          The AI will learn from these, and provide tailored cover letters which sound more like you. Adding multiple
          examples yields more accurate results.
        </p>
      </CardContent>
    </Card>
  );
};
