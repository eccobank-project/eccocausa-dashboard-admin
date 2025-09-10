import { cn } from "@/shared/lib/utils";

export const EccoBankLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
          fill="#111827"
        />
        <path
          d="M21.3333 16.0002C21.3333 13.0535 23.0533 11.3335 26 11.3335V6.66683C20.48 6.66683 16 11.1468 16 16.6668V21.3335H21.3333V16.0002Z"
          fill="white"
        />
        <path
          d="M10.6667 16C10.6667 18.9467 8.94667 20.6667 6 20.6667V25.3333C11.52 25.3333 16 20.8533 16 15.3333V10.6667H10.6667V16Z"
          fill="white"
        />
      </svg>
      <span className="text-3xl font-bold text-foreground">EccoBank</span>
    </div>
  );
};

export const GoogleIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48 24C48 22.04 47.84 20.12 47.52 18.28H24.48V28.56H37.92C37.36 31.72 35.72 34.4 33.08 36.2V41.4H40.6C45.24 37.16 48 31.12 48 24Z"
      fill="#4285F4"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.48 48C31.24 48 36.92 45.64 40.6 41.4L33.08 36.2C30.8 37.68 27.88 38.64 24.48 38.64C17.8 38.64 12.2 34.24 10.32 28.2H2.52V33.56C6.24 42.12 14.68 48 24.48 48Z"
      fill="#34A853"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.32 28.2C9.92 26.96 9.72 25.64 9.72 24.32C9.72 23 9.92 21.68 10.32 20.44V15.08H2.52C0.92 18.12 0 21.08 0 24.32C0 27.56 0.92 30.52 2.52 33.56L10.32 28.2Z"
      fill="#FBBC05"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.48 9.36C28.2 9.36 31.52 10.68 34.12 13.12L40.76 6.48C36.88 2.84 31.24 0 24.48 0C14.68 0 6.24 5.88 2.52 14.44L10.32 19.8C12.2 13.8 17.8 9.36 24.48 9.36Z"
      fill="#EA4335"
    />
    // Fix: Corrected the closing SVG tag which had a typo.
  </svg>
);

export const MicrosoftIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1H9.5V9.5H1V1Z" fill="#F25022" />
    <path d="M11.5 1H20V9.5H11.5V1Z" fill="#7FBA00" />
    <path d="M1 11.5H9.5V20H1V11.5Z" fill="#00A4EF" />
    <path d="M11.5 11.5H20V20H11.5V11.5Z" fill="#FFB900" />
  </svg>
);
