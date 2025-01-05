"use client";
import { useState } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Switch } from '@headlessui/react';

type HeaderStyle = {
  type: 'color' | 'gradient';
  value: string;
};

type HeaderStylePickerProps = {
  value: HeaderStyle;
  onChange: (style: HeaderStyle) => void;
};

const PRESET_GRADIENTS = [
  { name: 'Ocean', value: 'linear-gradient(to right, #2193b0, #6dd5ed)' },
  { name: 'Purple Dream', value: 'linear-gradient(to right, #4776E6, #8E54E9)' },
  { name: 'Sunset', value: 'linear-gradient(to right, #FF512F, #F09819)' },
  { name: 'Forest', value: 'linear-gradient(to right, #134E5E, #71B280)' },
  { name: 'Night Sky', value: 'linear-gradient(to right, #141E30, #243B55)' },
  { name: 'Cherry', value: 'linear-gradient(to right, #EB3349, #F45C43)' },
  { name: 'Moonlit', value: 'linear-gradient(to right, #0F2027, #203A43, #2C5364)' },
  { name: 'Fresh', value: 'linear-gradient(to right, #00b09b, #96c93d)' },
  { name: 'Royal', value: 'linear-gradient(to right, #141E30, #4B79A1)' },
];

const PRESET_COLORS = [
  { name: 'Navy', value: '#1a365d' },
  { name: 'Forest', value: '#1B4332' },
  { name: 'Wine', value: '#5C0819' },
  { name: 'Charcoal', value: '#2F3437' },
  { name: 'Royal', value: '#1D3461' },
  { name: 'Deep Purple', value: '#3C096C' },
];

export function HeaderStylePicker({ value, onChange }: HeaderStylePickerProps) {
  const [isGradient, setIsGradient] = useState(value.type === 'gradient');
  const [color1, setColor1] = useState('#00416A');
  const [color2, setColor2] = useState('#E4E5E6');
  const [showPicker1, setShowPicker1] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);

  const handleGradientColorChange = (color: string, index: number) => {
    const newColor = index === 0 ? [color, color2] : [color1, color];
    const gradientValue = `linear-gradient(to right, ${newColor[0]}, ${newColor[1]})`;
    if (index === 0) setColor1(color);
    else setColor2(color);
    onChange({ type: 'gradient', value: gradientValue });
  };

  const handleColorChange = (color: string) => {
    onChange({ type: 'color', value: color });
  };

  const handleTypeChange = (useGradient: boolean) => {
    setIsGradient(useGradient);
    if (useGradient) {
      onChange({ type: 'gradient', value: `linear-gradient(to right, ${color1}, ${color2})` });
    } else {
      onChange({ type: 'color', value: color1 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Header Style</h3>
          <span className="text-sm text-gray-500">
            {isGradient ? '(Gradient)' : '(Solid Color)'}
          </span>
        </div>
        <Switch
          checked={isGradient}
          onChange={handleTypeChange}
          className={`${
            isGradient ? 'bg-primary' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Use gradient</span>
          <span className={`${isGradient ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </Switch>
      </div>

      {/* Preview */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div 
          className="h-24 w-full transition-all duration-500"
          style={isGradient ? { background: value.value } : { backgroundColor: value.value }}
        />
      </div>

      {isGradient ? (
        <div className="space-y-4">
          {/* Gradient Color Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {[color1, color2].map((color, index) => (
              <div key={index} className="relative">
                <label className="mb-2 block text-sm text-gray-600">
                  {index === 0 ? 'Start Color' : 'End Color'}
                </label>
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => index === 0 ? setShowPicker1(!showPicker1) : setShowPicker2(!showPicker2)}
                    className="h-10 w-10 rounded-md border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <HexColorInput
                    color={color}
                    onChange={(newColor) => handleGradientColorChange(newColor, index)}
                    className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
                    prefixed
                  />
                </div>
                {((index === 0 && showPicker1) || (index === 1 && showPicker2)) && (
                  <div className="absolute z-10 mt-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                      <HexColorPicker
                        color={color}
                        onChange={(newColor) => handleGradientColorChange(newColor, index)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preset Gradients */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">Preset Gradients</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_GRADIENTS.map((gradient, index) => (
                <button
                  key={index}
                  className="group relative h-16 overflow-hidden rounded-md border border-gray-200 transition-all hover:scale-105"
                  style={{ background: gradient.value }}
                  onClick={() => onChange({ type: 'gradient', value: gradient.value })}
                >
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {gradient.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Solid Color Picker */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPicker1(!showPicker1)}
                className="h-10 w-10 rounded-md border border-gray-200"
                style={{ backgroundColor: value.value }}
              />
              <HexColorInput
                color={value.value}
                onChange={handleColorChange}
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
                prefixed
              />
            </div>
            {showPicker1 && (
              <div className="absolute z-10 mt-2">
                <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                  <HexColorPicker color={value.value} onChange={handleColorChange} />
                </div>
              </div>
            )}
          </div>

          {/* Preset Colors */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">Preset Colors</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color, index) => (
                <button
                  key={index}
                  className="group relative h-12 overflow-hidden rounded-md border border-gray-200 transition-all hover:scale-105"
                  style={{ backgroundColor: color.value }}
                  onClick={() => onChange({ type: 'color', value: color.value })}
                >
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 