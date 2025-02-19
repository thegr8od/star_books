{/* Sections */}
{sections.map((section, index) => (
  <div
    key={section.id}
    id={section.id}
    ref={(el) => (sectionsRef.current[index] = el)}
    className={`h-screen overflow-hidden ${
      section.type === "image"
        ? `bg-cover bg-center ${section.fixed ? "bg-fixed" : ""}`
        : "relative"
    }`}
    style={
      section.type === "image"
        ? { backgroundImage: `url(${section.imageUrl})` }
        : {}
    }
  >
    {section.type === "video" && (
      <>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto 
            transform -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/videos/home.mp4" type="video/mp4" />
        </video>
        {index === sections.length - 1 && <Login />}
      </>
    )}
    
    {/* Content Section */}
    {section.content && (
      <div className={`absolute left-[15%] top-1/2 z-30 transform -translate-y-1/2 
        transition-opacity duration-1000 max-w-lg
        ${activeSection === index ? 'opacity-100' : 'opacity-0'}`}
      >
        <h3 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4
          ${sectionColors[activeSection]?.active || "text-white"}`}>
          {section.content.title}
        </h3>
        <p className={`text-xl md:text-2xl lg:text-3xl
          ${sectionColors[activeSection]?.active || "text-white"}
          opacity-80`}>
          {section.content.description}
        </p>
      </div>
    )}
  </div>
))} 