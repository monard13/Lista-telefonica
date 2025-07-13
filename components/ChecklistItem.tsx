
import React from 'react';

interface ChecklistItemProps {
  number: string;
  isChecked: boolean;
  onToggle: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ number, isChecked, onToggle }) => {
  const cleanNumber = number.replace(/[\s-]/g, '').replace(/^\+57/, '');

  return (
    <div className="flex items-center py-4 border-b border-gray-200 last:border-b-0 transition-all duration-300">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
        className="mr-4 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
      />
      <a
        href={`tel:${cleanNumber}`}
        className={`flex-grow text-lg transition-colors duration-300 ${
          isChecked ? 'text-gray-400 line-through' : 'text-gray-700 hover:text-blue-600'
        }`}
      >
        {number}
      </a>
    </div>
  );
};

export default ChecklistItem;
