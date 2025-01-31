const RadioButton = ({ selected, onClick, label }) => {
  return (
    <div className="flex items-center gap-4 relative">
      <button
        onClick={onClick}
        className={`w-5 h-5 rounded-full transition-all duration-300 ${
          selected ? "bg-indigo-300 shadow-md shadow-indigo-400" : "bg-white"
        }`}
      />
      <p
        className={`whitespace-nowrap absolute left-[40px] text-[14px] ${
          selected ? "text-black" : "text-gray-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
};

export default RadioButton;
