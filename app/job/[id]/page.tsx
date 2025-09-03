import ErrorCard from "@/components/ui/errorCard";
import { getJob } from "../getJob";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { CoverLetter, Job } from "@prisma/client";
import { jobStatusStyle } from "@/ts/jobStatusStyle";
import GenerateCoverLetterButton from "../generateCoverLetterButton";
import JobStatusSelect from "../jobsStatusSelect";

type JobDetailPageProps = {
  params: { id: string };
};

type JobDetailsCardProps = {
  job: Job;
};

type CoverLetterCardProps = {
  coverLetter: CoverLetter | null;
  jobId: number;
};

const JobDetailPage = async ({ params }: JobDetailPageProps) => {
  const getJobData = await getJob(Number(params.id));

  if (!getJobData.success) return <ErrorCard message={getJobData.error} />;

  const { job, coverLetter } = getJobData.data;

  return (
    <section className="flex min-h-screen flex-col md:flex-row items-stretch w-screen">
      <JobDetailsCard job={job} />
      <CoverLetterCard coverLetter={coverLetter} jobId={job.id} />
    </section>
  );
};

export default JobDetailPage;

const JobDetailsCard = ({ job }: JobDetailsCardProps) => {
  return (
    <Card className="w-full min-h-fit md:w-[350px] md:min-w-[350px] gap-0 bg-neutral-100 flex flex-col pb-">
      <CardHeader className="mt-3">
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>

      <div className="w-full px-4 md:px-6 mt-2 mb-5 flexCol">
        <LinkButton href={job.url} target="_blank">
          View Job Advert
        </LinkButton>
      </div>

      <CardContent className="flexCol gap-4 bg-white border-2 border-darkGrey rounded-lg mx-4 md:mx-6 p-2 text-sm">
        <div className="flexRow gap-2 mt-2">
          <span className="font-bold">Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${jobStatusStyle[job.status]}`}>{job.status}</span>
        </div>

        <div className="mb-2">
          <span className="font-bold">Location:</span> {job.location || "N/A"}
        </div>

        <div className="mb-2">
          <span className="font-bold">Date Added:</span> {new Date(job.createdAt).toLocaleDateString("en-GB")}
        </div>
      </CardContent>

      <JobStatusSelect jobId={job.id} currentStatus={job.status} />
    </Card>
  );
};

const CoverLetterCard = ({ coverLetter, jobId }: CoverLetterCardProps) => {
  const coverLetterText = coverLetter ? formatCoverLetterText(coverLetter.content) : null;

  return (
    <Card className="w-full h-full flex flex-col items-center justify-start px-4 md:px-8">
      <CardHeader className="w-full max-w-11/12 mt-3">
        <CardTitle className="text-center">AI Generated Cover Letter Template</CardTitle>
        <CardDescription className="text-center">
          This AI-generated draft is designed to help you quickly craft a tailored cover letter.
        </CardDescription>
      </CardHeader>

      {coverLetter && (
        <div className="mb-2 border-2 border-darkGrey rounded-lg max-w-[900px] p-8 w-full flex flex-col items-start">
          {coverLetterText?.map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      <div className="mb-2 border-2 border-darkGrey rounded-lg max-w-[900px] p-8 w-full flexCol gap-2">
        <GenerateCoverLetterButton jobId={jobId} />

        <CardDescription className="text-center mt-2]">
          {!coverLetter && <p>Click the button above to generate cover letter template</p>}
          {coverLetter && (
            <p>
              Click the button above to <span className="font-bold">regenerate</span> the cover letter template
            </p>
          )}
        </CardDescription>
      </div>
    </Card>
  );
};

const formatCoverLetterText = (text: string) => {
  const coverLetterParagraphs = text.split("\n\n").map((line) => line.trim());

  return coverLetterParagraphs;
};
