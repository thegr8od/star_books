const Header = ({
  title, 
  leftChild, 
  rightChild, 
  className = "",
  titleClassName = "", 
  leftClassName = "", 
  rightClassName = ""
}) => {
  return (
    <header className={`pt-3 flex items-center justify-around text-white/80 ${className}`}>
      <div className={leftClassName}>{leftChild}</div>
      <div className={titleClassName}>{title}</div>
      <div className={rightClassName}>{rightChild}</div>
    </header>
  );
}

export default Header