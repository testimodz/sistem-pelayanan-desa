import { useState, useEffect } from 'react';

const GenericForm = ({ 
  fields, 
  onSubmit, 
  loading = false, 
  error = '',
  initialData = {},
  submitButtonText = 'Buat Surat'
}) => {
  const [formData, setFormData] = useState({});
  const [initialized, setInitialized] = useState(false); // TAMBAH FLAG

  // Initialize form data - RUN ONCE ONLY
  useEffect(() => {
    if (initialized) return; // STOP kalau udah init
    
    const initData = {};
    
    if (Object.keys(initialData).length > 0) {
      Object.assign(initData, initialData);
    } else {
      fields.forEach((field) => {
        if (field.type === 'select' && field.options) {
          initData[field.name] = field.options[0]?.value || '';
        } else {
          initData[field.name] = '';
        }
      });
    }
    
    setFormData(initData);
    setInitialized(true); // MARK as initialized
  }, []); // EMPTY DEPENDENCY - run once only

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    const baseInputClass = "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20";
    
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className={baseInputClass}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className={baseInputClass}
          />
        );
      
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInputClass}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  // Don't render until initialized
  if (!initialized) {
    return <div>Loading form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>
            {renderField(field)}
            {field.hint && (
              <p className="mt-2 text-xs text-gray-500">{field.hint}</p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-linear-to-r from-green-600 to-emerald-600 px-8 py-4 font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Menyimpan...</span>
            </div>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
};

export default GenericForm;
