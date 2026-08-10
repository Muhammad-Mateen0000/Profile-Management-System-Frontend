const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <span className="text-sm text-slate-500">{text}</span>
    </div>
  );
};

export default Loader;
