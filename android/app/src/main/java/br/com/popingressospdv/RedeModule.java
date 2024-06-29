package br.com.popingressospdv;

import static android.widget.Toast.LENGTH_LONG;
import static android.widget.Toast.LENGTH_SHORT;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

import rede.smartrede.sdk.FlexTipoPagamento;
import rede.smartrede.sdk.Payment;
import rede.smartrede.sdk.PaymentStatus;
import rede.smartrede.sdk.Receipt;
import rede.smartrede.sdk.RedePaymentValidationError;
import rede.smartrede.sdk.RedePayments;

public class RedeModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static ReactApplicationContext reactContext;

    public static final String TAG = "TokCompra";
    public static final int REQ_CODE_PAYMENT = 1;
    public static final int REQ_CODE_REPRINT = 2;
    public static final int REQ_CODE_REVERSAL = 3;
    private static final String MONEY_PATTERN = "###,###,##0.00";
    private static final DecimalFormat moneyFormat = new DecimalFormat(MONEY_PATTERN,
            DecimalFormatSymbols.getInstance(new Locale("pt", "BR")));
    private final RedePayments redePayments;
    public Activity activity = null;
    private Callback callback;


    RedeModule(ReactApplicationContext context){
        super(context);

        reactContext = context;

        reactContext.addActivityEventListener(this);
        redePayments = RedePayments.getInstance(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "RedeModule";
    }


    private BroadcastReceiver mBroadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {

            Bundle args = intent.getExtras();
            assert args != null;
            String s = args.getString("PVNumber");
            Log.v("PvNumber", s);
        }
    };


    @ReactMethod
    public void startService() {
        Log.i("RedeModulo - ", "startService");
        Log.i("PVService", Integer.toString(android.os.Process.myPid()));
        Intent intent = new Intent("br.com.mobilerede.PVNumber");

        try {
            ContextCompat.startForegroundService(getReactApplicationContext(), intent);
        } catch (Throwable throwable) {
            Log.e("MainActivity - ", throwable.getMessage());
        }
    }

    @ReactMethod
    public void onReversal() {
        try {
            Intent reversal = redePayments.intentForReversal();
            activity = getCurrentActivity(); // mais aqui me parece que ja pode!!!
            activity.startActivityForResult(reversal, REQ_CODE_REVERSAL);
        } catch(ActivityNotFoundException ex) {
            Log.e("TokCompra", "Poynt Payment Activity not found - did you install PoyntServices?");
        }
    }

    @ReactMethod
    public void openPaymentCredito(int valor, int parcelas) {

        try {
            String result = "Sem objeto Payment";
            Intent collectPaymentIntent = redePayments
                    .intentForPaymentBuilder(FlexTipoPagamento.CREDITO_PARCELADO, valor)
                    .setInstallments(parcelas)
                    .build();
            activity = getCurrentActivity(); // mais aqui me parece que ja pode!!!
            activity.startActivityForResult(collectPaymentIntent, REQ_CODE_PAYMENT);
        } catch (ActivityNotFoundException ex) {
            Log.e("TokCompra", "Poynt Payment Activity not found - did you install PoyntServices?");
        } catch (RedePaymentValidationError redePaymentValidationError){
            Toast.makeText(getReactApplicationContext(), redePaymentValidationError.getMessage(), LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void openPaymentCreditoVista(int valor) {
        try {
            Intent collectPaymentIntent = redePayments
                    .intentForPaymentBuilder(FlexTipoPagamento.CREDITO_A_VISTA, valor)
                    .build();
            activity = getCurrentActivity(); // mais aqui me parece que ja pode!!!
            activity.startActivityForResult(collectPaymentIntent, REQ_CODE_PAYMENT);
        } catch (ActivityNotFoundException ex) {
            Log.e("TokCompra", "Poynt Payment Activity not found - did you install PoyntServices?");
        } catch (RedePaymentValidationError redePaymentValidationError){
            Toast.makeText(getReactApplicationContext(), redePaymentValidationError.getMessage(), LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void openPaymentDebito(int valor) {
        try {
            Intent collectPaymentIntent = redePayments
                    .intentForPaymentBuilder(FlexTipoPagamento.DEBITO, valor)
                    .build();
            activity = getCurrentActivity(); // mais aqui me parece que ja pode!!!
            activity.startActivityForResult(collectPaymentIntent, REQ_CODE_PAYMENT);
        } catch (ActivityNotFoundException ex) {
            Log.e("TokCompra", "Poynt Payment Activity not found - did you install PoyntServices?");
        } catch (RedePaymentValidationError redePaymentValidationError){
            Toast.makeText(getReactApplicationContext(), redePaymentValidationError.getMessage(), LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void openPaymentPix(int valor) {
        try {
            Intent collectPaymentIntent = redePayments
                    .intentForPaymentBuilder(FlexTipoPagamento.PIX, valor)
                    .build();
            activity = getCurrentActivity(); // mais aqui me parece que ja pode!!!
            activity.startActivityForResult(collectPaymentIntent, REQ_CODE_PAYMENT);
        } catch (ActivityNotFoundException ex) {
            Log.e("TokCompra", "Poynt Payment Activity not found - did you install PoyntServices?");
        } catch (RedePaymentValidationError redePaymentValidationError){
            Toast.makeText(getReactApplicationContext(), redePaymentValidationError.getMessage(), LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void openPaymentFragmentCreditoEmissor(int i) {
        try {
            Intent collectPaymentIntent = redePayments.intentForPaymentBuilder(
                            FlexTipoPagamento.CREDITO_PARCELADO_EMISSOR, i)
                    .setInstallments(4)
                    .build();
            activity.startActivityForResult(collectPaymentIntent, REQ_CODE_PAYMENT);
        } catch (ActivityNotFoundException ex) {
            Log.e("TokCompra", "Poynt Payment Activity not found - did you install PoyntServices?");
        } catch (RedePaymentValidationError redePaymentValidationError){
            Toast.makeText(getReactApplicationContext(), redePaymentValidationError.getMessage(), LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void openPaymentVoucher(int i) {
        try {
            Intent collectPaymentIntent = redePayments.intentForPaymentBuilder(
                            FlexTipoPagamento.VOUCHER, i)
                    .build();
            activity.startActivityForResult(collectPaymentIntent, REQ_CODE_PAYMENT);
        } catch (ActivityNotFoundException ex) {
            Log.e("TokCompra", "Poynt Payment Activity not found - did you install PoyntServices?");
        } catch (RedePaymentValidationError redePaymentValidationError){
            Toast.makeText(getReactApplicationContext(), redePaymentValidationError.getMessage(), LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void openPaymentCinquenta() {
        long longAmount = 6750;
        try {
            Intent collectPaymentIntent = redePayments.intentForPaymentBuilder(
                            FlexTipoPagamento.CREDITO_A_VISTA, longAmount)
                    .build();
            activity.startActivityForResult(collectPaymentIntent, REQ_CODE_PAYMENT);
        } catch (ActivityNotFoundException ex) {
            Log.e("TokCompra", "Poynt Payment Activity not found - did you install PoyntServices?");
        } catch (RedePaymentValidationError redePaymentValidationError){
            Toast.makeText(getReactApplicationContext(), redePaymentValidationError.getMessage(), LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void onReprint() {
        try {
            Intent reprint = redePayments.intentForReprint();
            activity.startActivityForResult(reprint, REQ_CODE_REPRINT);
        } catch(ActivityNotFoundException ex) {
            Log.e("TokCompra", "Poynt Payment Activity not found - did you install PoyntServices?");
        } catch (RedePaymentValidationError redePaymentValidationError){
            Toast.makeText(getReactApplicationContext(), redePaymentValidationError.getMessage(), LENGTH_LONG).show();
        }
    }

    @ReactMethod
    private @NonNull String getPaymentStatus(@Nullable Intent intent) {
        String result = "Sem objeto Payment";
        if (intent != null) {
            Payment payment = RedePayments.getPaymentFromIntent(intent);
            if (payment != null) {
                PaymentStatus status = payment.getStatus();
                if (status != null) {
                    result = status.toString();
                } else {
                    result = "Sem status no Payment";
                }
            }
        }
        return result;
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {

        switch(requestCode){
            case REQ_CODE_PAYMENT:
                if(resultCode== Activity.RESULT_OK){
                    Payment payment = RedePayments.getPaymentFromIntent(data);
                    if (payment.getStatus() == PaymentStatus.AUTHORIZED) {
                        Receipt receipt = payment.getReceipt();

                        // String s = "Pagamento Authorizado\n";
                        // s += "Valor: $" + moneyFormat.format(payment.getAmount() / 100d);
                        // Toast.makeText(getReactApplicationContext(), s, LENGTH_LONG).show();

                        WritableMap params = Arguments.createMap();
                        params.putString("tid", receipt.getAUTO());
                        params.putString("nsu", receipt.getNSU());
                         reactContext
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("RedePaymentsResult", params);

                        Toast.makeText(getReactApplicationContext(), "Pagamento Realizado", LENGTH_SHORT).show();
                    } else {
                        String msg = "Resultado da transação:\n" + getPaymentStatus(data);
                        Toast.makeText(getReactApplicationContext(), msg, LENGTH_LONG).show();
                    }

                } else if (resultCode==Activity.RESULT_CANCELED) {

                    WritableMap params = Arguments.createMap();
                    params.putString("tid", "cancelado");
                    params.putString("nsu", "cancelado");
                     reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("RedePaymentsResult", params);

                    Toast.makeText(getReactApplicationContext(), "Pagamento Cancelado", LENGTH_SHORT).show();
                }
                break;

            case(REQ_CODE_REPRINT):
                if(resultCode==Activity.RESULT_OK) {
                    Toast.makeText(getReactApplicationContext(), "Reimpressão OK", LENGTH_LONG).show();
                } else {
                    Toast.makeText(getReactApplicationContext(), "Reimpressão cancelada", LENGTH_SHORT).show();
                }
                break;

            case(REQ_CODE_REVERSAL):
                if(resultCode==Activity.RESULT_OK) {
                    String s = "Estorno de pagamento\n" + getPaymentStatus(data);
                    Toast.makeText(getReactApplicationContext(), s, LENGTH_LONG).show();
                } else {
                    Toast.makeText(getReactApplicationContext(), "Estorno cancelado", LENGTH_SHORT).show();
                }
                break;
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
