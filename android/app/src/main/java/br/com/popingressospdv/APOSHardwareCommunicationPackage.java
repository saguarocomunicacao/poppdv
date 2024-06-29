package br.com.popingressospdv;

import androidx.annotation.Nullable;

import java.util.List;
import java.util.Arrays;
import java.util.Collections;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

public class APOSHardwareCommunicationPackage implements ReactPackage {
  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Arrays.<NativeModule>asList(new APOSHardwareCommunicationModule(reactContext));
  }

  @Nullable
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return null;
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
