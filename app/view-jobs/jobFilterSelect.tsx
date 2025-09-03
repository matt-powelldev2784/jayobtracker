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
  console.log("currentFilter", currentFilter);

  const handleChange = (value: string) => {
    if (value === "All") {
      router.push(`/view-jobs?page=1&sortBy=createdAt&sortOrder=desc`);
      return;
    }
    router.push(`/view-jobs?page=1&sortBy=createdAt&sortOrder=desc&statusFilter=${value}`);
  };

  return (
    <div className="w-full md:w-[300px] md:max-w-[200px] mt-4">
      <Select value={currentFilter || "All"} onValueChange={handleChange}>
        <SelectTrigger className="w-full bg-white focus-visible:ring-1">
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
