function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-white
        rounded-3xl
        border border-gray-200
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        p-6
        transition-all duration-300
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;