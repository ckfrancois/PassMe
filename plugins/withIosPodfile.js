// plugins/withIosPodfile.js
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withIosPodfile = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      const marker = 'ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES';

      if (podfile.includes(marker)) {
        return config;
      }

      const injection = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        build_config.build_settings['ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
        if target.name == 'RNFBApp'
          build_config.build_settings['DEFINES_MODULE'] = 'NO'
        end
      end
    end`;

      const anchor = `ccache_enabled?(podfile_properties),\n    )`;

      if (!podfile.includes(anchor)) {
        throw new Error(
          'withIosPodfile: Could not find the expected anchor in Podfile.'
        );
      }

      podfile = podfile.replace(anchor, `${anchor}\n${injection}`);
      fs.writeFileSync(podfilePath, podfile);

      return config;
    },
  ]);
};

module.exports = withIosPodfile;