import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  display?: boolean;
}

const BackMobileButton = ({
  href,
  label,
  className,
  display = true,
}: BackButtonProps) => {
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
    <Button
      variant="secondary"
      size="icon"
      className={`size-10 bg-white hover:bg-neutral-100 shadow-md hover:size-11 ${className} ${display ? "" : "hidden"}`}
      onClick={handleClick}
      aria-label="Recenter map"
    >
      <ArrowLeft className="size-5" />
    </Button>
  );
};

export default BackMobileButton;
