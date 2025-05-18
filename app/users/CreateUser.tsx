import React, { ChangeEvent, FormEvent, useState } from "react";
import { useToast } from "../context/ToastContext";
import InputField from "../context/InputField";
import { buttonStyles } from "@/utils/styles";

interface UserFormData {
  name: string;
  email: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: UserFormData) => void;
}

const classNames = {
  overlay:
    "fixed inset-0 bg-black/40 dark:bg-black/60 overflow-y-auto h-full w-full z-20",
  modal:
    "relative top-20 mx-auto p-5 w-96 rounded-2xl shadow-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-600",
  title: "text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4",
  imagePreview: "mt-4 flex justify-center",
  image:
    "w-32 h-32 object-cover rounded-xl border border-slate-300 dark:border-slate-600",
  buttonContainer: "flex justify-end mt-6 gap-2",
};

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): boolean => {
    const { name, email } = formData;

    if (!name || !email) {
      addToast("error", "Please fill in all fields.", "Validation Error");
      return false;
    }

    if (!emailRegex.test(email)) {
      addToast("error", "Please enter a valid email address.", "Validation Error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      onCreate(formData);
      onClose();
      addToast("success", "User created successfully!", "Success");
    } catch (error: any) {
      console.error("Error creating user:", error.message || error);
      addToast("error", "Failed to create user. Please try again.", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={classNames.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={classNames.modal}>
        <h1 id="modal-title" className={classNames.title}>
          Create New User
        </h1>
        <form onSubmit={handleSubmit} className="mt-5">
          <InputField
            label="User Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required={true}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required={true}
          />

          <div className={classNames.buttonContainer}>
            <button
              type="submit"
              className={buttonStyles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
            <button
              onClick={onClose}
              type="button"
              className={buttonStyles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;