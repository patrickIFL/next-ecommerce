import React, { useEffect, useState } from "react";

type SlideProps = {
  desktopImg: string;
  tabletImg: string;
  mobileImg: string;
};

function ImageBanner({ slide }: { slide: SlideProps }) {
  const [img, setImg] = useState<string>("");

  const updateImg = () => {
    const width = window.innerWidth;
    if (width >= 1280) setImg(slide.desktopImg);
    else if (width >= 600) setImg(slide.tabletImg); 
    else setImg(slide.mobileImg);
  };

  useEffect(() => {
    updateImg();
    window.addEventListener("resize", updateImg);
    return () => window.removeEventListener("resize", updateImg);
  }, []);

  return (
    <div
      className={`w-full rounded-b-xl overflow-hidden                   
                    min-h-[560px] md:min-h-[400px]
                    `}
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

export default ImageBanner;
