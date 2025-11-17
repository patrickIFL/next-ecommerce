"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useTheme } from "./theme-provider";

const Footer = () => {
  const { isDark } = useTheme();

  const menus = [
    {
      title: "Company",
      list: [
        { name: "Home", link: "#" },
        { name: "About Us", link: "#" },
        { name: "Contact Us", link: "#" },
        { name: "Privacy Policy", link: "#" },
      ],
    },
  ];

  const contactNumber = "+1-234-567-890";
  const contactEmail = "contact@greatstack.dev";

  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">

        {/* Logo + Description */}
        <div className="w-4/5">
          <Image
            className="cursor-pointer w-28 md:w-32"
            onClick={() => {}}
            src={isDark ? assets.logo_white : assets.logo}
            alt="logo"
          />

          <p className="mt-6 text-sm text-foreground">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the {"industry's"} standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Menu Section */}
        <div className="w-1/2 text-foreground flex items-center justify-start md:justify-center">
          <div>
            {menus.map((menu, index) => (
              <div key={index}>
                <h2 className="font-medium mb-5">
                  {menu.title}
                </h2>
                <ul className="text-sm space-y-2">
                  {menu.list.map((item, idx) => (
                    <li key={idx}>
                      <a
                        className="hover:underline transition"
                        href={item.link}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-foreground mb-5">Get in touch</h2>
            <div className="text-sm space-y-2 text-foreground">
              <p>{contactNumber}</p>
              <p>{contactEmail}</p>
            </div>
          </div>
        </div>

      </div>

      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © GreatStack.dev All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
