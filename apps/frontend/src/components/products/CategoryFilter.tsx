import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Orthopedic', label: 'Orthopedic' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Imaging', label: 'Imaging' },
  { value: 'Surgical', label: 'Surgical' },
];

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
