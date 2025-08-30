import { getJobs } from "./getJobs";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import ErrorCard from "@/components/ui/errorCard";
import { Job } from "@prisma/client";

type JobsPageProps = {
  searchParams?: { page?: string };
};

type JobListProps = {
  jobs: Job[];
};

type PaginationProps = {
  page: number;
  totalPages: number;
};

const statusClass = {
  applied: "bg-primary text-white",
  rejected: "bg-destructive text-white",
  interview: "bg-secondary text-white",
  offer: "bg-secondary text-white",
  new: "bg-secondary text-white",
  default: "bg-secondary text-white",
};

const JobsPage = async ({ searchParams }: JobsPageProps) => {
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const jobsResponse = await getJobs({ page });

  if (!jobsResponse.success) return <ErrorCard message={jobsResponse.error} />;

  const { jobs, totalPages } = jobsResponse.data;

  return (
    <div className="w-11/12 mt-8">
      {/* Mobile view */}
      <MobileJobsList jobs={jobs} />

      {/* Desktop view */}
      <DesktopJobsList jobs={jobs} />

      {/* Pagination Controls */}
      <PaginationControls page={page} totalPages={totalPages} />
    </div>
  );
};

export default JobsPage;

const MobileJobsList = ({ jobs }: JobListProps) => {
  return (
    <div className="block sm:hidden">
      {/* Mobile Table Header */}
      <p className="flex justify-between items-center px-2 py-2 border-b bg-secondary font-bold text-white">Job List</p>

      {/* Job Cards */}
      {jobs.map((job) => (
        <div key={job.id} className="border-b border-muted py-3 px-2">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{job.title}</span>
            <span className="text-sm text-secondary">{job.company}</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className={`px-2 py-1 rounded text-xs ${statusClass[job.status] ?? statusClass["default"]}`}>
              {job.status}
            </span>

            <div className="flex gap-2">
              <Link
                href={`/jobs/${job.id}`}
                className="px-2 py-1 rounded bg-primary text-white hover:bg-primary/80 text-xs"
              >
                View
              </Link>

              <form action={`/jobs/${job.id}/delete`} method="post">
                <button
                  type="submit"
                  className="px-2 py-1 rounded bg-destructive text-white hover:bg-destructive/80 text-xs"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DesktopJobsList = ({ jobs }: JobListProps) => {
  return (
    <Table className="hidden sm:table">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Title</TableHead>
          <TableHead className="w-1/3">Company</TableHead>
          <TableHead className="w-1/6 ">Status</TableHead>
          <TableHead className="w-1/6">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id} className="hover:bg-muted transition">
            <TableCell>{job.title}</TableCell>

            <TableCell>{job.company}</TableCell>

            <TableCell>
              <span className={`px-2 py-1 rounded text-xs ${statusClass[job.status] ?? statusClass["default"]}`}>
                {job.status}
              </span>
            </TableCell>

            <TableCell className="flex gap-2">
              <Link
                href={`/jobs/${job.id}`}
                className="px-2 py-1 rounded bg-primary text-white hover:bg-primary/80 text-xs"
              >
                View
              </Link>

              <form action={`/jobs/${job.id}/delete`} method="post">
                <button
                  type="submit"
                  className="px-2 py-1 rounded bg-destructive text-white hover:bg-destructive/80 text-xs"
                >
                  Delete
                </button>
              </form>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const PaginationControls = ({ page, totalPages }: PaginationProps) => {
  const firstPage = page === 1;
  const lastPage = page === totalPages;

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Link
        href={`?page=${Math.max(1, page - 1)}`}
        className={`px-3 py-1 rounded bg-secondary text-white ${firstPage ? "opacity-50 pointer-events-none" : ""}`}
      >
        Previous
      </Link>

      <span className="text-sm text-secondary">{`Page ${page} of ${totalPages}`}</span>

      <Link
        href={`?page=${Math.min(totalPages, page + 1)}`}
        className={`px-3 py-1 rounded bg-secondary text-white ${lastPage ? "opacity-50 pointer-events-none" : ""}`}
      >
        Next
      </Link>
    </div>
  );
};

