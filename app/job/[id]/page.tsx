import ErrorCard from "@/components/ui/errorCard";
import { getJob } from "../getJob";

type JobDetailPageProps = {
  params: { id: string };
};

const JobDetailPage = async ({ params }: JobDetailPageProps) => {
  const response = await getJob(Number(params.id));

  if (!response.success) return <ErrorCard message={response.error} />;

  const { job, coverLetter } = response.data;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>

      <p className="text-lg text-secondary mb-4">{job.company}</p>

      <div className="mb-2">
        <span className="font-semibold">Status:</span>{" "}
        <span className="px-2 py-1 rounded text-xs bg-secondary text-white">{job.status}</span>
      </div>

      <div className="mb-2">
        <span className="font-semibold">Location:</span> {job.location || "N/A"}
      </div>

      <div className="mb-2">
        <span className="font-semibold">Date Added:</span> {new Date(job.createdAt).toLocaleDateString("en-GB")}
      </div>

      {/* <div className="mb-2">
        <span className="font-semibold">Description:</span>
        <p className="mt-1">{job.description}</p>
      </div> */}

      {coverLetter && (
        <div className="mb-2">
          <span className="font-semibold">Cover Letter:</span>
          <p className="mt-1">{coverLetter.content}</p>
        </div>
      )}

      <div className="mt-4">
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          Link to Job Posting
        </a>
      </div>
    </div>
  );
};

export default JobDetailPage;
