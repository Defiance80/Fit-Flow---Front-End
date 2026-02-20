import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="px-4 py-5 secondaryBg border-t text-center text-sm text-gray-500">
      <p>
        Copyright © {currentYear} All Rights Reserved & Designed by{" "}
        <Link
          href="https://wrteam.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline font-medium"
        >
          WRTeam
        </Link>
      </p>
    </div>
  );
};

export default Footer;
