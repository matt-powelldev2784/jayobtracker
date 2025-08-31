import ErrorCard from "@/components/ui/errorCard";
import { getJob } from "../getJob";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button, LinkButton } from "@/components/ui/button";
import { CoverLetter, Job } from "@prisma/client";

type JobDetailPageProps = {
  params: { id: string };
};

type JobDetailsCardProps = {
  job: Job;
};

type CoverLetterCardProps = {
  coverLetter: CoverLetter | null;
};

const JobDetailPage = async ({ params }: JobDetailPageProps) => {
  const response = await getJob(Number(params.id));

  if (!response.success) return <ErrorCard message={response.error} />;

  const { job, coverLetter } = response.data;

  return (
    <section className="flex flex-col md:flex-row items-center md:items-start gap-0 w-screen min-h-screen">
      <JobDetailsCard job={job} />
      <CoverLetterCard coverLetter={coverLetter} />
    </section>
  );
};

export default JobDetailPage;

const JobDetailsCard = ({ job }: JobDetailsCardProps) => {
  return (
    <Card className="w-full md:min-h-screen md:w-[350px] pt-4 pb-4 md:min-w-[350px] gap-0 bg-neutral-100">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>

      <CardContent className="flexCol gap-4 bg-white border-2 border-darkGrey rounded-lg mx-4 md:mx-6 p-2 text-sm">
        <div className="flexRow gap-2 mt-2">
          <span className="font-bold">Status:</span>
          <span className="px-2 py-1 rounded text-xs bg-secondary text-white">{job.status}</span>
        </div>

        <div className="mb-2">
          <span className="font-bold">Location:</span> {job.location || "N/A"}
        </div>

        <div className="mb-2">
          <span className="font-bold">Date Added:</span> {new Date(job.createdAt).toLocaleDateString("en-GB")}
        </div>
      </CardContent>

      <div className="w-full px-4 md:px-6 mb-2">
        <LinkButton href={job.url} target="_blank" className="w-full mt-4">
          Link to Job Posting
        </LinkButton>
      </div>
    </Card>
  );
};

const CoverLetterCard = ({ coverLetter }: CoverLetterCardProps) => {
  return (
    <Card className="w-full mt-3 min-h-screen px-0">
      <CardHeader>
        <CardTitle className="text-center">AI Generated Cover Letter Template</CardTitle>
        <CardDescription className="text-center">
          This AI-generated draft is designed to help you quickly craft a tailored cover letter.
        </CardDescription>
      </CardHeader>

      {coverLetter && (
        <div className="mb-2 border-2 border-darkGrey rounded-lg mx-4 md:mx-8 lg:mx-16 p-8 flexCol">
          <span className="font-semibold">Cover Letter:</span>
          <p className="mt-1">{coverLetter.content}</p>
        </div>
      )}

      {!coverLetter && (
        <form className="mb-2 border-2 border-darkGrey rounded-lg mx-4 md:mx-8 lg:mx-16 p-8 flexCol">
          <Button type="submit" className="">
            Generate Cover Letter Template
          </Button>

          <CardDescription className="text-center mt-4">
            Click the button above to generate cover letter template.
          </CardDescription>
        </form>
      )}
    </Card>
  );
};

