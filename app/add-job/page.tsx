import { CardHeader, CardTitle, CardDescription, Card } from "@/components/ui/card";
import ParseJobForm from "./parseJobForm";

const AddJobPage = async () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row items-stretch w-screen">
      <LeftMenu />

      <ParseJobForm />
    </div>
  );
};

export default AddJobPage;

const LeftMenu = () => {
  return (
    <Card className="w-full min-h-fit md:w-[350px] md:min-w-[300px] lg:min-w-[350px] gap-0 bg-neutral-100 flex flex-col pb-2 md:pb-12">
      <CardHeader className="mt-2 md:mt-4">
        <CardTitle>Add Job Form</CardTitle>
        <CardDescription className="">
          Copy and paste a job advert and and URL to auto-fill the job details. This leverages AI to extract key
          information from the job posting.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
