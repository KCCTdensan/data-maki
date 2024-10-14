import { NavLink as RemixNavLink } from "@remix-run/react";
import type { ReactNode } from "react";

type Props = Readonly<{
  to: string;
  children: ReactNode;
}>;

export const NavLink = ({ to, children }: Props) => {
  return (
    <RemixNavLink
      to={to}
      style={({ isActive, isPending }) => ({
        transition: "all 0.2s",
        color: isPending ? "var(--mauve-8)" : isActive ? "var(--mauve-12)" : "var(--blue-8)",
        paddingInline: "16px",
        paddingBlock: "10px",
        backgroundColor: isActive ? "var(--mauve-6)" : "transparent",
        borderRadius: "4px",
      })}
    >
      {children}
    </RemixNavLink>
  );
};
