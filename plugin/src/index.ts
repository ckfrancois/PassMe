import { ConfigPlugin } from "expo/config-plugins";
import withGodotFiles from "./withGodotFiles";
import withPckFile from "./withPckFile";
import withPckFile2 from "./withPckFile2";

const withPlugin: ConfigPlugin = (config) => {
  // Copy Godot files to Android assets
  config = withGodotFiles(config);
  config = withPckFile2(config);
  // Copy main.pck to iOS project
  return withPckFile(config);
};

export default withPlugin;
