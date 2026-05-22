// Recreated Upwork "Top Rated" badge: rounded blue hexagon + blue 5-point star with a white rounded outline.
const BADGE_BLUE = '#1F57C3';

export default function TopRatedBadge({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden className={className}>
            <polygon
                points="16,4.5 25.96,10.25 25.96,21.75 16,27.5 6.04,21.75 6.04,10.25"
                fill={BADGE_BLUE}
                stroke={BADGE_BLUE}
                strokeWidth={5}
                strokeLinejoin="round"
            />
            <polygon
                points="16,9.7 17.47,13.98 21.99,14.05 18.38,16.77 19.7,21.1 16,18.5 12.3,21.1 13.62,16.77 10.01,14.05 14.53,13.98"
                fill={BADGE_BLUE}
                stroke="#FFFFFF"
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}
