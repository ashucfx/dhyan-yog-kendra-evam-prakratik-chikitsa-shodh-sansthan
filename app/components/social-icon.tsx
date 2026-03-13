type SocialIconProps = {
  label: string;
  className?: string;
};

export function SocialIcon({ label, className }: SocialIconProps) {
  switch (label) {
    case "Instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="5" className="social-icon-stroke" />
          <circle cx="12" cy="12" r="3.5" className="social-icon-stroke" />
          <circle cx="17.2" cy="6.8" r="1" className="social-icon-fill" />
        </svg>
      );
    case "Facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            className="social-icon-fill"
            d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.6 1.6-1.6h1.5V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4.1V11H8v3h2.5v7h3Z"
          />
        </svg>
      );
    case "YouTube":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            className="social-icon-stroke"
            d="M20 8.5c-.2-1.3-1.2-2.3-2.5-2.5C15.8 5.7 14 5.5 12 5.5s-3.8.2-5.5.5C5.2 6.2 4.2 7.2 4 8.5c-.3 1.6-.3 3.4 0 5 .2 1.3 1.2 2.3 2.5 2.5 1.7.3 3.5.5 5.5.5s3.8-.2 5.5-.5c1.3-.2 2.3-1.2 2.5-2.5.3-1.6.3-3.4 0-5Z"
          />
          <path className="social-icon-fill" d="m10 9 5 3-5 3V9Z" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            className="social-icon-stroke"
            d="M12 5.5a6.5 6.5 0 0 0-5.7 9.6L5.5 19l4.1-.8A6.5 6.5 0 1 0 12 5.5Z"
          />
          <path
            className="social-icon-fill"
            d="M15.7 13.8c-.2-.1-1-.5-1.1-.6-.2-.1-.3-.1-.4.1l-.3.5c-.1.1-.2.2-.4.1a5.4 5.4 0 0 1-2.7-2.4c-.1-.2 0-.3.1-.4l.3-.4.1-.3-.1-.3-.5-1.2c-.1-.2-.2-.2-.4-.2h-.3c-.1 0-.3.1-.4.2-.4.4-.6.9-.6 1.5 0 .4.1.8.3 1.1a7.7 7.7 0 0 0 4.7 4c.7.2 1.3.2 1.7 0 .5-.2 1-.7 1.1-1.1.1-.4.1-.8 0-.9Z"
          />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" className="social-icon-stroke" />
        </svg>
      );
  }
}
