const { withGradleProperties } = require("@expo/config-plugins");

const withReactNativeArchitectures = (config) => {
  return withGradleProperties(config, (gradleConfig) => {
    gradleConfig.modResults = gradleConfig.modResults.filter(
      (item) => item.key !== "reactNativeArchitectures",
    );
    gradleConfig.modResults.push({
      type: "property",
      key: "reactNativeArchitectures",
      value: "arm64-v8a,armeabi-v7a",
    });
    return gradleConfig;
  });
};

module.exports = withReactNativeArchitectures;
