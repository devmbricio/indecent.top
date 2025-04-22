import React, { useState } from "react";

interface SocialsFormProps {
  initialSocials?: {
    indecent?: string;
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    pinterest?: string;
    twitter?: string;
    youtube?: string;
    onlyfans?: string;
    privacySocial?: string;
  };
  onSubmit: (data: any) => void;
}

const SocialsForm: React.FC<SocialsFormProps> = ({ initialSocials = {}, onSubmit }) => {
  const [formData, setFormData] = useState(initialSocials);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        "indecent",
        "whatsapp",
        "instagram",
        "tiktok",
        "facebook",
        "pinterest",
        "twitter",
        "youtube",
        "onlyfans",
        "privacy",
      ].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {field}
          </label>
          <input
            type="text"
            name={field}
            value={formData[field as keyof typeof formData] || ""}
            onChange={handleChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={`Digite o link do ${field}`}
          />
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 text-[#ddc897] bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Salvar
      </button>
    </form>
  );
};

export default SocialsForm;
