import { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
    width?: number;
    height?: number;
    className?: string;
}