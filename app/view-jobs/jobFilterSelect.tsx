"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ApplicationStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

type StatusOption = {
  value: ApplicationStatus | "All";
  label: string;
};

const statusOptions: StatusOption[] = [
  { value: "All", label: "All" },
  { value: "new", label: "New" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

type JobsFilterSelectProps = {
  currentFilter?: string | undefined;
};

const JobsFilterSelect = ({ currentFilter }: JobsFilterSelectProps) => {
  const router = useRouter();

  const handleChange = (value: string) => {
    router.push(`/view-jobs?page=1&sortBy=createdAt&sortOrder=desc&status=${value}`);
    router.refresh();
  };

  return (
    <div className="w-full px-4 md:px-6 mt-4">
      <label htmlFor="job-filter" className="block font-bold text-sm text-muted-foreground pl-1 mb-1">
        Filter by Status:
      </label>

      <Select value={currentFilter || "All"} onValueChange={handleChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobsFilterSelect;
