import { useMemo } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  type DimensionValue,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type AnimatedBackgroundProps = {
  backgroundColor?: string;
  patternColor?: string;
  style?: ViewStyle;
};

type GridCell = {
  left: number;
  size: number;
  top: number;
};

const CELL_SIZE = 54;
const CELL_GAP = 14;
const DRIFT_DISTANCE = CELL_SIZE + CELL_GAP;

function buildGrid(width: number, height: number) {
  const columns = Math.ceil(width / DRIFT_DISTANCE) + 3;
  const rows = Math.ceil(height / DRIFT_DISTANCE) + 3;
  const cells: GridCell[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const isOffsetRow = row % 2 === 1;
      const size = row % 3 === 0 ? 48 : row % 3 === 1 ? 52 : 44;
      const left =
        column * DRIFT_DISTANCE - DRIFT_DISTANCE + (isOffsetRow ? 10 : 0);
      const top = row * DRIFT_DISTANCE - DRIFT_DISTANCE;

      cells.push({ left, size, top });
    }
  }

  return cells;
}

export function AnimatedBackground({
  backgroundColor = "#B9E4FF",
  patternColor = "rgba(255,255,255,0.38)",
  style,
}: AnimatedBackgroundProps) {
  const { height, width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const cells = useMemo(() => buildGrid(width, height), [height, width]);

  progress.value = withRepeat(
    withTiming(1, {
      duration: 12000,
      easing: Easing.linear,
    }),
    -1,
    false,
  );

  const animatedGridStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: progress.value * DRIFT_DISTANCE,
      },
    ],
  }));

  return (
    <View
      style={[StyleSheet.absoluteFillObject, styles.container, { backgroundColor }, style]}
    >
      <Animated.View style={[styles.gridLayer, animatedGridStyle]}>
        {cells.map((cell, index) => (
          <View
            key={`${cell.left}-${cell.top}-${index}`}
            style={[
              styles.squircle,
              {
                backgroundColor: patternColor,
                height: cell.size,
                left: cell.left as DimensionValue,
                top: cell.top as DimensionValue,
                width: cell.size,
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  gridLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  squircle: {
    position: "absolute",
    borderRadius: 18,
  },
});
