import React from "react";

interface IProps {
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<IProps> = ({ checked, onChange }) => {
  return (
    <input
      type="checkbox"
      onChange={onChange}
      checked={checked}
      className="transform scale-150 w-6 h-6 cursor-pointer"
    />
  );
};

export default Checkbox;
