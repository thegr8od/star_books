const Button = ({
  text,
  type,
  onClick,
  disabled,
  className = "",
  imgSrc,
  imgClassName = "",
}) => {
  const typeClasses = {
    DEFAULT: "rounded-2xl text-white bg-[#8993c7] hover:bg-[#7580bb]",
    PREV: "rounded-2xl text-white bg-gray-400  hover:bg-gray-500",
    NEXT: "rounded-2xl text-white bg-[#8993c7] hover:bg-[#7580bb] disabled:opacity-50 disabled:hover:[#a3add5]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
      ${imgSrc ? "rounded-2xl" : typeClasses[type]} 
      ${className}
    `}
    >
      {imgSrc && (
        <img src={imgSrc} alt="button icon" className={imgClassName} />
      )}
      {text}
    </button>
  );
};

export default Button;
