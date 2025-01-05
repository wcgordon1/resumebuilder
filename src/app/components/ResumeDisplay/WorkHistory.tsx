import { BriefcaseIcon } from '@heroicons/react/24/outline';

type WorkExperience = {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  descriptions: string[];
  date?: string;
};

type WorkHistoryProps = {
  experiences: WorkExperience[];
  headerStyle?: {
    type: 'color' | 'gradient';
    value: string;
  };
};

export function WorkHistory({ experiences, headerStyle }: WorkHistoryProps) {
  if (!experiences?.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-6 py-4">
        <div className="rounded-full bg-gray-200 p-2">
          <BriefcaseIcon className="h-6 w-6 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Work History</h2>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                {exp.company}
              </h3>
              <div className="text-base text-gray-500">
                {exp.date}
              </div>
              {exp.descriptions?.length > 0 && (
                <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600">
                  {exp.descriptions.map((desc, i) => (
                    <li key={i} className="text-base">{desc}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 