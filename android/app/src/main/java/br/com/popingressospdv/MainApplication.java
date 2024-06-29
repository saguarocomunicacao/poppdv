package br.com.popingressospdv;

import br.com.popingressospdv.generated.BasePackageList;

import android.app.Application;

import androidx.annotation.CallSuper;
import androidx.annotation.NonNull;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.dooboolab.audiorecorderplayer.RNAudioRecorderPlayerPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.reactnative.camera.RNCameraPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.picker.RNCPickerPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import cn.jystudio.bluetooth.RNBluetoothEscposPrinterPackage;
import com.rnfs.RNFSPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.horcrux.svg.SvgPackage;
import br.com.popingressospdv.APOSHardwareCommunicationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;

import java.util.Arrays;
import java.util.List;

import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
/**
 * Base class for maintaining global application state -- in this case, the {@link ReactNativeHost}.
 */
public final class MainApplication extends Application implements ReactApplication {

    private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(new BasePackageList().getPackageList(), null);

    private static final String JS_BUNDLE_NAME = "index.bundle";
    private static final String JS_MAIN_MODULE_NAME = "index";

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.USE_DEVELOPER_SUPPORT;
        }

        /**
         * Returns the name of the main module. Determines the URL used to fetch the JS bundle
         * from the packager server. It is only used when dev support is enabled.
         */
        @NonNull
        @Override
        protected String getJSMainModuleName() {
            return JS_MAIN_MODULE_NAME;
        }

        /**
         * Returns the name of the bundle in assets.
         */
        @NonNull
        @Override
        protected String getBundleAssetName() {
            return JS_BUNDLE_NAME;
        }

        /**
         * <p>
         *     Returns a list of {@link ReactPackage}s used by the app.
         * </p>
         * <p>
         *     This method is called by the React Native framework.
         *     It is not normally called by the application itself.
         * </p>
         */
        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                    new ActivityStarterReactPackage(),
                    new RedePackage(),
                    new PrinterModulePackage(),
                    new MainReactPackage(),
            new ReactSliderPackage(),
            new RNAudioRecorderPlayerPackage(),
            new ReactNativeOneSignalPackage(),
                    new RNDeviceInfo(),
                    new NetInfoPackage(),
                    new MapsPackage(),
                    new RNFusedLocationPackage(),
                    new RNSoundPackage(),
                    new RNSpinkitPackage(),
                    new ImagePickerPackage(),
                    new RNCWebViewPackage(),
                    new LinearGradientPackage(),
                    new ReactVideoPackage(),
                    new AsyncStoragePackage(),
                    new PickerPackage(),
                    new RNCPickerPackage(),
                    new RNGoogleSigninPackage(),
                    new ReactNativeFirebaseAppPackage(),
                    new FBSDKPackage(),
                    new RNBluetoothEscposPrinterPackage(),
                    new RNFSPackage(),
                    new RNSharePackage(),
                    new CustomToastPackage(),
                    new APOSHardwareCommunicationPackage(),
                    new ModuleRegistryAdapter(mModuleRegistryProvider),
            new RNCameraPackage(),
            new RNPermissionsPackage(),
            new SvgPackage()
            );
        }
    };

    /**
     * Get the {@link ReactNativeHost} for this app.
     */
    @Override
    @NonNull
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    /**
     * Called when the application is starting, before any activity, service,
     * or receiver objects (excluding content providers) have been created.
     *
     * <p>This implementation loads the React Native JNI libraries.</p>
     */
    @Override
    @CallSuper
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);
    }
}
