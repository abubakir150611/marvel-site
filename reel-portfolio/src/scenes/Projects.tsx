import React from "react";
import { Sticker } from "../components/Kinetic";
import { Project } from "../components/Project";
import { local, R, RF } from "../theme";

/** 02 — FLOWERSGREEN: главная → товар → админка (настоящие экраны, демо-каталог). */
export const S2Flowers: React.FC = () => {
  const L = local("flowers");
  return (
    <Project
      bg="#F4F1EA"
      ink="#1F3A2B"
      accent="#2E4A3A"
      name="FLOWERSGREEN"
      nameFont={RF.serif}
      tag="цветочный магазин · Бишкек"
      shots={[
        { src: "screens/fl-home.jpg", from: 0, scroll: [0, 720] },
        { src: "screens/fl-product.jpg", from: L.at(15) - 2, scroll: [0, 120] },
        { src: "screens/fl-admin.jpg", from: L.at(17) - 2, scroll: [0, 260] },
      ]}
      points={[
        { label: "Каталог", at: L.at(14) },
        { label: "Корзина", at: L.at(15) },
        { label: "Админка", at: L.at(17) },
      ]}
    >
      <Sticker at={L.at(21)} rotate={-5} bg={R.amber} style={{ left: 50, top: 1180, fontSize: 40 }}>
        владелец сам меняет цены
      </Sticker>
    </Project>
  );
};

/** 03 — JAPONICA: главная RU → KG → карточка товара с заказом в WhatsApp. */
export const S3Japonica: React.FC = () => {
  const L = local("japonica");
  return (
    <Project
      bg={R.black}
      ink={R.white}
      accent="#C9A86A"
      name="JAPONICA"
      nameFont={RF.serif}
      tag="японская косметика · Бишкек"
      shots={[
        { src: "screens/jp-home.jpg", from: 0, scroll: [0, 500] },
        { src: "screens/jp-home-ky.jpg", from: L.at(29) + 4 },
        { src: "screens/jp-product.jpg", from: L.at(34) - 2, scroll: [0, 220] },
      ]}
      points={[
        { label: "RU / KG", at: L.at(29) },
        { label: "Цены в сомах", at: L.at(31) },
        { label: "Заказ в WhatsApp", at: L.at(34) },
      ]}
    >
      <Sticker at={L.at(36)} rotate={6} bg="#25D366" color={R.white} style={{ left: 60, top: 1200, fontSize: 44 }}>
        WhatsApp ✓
      </Sticker>
    </Project>
  );
};

/** 04 — WasteZero AI: дашборд → находка перерасхода (настоящие экраны, демо-данные). */
export const S4Waste: React.FC = () => {
  const L = local("waste");
  return (
    <Project
      bg={R.emerald}
      ink={R.white}
      accent={R.emerald}
      name="WasteZero AI"
      tag="ИИ для школ · свет, вода, тепло"
      shots={[
        { src: "screens/wz-dashboard.jpg", from: 0, scroll: [0, 600] },
        { src: "screens/wz-insight.jpg", from: L.at(44) - 2, scroll: [0, 300] },
      ]}
      points={[
        { label: "Свет", at: L.at(45) },
        { label: "Вода", at: L.at(46) },
        { label: "Тепло", at: L.at(48) },
      ]}
    >
      <Sticker at={L.at(44)} rotate={-5} bg={R.amber} style={{ left: 50, top: 1180, fontSize: 44 }}>
        находит перерасход
      </Sticker>
    </Project>
  );
};
