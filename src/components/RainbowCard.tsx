import type { ReactNode } from 'react';

interface RainbowCardProps {
  /** เนื้อหาภายในกล่องการ์ด */
  children: ReactNode;
  /** คลาสเพิ่มเติมสำหรับกล่องด้านนอก */
  className?: string;
  /** คลาสเพิ่มเติมสำหรับพื้นที่เนื้อหาด้านใน */
  contentClassName?: string;
  /** เปิดใช้ขอบสีสายรุ้งพาสเทลหรือไม่ (ค่าเริ่มต้น true) */
  rainbowBorder?: boolean;
}

/**
 * การ์ดดีไซน์น่ารักขอบสายรุ้งพาสเทลสำหรับใช้ซ้ำทั่วทั้งแอป PawPocket
 *
 * @param props พร็อพส์ของการ์ดสายรุ้ง
 * @returns คอมโพเนนต์การ์ดขอบสายรุ้งพาสเทล
 */
export default function RainbowCard({
  children,
  className = '',
  contentClassName = 'p-5',
  rainbowBorder = true,
}: RainbowCardProps) {
  if (!rainbowBorder) {
    return (
      <div
        className={`rounded-3xl border border-pink-100 bg-white/90 shadow-sm shadow-pink-100/60 backdrop-blur-sm ${contentClassName} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`rainbow-border-gradient rounded-[26px] p-[2px] shadow-md shadow-pink-200/45 transition-shadow duration-300 hover:shadow-lg hover:shadow-pink-200/60 ${className}`}
    >
      <div
        className={`h-full w-full rounded-[24px] bg-white/95 backdrop-blur-sm ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

