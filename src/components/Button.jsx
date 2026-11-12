const VARIANTS = {
  primary:
    "bg-gray-900 text-white hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400",
  accent:
    "bg-accent text-white hover:bg-accent-hover disabled:bg-gray-200 disabled:text-gray-400",
  secondary:
    "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:text-gray-400",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:text-gray-300",
  danger: "text-red-600 hover:bg-red-50 disabled:text-gray-300",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-5 text-[15px] gap-2 rounded-xl",
  lg: "h-13 px-7 text-base gap-2 rounded-xl",
};

function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  type = "button",
  className = "",
  ...rest
}) {
  const iconSize = size === "sm" ? 15 : 17;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center shrink-0
        font-semibold whitespace-nowrap
        transition-colors duration-150
        disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${className}
      `}
      {...rest}
    >
      {Icon && <Icon size={iconSize} strokeWidth={2} />}
      {children}
      {IconRight && <IconRight size={iconSize} strokeWidth={2} />}
    </button>
  );
}

export default Button;
