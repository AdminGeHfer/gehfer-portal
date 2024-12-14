import { Input } from "./input";
import { Label } from "./label";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 p-0 cursor-pointer"
      />
      <Input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
        placeholder="#000000"
      />
    </div>
  );
};