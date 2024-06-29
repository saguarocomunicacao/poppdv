package br.com.popingressospdv;

import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class PrinterModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;
    private PrinterHelper printerHelper;

    public PrinterModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        this.printerHelper = new PrinterHelper(reactContext);
    }

    @Override
    public String getName() {
        return "PositivoL400";
    }

    @ReactMethod
    public void printReceipt() {
        printerHelper.onPositivoReceiptClicked();
    }

    @ReactMethod
    public void imprimeTexto(String texto) {
        printerHelper.imprimeTextoModule(texto);
    }

    @ReactMethod
    public void avancaLinha(int linha) {
        printerHelper.avancaLinhaModule(linha);
    }

    @ReactMethod
    public void imprimeBarCode(String texto) {
        printerHelper.printBarCode(texto);
    }

    @ReactMethod
    public void imprimeQRCode(String texto) {
        printerHelper.printQRCode(texto);
    }

}
