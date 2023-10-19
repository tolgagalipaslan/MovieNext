import { useEffect, useState } from "react";

const useScrollPast65px = () => {
  const [scrollPast65px, setScrollPast65px] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 65) {
        setScrollPast65px(true);
      } else {
        setScrollPast65px(false);
      }
    };

    // Sayfa yüklendiğinde ve her scroll olayında handleScroll fonksiyonunu çağırın
    window.addEventListener("scroll", handleScroll);

    // Temizleme işlemi: bileşen unmount edildiğinde event listener'ı kaldırın
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPast65px;
};

export default useScrollPast65px;
