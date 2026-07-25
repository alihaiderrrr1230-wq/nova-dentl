// Input زجاجي + Select + Textarea
// مكونات موحدة لكل النماذج

export const Input = ({ label, error, className = '', icon: Icon, ...props }) => (
  <div className="mb-3">
    {label && (
      <label className="block text-sm font-semibold text-nova-deep mb-1.5">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-deep/40 pointer-events-none" />
      )}
      <input
        className={`input-glass ${Icon ? '!pr-10' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

export const Textarea = ({ label, error, className = '', ...props }) => (
  <div className="mb-3">
    {label && (
      <label className="block text-sm font-semibold text-nova-deep mb-1.5">
        {label}
      </label>
    )}
    <textarea
      className={`input-glass !min-h-[80px] ${className}`}
      {...props}
    />
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

export const Select = ({ label, error, options = [], className = '', ...props }) => (
  <div className="mb-3">
    {label && (
      <label className="block text-sm font-semibold text-nova-deep mb-1.5">
        {label}
      </label>
    )}
    <select
      className={`input-glass ${className}`}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);
