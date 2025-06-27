import { toast } from 'react-hot-toast';

export const Success = (message = "Success! Your action was completed.") => {
  toast.success(message, {
    duration: 4000,
    style: {
      background: '#d1fae5',
      color: '#065f46',
      border: '1px solid #10b981',
    },
    icon: '✅',
  });
};

export const Error = (message = "Oops! Something went wrong.") => {
  toast.error(message, {
    duration: 4000,
    style: {
      background: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #ef4444',
    },
    icon: '❌',
  });
};
