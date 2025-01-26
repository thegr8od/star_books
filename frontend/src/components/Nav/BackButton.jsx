const BackButton = () => {
    const handleBack = () => {
      window.history.back();
    };
  
    return (
      <button onClick={handleBack}>
        <img 
        src="/icons/back.svg" 
        alt="뒤로" 
      />
      </button>
    );
  };
  
  export default BackButton;

  
  