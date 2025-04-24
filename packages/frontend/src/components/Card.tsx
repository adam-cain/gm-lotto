export default function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
		<div className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
            {children}
        </div>
    );
}