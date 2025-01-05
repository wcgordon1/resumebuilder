type SectionIconProps = {
  icon: React.ComponentType<any>;
  headerStyle?: {
    type: 'color' | 'gradient';
    value: string;
  };
};

export function SectionIcon({ icon: Icon, headerStyle }: SectionIconProps) {
  const iconStyle = headerStyle?.type === 'gradient' 
    ? { backgroundImage: headerStyle.value }
    : { backgroundColor: headerStyle?.value || '#1a365d' };

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-gray-100 p-2">
        <Icon className="h-6 w-6 text-gray-600" />
      </div>
      <div 
        className="rounded-full p-2"
        style={iconStyle}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  );
} 