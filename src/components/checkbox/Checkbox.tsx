import React from "react";

interface IProps {
  checked: boolean;
}

const Checkbox: React.FC<IProps> = ({ checked }) => {
  return <input type="checkbox" checked={checked} />;
};

export default Checkbox;
