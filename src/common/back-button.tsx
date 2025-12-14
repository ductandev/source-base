import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

const BackButton = ({ href, label, className }: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      // if href is provided, navigate to that URL
      router.push(href);
    } else {
      // if href is not provided, go back to the previous page
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center hover:text-rose-500"
    >
      <ArrowLeft className="mr-2 h-4 w-4 hover:font-extrabold" />
      <span className={`text-base font-semibold ${className}`}>{label}</span>
    </button>
  );
};

export default BackButton;
