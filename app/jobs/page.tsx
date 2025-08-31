import { getJobs } from "./getJobs";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import ErrorCard from "@/components/ui/errorCard";
import { Job } from "@prisma/client";
import { ArrowRight, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

type JobsPageProps = {
  searchParams?: { page?: string };
};

type JobListProps = {
  jobs: Job[];
  page: number;
  totalPages: number;
};

type PaginationProps = {
  page: number;
  totalPages: number;
};

const statusClass = {
  applied: "bg-secondary text-white",
  rejected: "bg-destructive text-white",
  interview: "bg-orange-500 text-white",
  offer: "bg-orange-500 text-white",
  new: "bg-green-500 text-white",
  default: "bg-secondary text-white",
};

const JobsPage = async ({ searchParams }: JobsPageProps) => {
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const jobsResponse = await getJobs({ page });

  if (!jobsResponse.success) return <ErrorCard message={jobsResponse.error} />;

  const { jobs, totalPages } = jobsResponse.data;

  return (
    <div className="w-11/12 mt-8">
      {/* Pagination Controls */}
      <PaginationControls page={page} totalPages={totalPages} />

      {/* Mobile view */}
      <MobileJobsList jobs={jobs} page={page} totalPages={totalPages} />

      {/* Desktop view */}
      <DesktopJobsList jobs={jobs} page={page} totalPages={totalPages} />
    </div>
  );
};

export default JobsPage;

const MobileJobsList = ({ jobs }: JobListProps) => {
  return (
    <div className="block md:hidden">
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
    <div className="flexCol">
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow className="bg-neutral-100">
            <TableHead className="w-16">
              <div className="w-12-h-12 bg-secondary rounded mx-auto">
                <ArrowRight strokeWidth={3} className="text-white p-1" />
              </div>
            </TableHead>

            <TableHead className="w-4/12">
              Title
              <ChevronsUpDown className="w-4 h-4 ml-2" />
            </TableHead>

            <TableHead className="4/12">
              Company
              <ChevronsUpDown className="w-4 h-4 ml-2" />
            </TableHead>

            <TableHead className="w-36">
              Status
              <ChevronsUpDown className="w-4 h-4 ml-2" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="hover:bg-muted transition">
              <TableCell className="w-16">
                <Link href={`/jobs/${job.id}/actions`} className="flex items-center justify-center w-full">
                  <div className="w-12-h-12 bg-primary rounded">
                    <ArrowRight strokeWidth={3} className="text-white p-1" />
                  </div>
                </Link>
              </TableCell>

              <TableCell>{job.title}</TableCell>

              <TableCell>{job.company}</TableCell>

              <TableCell className="w-36">
                <span
                  className={`px-2 py-1 rounded text-xs w-24 text-center ${
                    statusClass[job.status] ?? statusClass["default"]
                  }`}
                >
                  {job.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const PaginationControls = ({ page, totalPages }: PaginationProps) => {
  const firstPage = page === 1;
  const lastPage = page === totalPages;

  return (
    <div className="flex justify-between item-center w-full mb-4">
      <LinkButton href="/add-job">Add Job</LinkButton>

      <div className="flex justify-center items-center gap-4">
        <Link
          href={`?page=${Math.max(1, page - 1)}`}
          className={`w-8 h-8 rounded flexCol ${firstPage ? "bg-neutral-200 pointer-events-none" : "bg-primary"}`}
        >
          <ChevronLeft className="text-white" />
        </Link>

        <span className="text-sm text-secondary">{`Page ${page} of ${totalPages}`}</span>

        <Link
          href={`?page=${Math.min(totalPages, page + 1)}`}
          className={`w-8 h-8 rounded flexCol ${lastPage ? "bg-neutral-200 pointer-events-none" : "bg-primary"}`}
        >
          <ChevronRight className="text-white" />
        </Link>
      </div>
    </div>
  );
};

