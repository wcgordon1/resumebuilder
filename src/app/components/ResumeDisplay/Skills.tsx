import { WrenchIcon } from '@heroicons/react/24/outline';

type SkillsProps = {
  skills?: {
    descriptions?: string[];
  };
  headerStyle?: {
    type: 'color' | 'gradient';
    value: string;
  };
};

export function Skills({ skills, headerStyle }: SkillsProps) {
  if (!skills?.descriptions?.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-6 py-4">
        <div className="rounded-full bg-gray-200 p-2">
          <WrenchIcon className="h-6 w-6 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ul className="list-disc space-y-2 pl-5 text-gray-600">
          {skills.descriptions.map((skill, index) => (
            <li key={index} className="text-base">{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 