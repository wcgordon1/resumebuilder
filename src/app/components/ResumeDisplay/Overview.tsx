type OverviewProps = {
  experience: number;
  certifications: string[];
};

export function Overview({ experience, certifications }: OverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-primary">{experience}</div>
        <div className="mt-1 text-sm text-gray-600">years of professional experience</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-primary">{certifications.length}</div>
        <div className="mt-1 text-sm text-gray-600">Certification{certifications.length !== 1 ? 's' : ''}</div>
      </div>
    </div>
  );
} 