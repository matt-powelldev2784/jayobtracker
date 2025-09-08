import ParseJobForm from "./parseJobForm";
import LeftMenu from "@/components/ui/leftMenu";

const AddJobPage = async () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row items-stretch w-screen">
      <LeftMenu
        title="Add Job Form"
        description=" Copy and paste a job advert and and URL to auto-fill the job details. This leverages AI to extract key
        information from the job posting."
      />

      <ParseJobForm />
    </div>
  );
};

export default AddJobPage;
