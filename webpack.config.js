const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync({
        ...env,
        babel: {
            dangerouslyAddModulePathsToTranspile: [
              '@codler/react-native-keyboard-aware-scroll-view',
              '@dudigital/react-native-zoomable-view'
            ]
        }
    }, argv);
    return config;
};
