import {
  Canvas,
  ColorMatrix,
  Image as SkiaImage,
  useImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { PasslingAssets } from "./assets.js";

function TintedLayer({ source, color, size }) {
  const image = useImage(source);
  if (!image) return null;

  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const r = match ? parseInt(match[1]) / 255 : 1;
  const g = match ? parseInt(match[2]) / 255 : 1;
  const b = match ? parseInt(match[3]) / 255 : 1;

  const matrix = [r, 0, 0, 0, 0, 0, g, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0, 1, 0];

  return (
    <Canvas style={{ position: "absolute", width: size, height: size }}>
      <SkiaImage
        image={image}
        x={0}
        y={0}
        width={size}
        height={size}
        fit="contain"
      >
        <ColorMatrix matrix={matrix} />
      </SkiaImage>
    </Canvas>
  );
}

const normalizeToRgba = (colorString) => {
  if (!colorString) return "rgba(255,255,255,1)";
  const values = colorString.replace(/[()]/g, "").split(",");
  const r = Math.round(parseFloat(values[0]) * 255);
  const g = Math.round(parseFloat(values[1]) * 255);
  const b = Math.round(parseFloat(values[2]) * 255);
  const a = values[3] ? values[3].trim() : "1.0";
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const Passling = ({ data, size = 300 }) => {
  if (!data) return null;
  if (!PasslingAssets) {
    console.error(
      "PasslingAssets is undefined. Check your named export/import!",
    );
    return null;
  }

  const renderedAvatar = useMemo(() => {
    const skin = normalizeToRgba(data.body_color);
    const outfitColor = normalizeToRgba(data.outfit_color);
    const legColor = normalizeToRgba(data.legs_color);
    const shoeColor = normalizeToRgba(data.shoe_color);
    const hairColor = normalizeToRgba(data.hair_color);

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        {/* --- HAIR BACK --- */}
        <TintedLayer
          source={PasslingAssets.hairBack.color[data.hair]}
          color={hairColor}
          size={size}
        />
        <Image
          source={PasslingAssets.hairBack.outline[data.hair]}
          style={styles.layer}
        />

        {/* --- BODY BASE --- */}
        <TintedLayer
          source={require("../../assets/passling/body/base/color/Base_LeftArmT.png")}
          color={skin}
          size={size}
        />
        <TintedLayer
          source={require("../../assets/passling/body/base/color/Base_RightArmT.png")}
          color={skin}
          size={size}
        />
        <TintedLayer
          source={require("../../assets/passling/body/base/color/Base_TorsoT.png")}
          color={skin}
          size={size}
        />
        <TintedLayer
          source={require("../../assets/passling/body/base/color/Base_HeadT.png")}
          color={skin}
          size={size}
        />
        <TintedLayer
          source={require("../../assets/passling/body/base/color/Base_LegT.png")}
          color={skin}
          size={size}
        />
        <Image
          source={require("../../assets/passling/body/base/outline/Base_LeftArm.png")}
          style={styles.layer}
        />
        <Image
          source={require("../../assets/passling/body/base/outline/Base_RightArm.png")}
          style={styles.layer}
        />
        <Image
          source={require("../../assets/passling/body/base/outline/Base_Torso.png")}
          style={styles.layer}
        />
        <Image
          source={require("../../assets/passling/body/base/outline/Base_Head.png")}
          style={styles.layer}
        />
        <Image
          source={require("../../assets/passling/body/base/outline/Base_Leg.png")}
          style={styles.layer}
        />

        {/* --- LEGS & SHOES --- */}
        {data.legs !== "none" && (
          <>
            <TintedLayer
              source={PasslingAssets.legs.color[data.legs]}
              color={legColor}
              size={size}
            />
            <Image
              source={PasslingAssets.legs.outline[data.legs]}
              style={styles.layer}
            />
          </>
        )}

        {data.shoes !== "none" && (
          <>
            <TintedLayer
              source={PasslingAssets.shoes.color[data.shoes]}
              color={shoeColor}
              size={size}
            />
            <Image
              source={PasslingAssets.shoes.outline[data.shoes]}
              style={styles.layer}
            />
          </>
        )}

        {/* --- OUTFIT --- */}
        {data.outfit !== "none" && (
          <>
            <TintedLayer
              source={PasslingAssets.leftArm.color[data.outfit]}
              color={outfitColor}
              size={size}
            />
            <TintedLayer
              source={PasslingAssets.rightArm.color[data.outfit]}
              color={outfitColor}
              size={size}
            />
            <TintedLayer
              source={PasslingAssets.torso.color[data.outfit]}
              color={outfitColor}
              size={size}
            />
            <Image
              source={PasslingAssets.leftArm.outline[data.outfit]}
              style={styles.layer}
            />
            <Image
              source={PasslingAssets.rightArm.outline[data.outfit]}
              style={styles.layer}
            />
            <Image
              source={PasslingAssets.torso.outline[data.outfit]}
              style={styles.layer}
            />
          </>
        )}

        {/* --- HEAD FEATURES --- */}
        <Image source={PasslingAssets.eyes[data.eye]} style={styles.layer} />
        <Image
          source={PasslingAssets.eyebrows[data.eyebrow]}
          style={styles.layer}
        />
        <Image source={PasslingAssets.mouth[data.mouth]} style={styles.layer} />

        {/* --- NOSE --- */}
        <TintedLayer
          source={PasslingAssets.nose.color[data.nose]}
          color={skin}
          size={size}
        />
        <Image
          source={PasslingAssets.nose.outline[data.nose]}
          style={styles.layer}
        />

        {/* --- HAIR FRONT --- */}
        <TintedLayer
          source={PasslingAssets.hair.color[data.hair]}
          color={hairColor}
          size={size}
        />
        <Image
          source={PasslingAssets.hair.outline[data.hair]}
          style={styles.layer}
        />

        {/* --- ACCESSORIES --- */}
        {data.accessory !== "none" && (
          <>
            <TintedLayer
              source={PasslingAssets.accessory.color[data.accessory]}
              color={normalizeToRgba(data.accessory_color)}
              size={size}
            />
            <Image
              source={PasslingAssets.accessory.outline[data.accessory]}
              style={styles.layer}
            />
          </>
        )}
      </View>
    );
  }, [data, size]);

  return renderedAvatar;
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default React.memo(Passling);
