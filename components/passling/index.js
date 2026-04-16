import {
  Canvas,
  ColorMatrix,
  Image as SkiaImage,
  useImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { PasslingAssets } from "./assets.js";

/* ---------------- SAFE HELPERS ---------------- */

const safeGet = (obj , key) => {
  if (!obj || key == null) return null;
  return obj[key] ?? null;
};

const normalizeToRgba = (colorString) => {
  if (!colorString) return "rgba(255,255,255,1)";
  const values = colorString.replace(/[()]/g, "").split(",");
  const r = Math.round(parseFloat(values[0]) * 255);
  const g = Math.round(parseFloat(values[1]) * 255);
  const b = Math.round(parseFloat(values[2]) * 255);
  const a = values[3] ? values[3].trim() : "1.0";
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/* ---------------- TINTED LAYER ---------------- */

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

/* ---------------- COMPONENT ---------------- */

const Passling = ({ data, size = 300 }) => {
  if (!data || !PasslingAssets) return null;

  const renderedAvatar = useMemo(() => {
    try {
      const skin = normalizeToRgba(data.body_color);
      const outfitColor = normalizeToRgba(data.outfit_color);
      const legColor = normalizeToRgba(data.legs_color);
      const shoeColor = normalizeToRgba(data.shoe_color);
      const hairColor = normalizeToRgba(data.hair_color);

      /* -------- SAFE ASSET LOOKUPS -------- */

      const hairBackColor = safeGet(PasslingAssets.hairBack?.color, data.hair);
      const hairBackOutline = safeGet(PasslingAssets.hairBack?.outline, data.hair);

      const hairColorFront = safeGet(PasslingAssets.hair?.color, data.hair);
      const hairOutlineFront = safeGet(PasslingAssets.hair?.outline, data.hair);

      const eyes = safeGet(PasslingAssets.eyes, data.eye);
      const eyebrows = safeGet(PasslingAssets.eyebrows, data.eyebrow);
      const mouth = safeGet(PasslingAssets.mouth, data.mouth);

      const noseColor = safeGet(PasslingAssets.nose?.color, data.nose);
      const noseOutline = safeGet(PasslingAssets.nose?.outline, data.nose);

      const legsColor = safeGet(PasslingAssets.legs?.color, data.legs);
      const legsOutline = safeGet(PasslingAssets.legs?.outline, data.legs);

      const shoesColor = safeGet(PasslingAssets.shoes?.color, data.shoes);
      const shoesOutline = safeGet(PasslingAssets.shoes?.outline, data.shoes);

      const outfitRightColor = safeGet(PasslingAssets.rightArm?.color, data.outfit);
      const outfitRightOutline = safeGet(PasslingAssets.rightArm?.outline, data.outfit);

      const outfitTorsoColor = safeGet(PasslingAssets.torso?.color, data.outfit);
      const outfitTorsoOutline = safeGet(PasslingAssets.torso?.outline, data.outfit);

      const outfitLeftColor = safeGet(PasslingAssets.leftArm?.color, data.outfit);
      const outfitLeftOutline = safeGet(PasslingAssets.leftArm?.outline, data.outfit);

      const accessoryColor = safeGet(PasslingAssets.accessory?.color, data.accessory);
      const accessoryOutline = safeGet(PasslingAssets.accessory?.outline, data.accessory);

      return (
        <View style={[styles.container, { width: size, height: size }]}>
          {/* HAIR BACK */}
          {hairBackColor && (
            <TintedLayer source={hairBackColor} color={hairColor} size={size} />
          )}
          {hairBackOutline && <Image source={hairBackOutline} style={styles.layer} />}

          {/* BODY BASE */}
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

          <Image source={require("../../assets/passling/body/base/outline/Base_LeftArm.png")} style={styles.layer} />
          <Image source={require("../../assets/passling/body/base/outline/Base_RightArm.png")} style={styles.layer} />
          <Image source={require("../../assets/passling/body/base/outline/Base_Torso.png")} style={styles.layer} />
          <Image source={require("../../assets/passling/body/base/outline/Base_Head.png")} style={styles.layer} />
          <Image source={require("../../assets/passling/body/base/outline/Base_Leg.png")} style={styles.layer} />

          {/* LEGS */}
          {data.legs !== "none" && legsColor && (
            <>
              <TintedLayer source={legsColor} color={legColor} size={size} />
              {legsOutline && <Image source={legsOutline} style={styles.layer} />}
            </>
          )}

          {/* SHOES */}
          {data.shoes !== "none" && shoesColor && (
            <>
              <TintedLayer source={shoesColor} color={shoeColor} size={size} />
              {shoesOutline && <Image source={shoesOutline} style={styles.layer} />}
            </>
          )}

          {/* OUTFIT */}
          {data.outfit !== "none" && (
            <>
              {outfitRightColor && (
                <TintedLayer source={outfitRightColor} color={outfitColor} size={size} />
              )}
              {outfitRightOutline && <Image source={outfitRightOutline} style={styles.layer} />}

              {outfitTorsoColor && (
                <TintedLayer source={outfitTorsoColor} color={outfitColor} size={size} />
              )}
              {outfitTorsoOutline && <Image source={outfitTorsoOutline} style={styles.layer} />}

              {outfitLeftColor && (
                <TintedLayer source={outfitLeftColor} color={outfitColor} size={size} />
              )}
              {outfitLeftOutline && <Image source={outfitLeftOutline} style={styles.layer} />}
            </>
          )}

          {/* FACE */}
          {eyes && <Image source={eyes} style={styles.layer} />}
          {eyebrows && <Image source={eyebrows} style={styles.layer} />}
          {mouth && <Image source={mouth} style={styles.layer} />}

          {/* NOSE */}
          {noseColor && (
            <TintedLayer source={noseColor} color={skin} size={size} />
          )}
          {noseOutline && <Image source={noseOutline} style={styles.layer} />}

          {/* HAIR FRONT */}
          {hairColorFront && (
            <TintedLayer source={hairColorFront} color={hairColor} size={size} />
          )}
          {hairOutlineFront && <Image source={hairOutlineFront} style={styles.layer} />}

          {/* ACCESSORY */}
          {data.accessory !== "none" && accessoryColor && (
            <>
              <TintedLayer
                source={accessoryColor}
                color={normalizeToRgba(data.accessory_color)}
                size={size}
              />
              {accessoryOutline && <Image source={accessoryOutline} style={styles.layer} />}
            </>
          )}
        </View>
      );
    } catch (e) {
      console.error("Passling render error:", e);
      return null;
    }
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