import { AcademicCapIcon } from '@heroicons/react/24/outline';

type Education = {
  school: string;
  degree?: string;
  date?: string;
  gpa?: string;
  descriptions?: string[];
};

type EducationProps = {
  educations?: Education[];
  headerStyle?: {
    type: 'color' | 'gradient';
    value: string;
  };
};

export function Education({ educations, headerStyle }: EducationProps) {
  if (!educations?.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-6 py-4">
        <div className="rounded-full bg-gray-200 p-2">
          <AcademicCapIcon className="h-6 w-6 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-8">
          {educations.map((edu, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                {edu.school}
              </h3>
              {edu.degree && (
                <div className="text-base text-gray-500">
                  {edu.degree}
                </div>
              )}
              {edu.date && (
                <div className="text-base text-gray-500">
                  {edu.date}
                </div>
              )}
              {edu.gpa && (
                <div className="text-base text-gray-500">
                  GPA: {edu.gpa}
                </div>
              )}
              {edu.descriptions && edu.descriptions.length > 0 && (
                <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600">
                  {edu.descriptions.map((desc, i) => (
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