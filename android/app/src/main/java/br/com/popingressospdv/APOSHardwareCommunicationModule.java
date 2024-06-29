package br.com.popingressospdv;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;

import br.com.uol.pagseguro.plugpagservice.wrapper.exception.PlugPagException;
import br.com.uol.pagseguro.plugpagservice.wrapper.*;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import io.reactivex.ObservableEmitter;
import io.reactivex.Observable;

import android.util.Log;

import android.os.Environment;
import android.os.Build;
import java.util.Locale;

public class APOSHardwareCommunicationModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  private final PaymentModules paymentModules;
  private final PrinterModules printerModules;
  private final NFCModules nfcModules;
  private final PlugPag plugPag;

  private PlugPagAppIdentification appIdentification;
  private Disposable subscribe;

  public APOSHardwareCommunicationModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    PlugPagAppIdentification appIdentification = new PlugPagAppIdentification("Nome projeto", "1.0");
    plugPag = new PlugPag(reactContext, appIdentification);
    nfcModules = new NFCModules(plugPag);
    printerModules = new PrinterModules(plugPag, reactContext);
    paymentModules = new PaymentModules(plugPag, reactContext);
  }

  @Override
  public  String getName() { return "APOSHardwareCommunication"; }

  /*
   *
   *  FUNÇÃO PARA PEGAR O SERIAL NUMBER DA MÁQUINA
   *
   */

  @ReactMethod
  public void getSerialNumber(final Promise promise) {
    String serial = android.os.Build.SERIAL;
    promise.resolve(serial);
  }

  /*
   *
   *  FUNÇÃO PARA PARAR A LEITURA NFC
   *
   */

  @ReactMethod
  public void stopNFC(final Promise promise) {
    PlugPagNFCResult result = plugPag.abortNFC();
    promise.resolve(result.getResult());
  }

  /*
   *
   *  FUNÇÃO PARA LEITURA NFC DE SERIAL NUMBER E SALDO
   *
   */

  @ReactMethod
  public void startGetAllInfo(final Promise promise) {
    subscribe = nfcModules.getAllInfo()
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        promise.resolve(String.valueOf(result));
      }, throwable -> {
        promise.resolve("error");
      });
  }

  /*
   *
   *  FUNÇÃO PARA LEITURA NFC (apenas primeiro slot)
   *
   */

  @ReactMethod
  public void startReadNFC(final Promise promise) {
    subscribe = nfcModules.readNFC()
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        String message = new String(result.getSlots()[4].get("data"), "UTF-8");
        promise.resolve("success|" + message);
      }, throwable -> {
        promise.resolve("error: " + throwable.getMessage());
      });
  }

  /*
   *
   *  FUNÇÃO PARA LEITURA NFC (3 primeros slots)
   *
   */

  @ReactMethod
  public void startGetHash(final Promise promise) {
    subscribe = nfcModules.getHash()
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        promise.resolve("success|" + result);
      }, throwable -> {
        promise.resolve("error");
      });
  }

  /*
   *
   *  ESCRITA NFC
   *
   */

  @ReactMethod
  public void startWriteNFC(ReadableMap data, final Promise promise) {
    String val1 = data.getString("val1");
    String val2 = data.getString("val2");
    String val3 = data.getString("val3");
    subscribe = nfcModules.writeNFC(val1, val2, val3)
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        String message1 = new String(result.getSlots()[4].get("data"), "UTF-8");
        String message2 = new String(result.getSlots()[5].get("data"), "UTF-8");
        String message3 = new String(result.getSlots()[6].get("data"), "UTF-8");
        promise.resolve("success: " + message1 + message2 + message3);
      }, throwable -> {
        promise.resolve("error: " + throwable.getMessage());
      });
  }

  /*
   *
   *  FUNÇÃO PARA ABERTURA DE TAG
   *
   */

  @ReactMethod
  public void startOpenTag(ReadableMap data, final Promise promise) {
    String val1 = data.getString("val1");
    String val2 = data.getString("val2");
    String val3 = data.getString("val3");
    subscribe = nfcModules.openTag(val1, val2, val3)
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        promise.resolve(result);
      }, throwable -> {
        promise.resolve(throwable.getMessage());
      });
  }

  /*
   *
   *  FUNÇÃO PARA FECHAMENTO DE TAG
   *
   */

  @ReactMethod
  public void startCloseTag(final Promise promise) {
    subscribe = nfcModules.closeTag()
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        promise.resolve(result);
      }, throwable -> {
        promise.resolve("error");
      });
  }

  /*
   *
   *  FUNÇÃO PARA SALVAR SENHA TÉCNICA NA TAG
   *
   */

  @ReactMethod
  public void startSaveTec(ReadableMap data, final Promise promise) {
    String val1 = data.getString("val1");
    String val2 = data.getString("val2");
    String val3 = data.getString("val3");
    subscribe = nfcModules.saveTec(val1, val2, val3)
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        promise.resolve(result);
      }, throwable -> {
        promise.resolve("error");
      });
  }

  /*
   *
   * FUNÇÃO PARA PEGAR SENHA TÉCNICA NA TAG
   *
   */

  @ReactMethod
  public void startGetTec(final Promise promise) {
    subscribe = nfcModules.getTec()
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        promise.resolve(result);
      }, throwable -> {
        promise.resolve("error");
      });
  }

  /*
   *
   *  FUNÇÃO PARA SALVAR USUÁRIO E SENHA NA TAG
   *
   */

  @ReactMethod
  public void startSaveUser(ReadableMap data, final Promise promise) {
    String val1 = data.getString("val1");
    String val2 = data.getString("val2");
    String val3 = data.getString("val3");
    String val4 = data.getString("val4");
    String val5 = data.getString("val5");
    String val6 = data.getString("val6");
    subscribe = nfcModules.saveUser(val1, val2, val3, val4, val5, val6)
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        promise.resolve(result);
      }, throwable -> {
        promise.resolve("error");
      });
  }

  /*
   *
   * FUNÇÃO PARA PEGAR USUÁRIO E SENHA NA TAG
   *
   */

  @ReactMethod
  public void startGetUser(final Promise promise) {
    subscribe = nfcModules.getUser()
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        promise.resolve(result);
      }, throwable -> {
        promise.resolve("error");
      });
  }

  /*
   *
   *  FUNÇÃO PARA FORMATAR A TAG
   *
   */

  @ReactMethod
  public void startFormatTag(final Promise promise) {
    subscribe = nfcModules.formatTag()
      .subscribeOn(Schedulers.io())
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(result -> {
        promise.resolve(result);
      }, throwable -> {
        promise.resolve("error");
      });
  }

  /*
   *
   *   FUNÇÃO PARA PAGAMENTO
   *
   */

  @ReactMethod
  public void startPayment(ReadableMap data) {
    Log.d("DEBUG", "O pagamento PAGSEGURO começou 1.");
    paymentModules.startPayment(data);
  }

  /*
   *
   *  FUNÇÃO PARA ESTORNO
   *
   */

  @ReactMethod
  public void startRefound(ReadableMap data) {
    paymentModules.startRefound(data);
  }

  /*
   *
   *  FUNÇÃO PARA CANCELAR OPERAÇÃO
   *
   */

  @ReactMethod
  public void stopPayment(final Promise promise) {
    PlugPagAbortResult result = plugPag.abort();
    String retorno = result.getResult() == 0 ? "sucesso" : "erro";
    promise.resolve(retorno);
  }

  /*
   *
   *  FUNÇÃO PARA IMPRESSÃO
   *
   */

  @ReactMethod
  public void startPrint(ReadableMap image) {
    PlugPagPrinterData data = new PlugPagPrinterData(Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + image.getString("image"), 2, 0);
    printerModules.startPrint(data);
  }
}
