export default function Spinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-[2.5px]",
    lg: "w-9 h-9 border-3",
  };

  return (
    <span
      className={`inline-block rounded-full border-white/15 border-t-current animate-spin-custom ${sizes[size]} ${className}`}
    />
  );
}
