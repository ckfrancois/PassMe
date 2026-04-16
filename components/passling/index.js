import {
    Canvas,
    ColorMatrix,
    Image as SkiaImage,
    useImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { View } from "react-native";
import { PasslingAssets } from "./assets.js";
  
  // -----------------------------
  // Helpers
  // -----------------------------
  const normalizeToRgba = (colorString) => {
    if (!colorString) return "rgba(255,255,255,1)";
    const values = colorString.replace(/[()]/g, "").split(",");
    const r = Math.round(parseFloat(values[0]) * 255);
    const g = Math.round(parseFloat(values[1]) * 255);
    const b = Math.round(parseFloat(values[2]) * 255);
    return [r / 255, g / 255, b / 255];
  };
  
  const makeMatrix = (r, g, b) => [
    r, 0, 0, 0, 0,
    0, g, 0, 0, 0,
    0, 0, b, 0, 0,
    0, 0, 0, 1, 0,
  ];
  
  // -----------------------------
  // Main Component
  // -----------------------------
  const Passling = ({ data, size = 300 }) => {
    if (!data) return null;
  
    // 🎯 Collect ALL image sources first
    const sources = useMemo(() => {
      return [
        // hair back
        PasslingAssets.hairBack.color[data.hair],
        PasslingAssets.hairBack.outline[data.hair],
  
        // body base color
        require("../../assets/passling/body/base/color/Base_LeftArmT.png"),
        require("../../assets/passling/body/base/color/Base_RightArmT.png"),
        require("../../assets/passling/body/base/color/Base_TorsoT.png"),
        require("../../assets/passling/body/base/color/Base_HeadT.png"),
        require("../../assets/passling/body/base/color/Base_LegT.png"),
  
        // body outline
        require("../../assets/passling/body/base/outline/Base_LeftArm.png"),
        require("../../assets/passling/body/base/outline/Base_RightArm.png"),
        require("../../assets/passling/body/base/outline/Base_Torso.png"),
        require("../../assets/passling/body/base/outline/Base_Head.png"),
        require("../../assets/passling/body/base/outline/Base_Leg.png"),
  
        // face
        PasslingAssets.eyes[data.eye],
        PasslingAssets.eyebrows[data.eyebrow],
        PasslingAssets.mouth[data.mouth],
  
        // nose
        PasslingAssets.nose.color[data.nose],
        PasslingAssets.nose.outline[data.nose],
  
        // hair front
        PasslingAssets.hair.color[data.hair],
        PasslingAssets.hair.outline[data.hair],
  
        // optional
        data.legs !== "none" && PasslingAssets.legs.color[data.legs],
        data.legs !== "none" && PasslingAssets.legs.outline[data.legs],
  
        data.shoes !== "none" && PasslingAssets.shoes.color[data.shoes],
        data.shoes !== "none" && PasslingAssets.shoes.outline[data.shoes],
  
        data.outfit !== "none" && PasslingAssets.leftArm.color[data.outfit],
        data.outfit !== "none" && PasslingAssets.rightArm.color[data.outfit],
        data.outfit !== "none" && PasslingAssets.torso.color[data.outfit],
        data.outfit !== "none" && PasslingAssets.leftArm.outline[data.outfit],
        data.outfit !== "none" && PasslingAssets.rightArm.outline[data.outfit],
        data.outfit !== "none" && PasslingAssets.torso.outline[data.outfit],
  
        data.accessory !== "none" && PasslingAssets.accessory.color[data.accessory],
        data.accessory !== "none" && PasslingAssets.accessory.outline[data.accessory],
      ].filter(Boolean);
    }, [data]);
  
    // 🎯 Load all images
    const images = sources.map((src) => useImage(src));
  
    const allLoaded = images.every((img) => img !== null);
  
    if (!allLoaded) {
      return <View style={{ width: size, height: size }} />; // blank placeholder
    }
  
    // 🎨 Colors
    const skin = normalizeToRgba(data.body_color);
    const outfit = normalizeToRgba(data.outfit_color);
    const legs = normalizeToRgba(data.legs_color);
    const shoes = normalizeToRgba(data.shoe_color);
    const hair = normalizeToRgba(data.hair_color);
    const accessory = normalizeToRgba(data.accessory_color);
  
    let i = 0;
    const next = () => images[i++];
  
    return (
      <Canvas style={{ width: size, height: size }}>
        {/* HAIR BACK */}
        <SkiaImage image={next()} width={size} height={size}>
          <ColorMatrix matrix={makeMatrix(...hair)} />
        </SkiaImage>
        <SkiaImage image={next()} width={size} height={size} />
  
        {/* BODY */}
        {[skin, skin, skin, skin, skin].map((c, idx) => (
          <SkiaImage key={"body" + idx} image={next()} width={size} height={size}>
            <ColorMatrix matrix={makeMatrix(...c)} />
          </SkiaImage>
        ))}
  
        {[...Array(5)].map((_, idx) => (
          <SkiaImage key={"outline" + idx} image={next()} width={size} height={size} />
        ))}
  
        {/* FACE */}
        <SkiaImage image={next()} width={size} height={size} />
        <SkiaImage image={next()} width={size} height={size} />
        <SkiaImage image={next()} width={size} height={size} />
  
        {/* NOSE */}
        <SkiaImage image={next()} width={size} height={size}>
          <ColorMatrix matrix={makeMatrix(...skin)} />
        </SkiaImage>
        <SkiaImage image={next()} width={size} height={size} />
  
        {/* HAIR FRONT */}
        <SkiaImage image={next()} width={size} height={size}>
          <ColorMatrix matrix={makeMatrix(...hair)} />
        </SkiaImage>
        <SkiaImage image={next()} width={size} height={size} />
  
        {/* CONDITIONALS */}
        {data.legs !== "none" && (
          <>
            <SkiaImage image={next()} width={size} height={size}>
              <ColorMatrix matrix={makeMatrix(...legs)} />
            </SkiaImage>
            <SkiaImage image={next()} width={size} height={size} />
          </>
        )}
  
        {data.shoes !== "none" && (
          <>
            <SkiaImage image={next()} width={size} height={size}>
              <ColorMatrix matrix={makeMatrix(...shoes)} />
            </SkiaImage>
            <SkiaImage image={next()} width={size} height={size} />
          </>
        )}
  
        {data.outfit !== "none" && (
          <>
            {[outfit, outfit, outfit].map((c, idx) => (
              <SkiaImage key={"outfit" + idx} image={next()} width={size} height={size}>
                <ColorMatrix matrix={makeMatrix(...c)} />
              </SkiaImage>
            ))}
            {[...Array(3)].map((_, idx) => (
              <SkiaImage key={"outfitOutline" + idx} image={next()} width={size} height={size} />
            ))}
          </>
        )}
  
        {data.accessory !== "none" && (
          <>
            <SkiaImage image={next()} width={size} height={size}>
              <ColorMatrix matrix={makeMatrix(...accessory)} />
            </SkiaImage>
            <SkiaImage image={next()} width={size} height={size} />
          </>
        )}
      </Canvas>
    );
  };
  
  export default React.memo(Passling);