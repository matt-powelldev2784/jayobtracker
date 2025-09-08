import { InfoIcon } from "lucide-react";
import AddExampleLCoverLetterForm from "./exampleCoverLetterForm";
import RoleAndIndustryForm from "./addRoleAndIndustryForm";
import LeftMenu from "@/components/ui/leftMenu";

const UserPage = async () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row items-stretch w-screen">
      <LeftMenu
        title="User Settings"
        description="Adding your preferences here helps AI to generate tailored cover letters that match your style and tone."
      >
        <article className="bg-white mx-4 p-4 rounded-lg flex flex-col gap-2 hidden md:block">
          <div className="flexCol mb-2">
            <InfoIcon />
            <p className="text-center">Example Cover Letters</p>
          </div>
          <p className="rounded text-xs text-center md:text-justify text-secondary">
            We recommend you submit example cover letters that demonstrate your preferred voice, style, and formatting.
            The AI will learn from these, and provide tailored cover letters which sound more like you. Adding multiple
            examples yields more accurate results.
          </p>
        </article>
      </LeftMenu>

      <div className="flex flex-col items-start justify-center w-full gap-8 ">
        <AddExampleLCoverLetterForm />
        <RoleAndIndustryForm />
        <div className="h-24" />
      </div>
    </div>
  );
};

export default UserPage;
