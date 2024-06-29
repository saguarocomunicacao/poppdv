package br.com.popingressospdv;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import br.com.positivo.printermodule.PrintAttributes;
import br.com.positivo.printermodule.Printer;
import br.com.positivo.printermodule.PrinterCallback;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

public class PrinterHelper {
    private Printer mPrinter;
    private Context mContext;

    public static final String TAG = "PrinterSample";

    public PrinterHelper(Context context) {
        mContext = context;
        mPrinter = new Printer(mContext);
    }

    public void onPositivoReceiptClicked() {
			final Map<String,Integer> map_positivo = new HashMap<String,Integer>();
			map_positivo.put(PrintAttributes.KEY_ALIGN, 0);
			map_positivo.put(PrintAttributes.KEY_TYPEFACE, 1);
			map_positivo.put(PrintAttributes.KEY_TEXTSIZE, 17);

			final String[] textArray   = {"                 Visa                 "};
			final String[] textArray2  = {"         CREDITO A VISTA - I          "};
			final String[] textArray3  = {"             424242-4242              "};
			final String[] textArray4  = {" VIA - ESTABELECIMENTO / POS=69000163 "};
			final String[] textArray5  = {"CNPJ: 00.000.000/0000-00              "};
			final String[] textArray6  = {"MENSAGEM TBL F0                       "};
			final String[] textArray7  = {"LOJA CRED SEM FIN                     "};
			final String[] textArray8  = {"ENDERECO1 ENDERECO2 ENDERECO3         \n-ENDERECO4                            "};
			final String[] textArray9  = {"CIDADE1 CIDADE2 CIDADE3 CIDADE4 CI    \n - SP                                 "};
			final String[] textArray10 = {"0000000000000004  DOC=419019  AUT=095121"};
			final String[] textArray11 = {"19/11/19", "09:51", "ONL-X"};
			final String[] textArray12 = {"VENDA A CREDITO                       "};
			final String[] textArray13 = {"VALOR:", "30,00"};
			final String[] textArray14 = {"MENSAGEM TBL D0                       "};

			final Map<String,Integer> maptext1 = new HashMap<String,Integer>();
			maptext1.put(PrintAttributes.KEY_TEXTSIZE, 17);
			maptext1.put(PrintAttributes.KEY_ALIGN, 0);
			maptext1.put(PrintAttributes.KEY_TYPEFACE, 0);

			final Map<String,Integer> maptext2 = new HashMap<String,Integer>();
			maptext2.put(PrintAttributes.KEY_TEXTSIZE, 17);
			maptext2.put(PrintAttributes.KEY_ALIGN, 1);
			maptext2.put(PrintAttributes.KEY_TYPEFACE, 0);
			maptext2.put(PrintAttributes.KEY_MARGINLEFT, 4);

			final Map<String,Integer> maptext3 = new HashMap<String,Integer>();
			maptext3.put(PrintAttributes.KEY_TEXTSIZE, 17);
			maptext3.put(PrintAttributes.KEY_ALIGN, 1);
			maptext3.put(PrintAttributes.KEY_TYPEFACE, 1);
			maptext3.put(PrintAttributes.KEY_MARGINLEFT, 4);

			final Map<String,Integer> maptext4 = new HashMap<String,Integer>();
			maptext4.put(PrintAttributes.KEY_TEXTSIZE, 17);
			maptext4.put(PrintAttributes.KEY_ALIGN, 1);
			maptext4.put(PrintAttributes.KEY_TYPEFACE, 1);
			maptext4.put(PrintAttributes.KEY_MARGINLEFT, 4);
			maptext4.put(PrintAttributes.KEY_WEIGHT, 3);

			final Map<String,Integer> maptext5 = new HashMap<String,Integer>();
			maptext5.put(PrintAttributes.KEY_TEXTSIZE, 17);
			maptext5.put(PrintAttributes.KEY_ALIGN, 1);
			maptext5.put(PrintAttributes.KEY_TYPEFACE, 1);
			maptext5.put(PrintAttributes.KEY_MARGINLEFT, 4);
			maptext5.put(PrintAttributes.KEY_WEIGHT, 2);

			final Map<String,Integer> maptext6 = new HashMap<String,Integer>();
			maptext6.put(PrintAttributes.KEY_TEXTSIZE, 17);
			maptext6.put(PrintAttributes.KEY_ALIGN, 2);
			maptext6.put(PrintAttributes.KEY_TYPEFACE, 1);
			maptext6.put(PrintAttributes.KEY_MARGINLEFT, 4);
			maptext6.put(PrintAttributes.KEY_WEIGHT, 1);

			final List attrCols1 = new ArrayList();
			attrCols1.add(maptext1);

			final List attrCols2 = new ArrayList();
			attrCols2.add(maptext2);

			final List attrCols3 = new ArrayList();
			attrCols3.add(maptext3);

			final List attrCols4 = new ArrayList();
			attrCols4.add(maptext4);
			attrCols4.add(maptext5);
			attrCols4.add(maptext6);

			final List attrCols5 = new ArrayList();
			attrCols5.add(maptext5);
			attrCols5.add(maptext6);

			Executors.newSingleThreadExecutor().execute(new Runnable() {
					@Override
					public void run() {
							// TODO Auto-generated method stub
							try {
									if (!mPrinter.isReady()) {
											waitForPrinter();
									}

									mPrinter.printColumnsTextWithAttributes(textArray, attrCols1, mCallback);
									mPrinter.printColumnsTextWithAttributes(textArray2, attrCols1, mCallback);
									mPrinter.printColumnsTextWithAttributes(textArray3, attrCols1, mCallback);
									mPrinter.printColumnsTextWithAttributes(textArray4, attrCols1, mCallback);

									mPrinter.printColumnsTextWithAttributes(textArray5, attrCols2, mCallback);
									mPrinter.printColumnsTextWithAttributes(textArray6, attrCols2, mCallback);

									mPrinter.printColumnsTextWithAttributes(textArray7, attrCols3, mCallback);

									mPrinter.printColumnsTextWithAttributes(textArray8, attrCols2, mCallback);
									mPrinter.printColumnsTextWithAttributes(textArray9, attrCols2, mCallback);
									mPrinter.printColumnsTextWithAttributes(textArray10, attrCols2, mCallback);

									mPrinter.printColumnsTextWithAttributes(textArray11, attrCols4, mCallback);

									mPrinter.printColumnsTextWithAttributes(textArray12, attrCols2, mCallback);
									mPrinter.printColumnsTextWithAttributes(textArray13, attrCols5, mCallback);
									mPrinter.printColumnsTextWithAttributes(textArray14, attrCols2, mCallback);
									mPrinter.printStepWrapPaper(180, mCallback);
							} catch (Exception e) {
									// TODO Auto-generated catch block
									Log.d(TAG, e.getMessage());
							}
					}

					private void waitForPrinter() {
							synchronized (this) {
									try {
											Log.d(TAG, "Print: waitForPrinter");
											wait(1000);
									} catch (InterruptedException e) {
											Log.d(TAG, "Print: Error waiting for initialization", e);
											e.printStackTrace();
									}
							}
					}
			});
    }

    public void imprimeTextoModule(String texto) {

        final String[] textArray = new String[]{ texto };

        final Map<String, Integer> maptext1 = new HashMap<String, Integer>();
        maptext1.put(PrintAttributes.KEY_TEXTSIZE, 17);
        maptext1.put(PrintAttributes.KEY_ALIGN, 0);
        maptext1.put(PrintAttributes.KEY_TYPEFACE, 0);

        final List<Map<String, Integer>> attrCols1 = new ArrayList<>();
        attrCols1.add(maptext1);

        Executors.newSingleThreadExecutor().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    if (!mPrinter.isReady()) {
                        waitForPrinter();
                    }

                    mPrinter.printColumnsTextWithAttributes(textArray, attrCols1, mCallback);
                } catch (Exception e) {
                    Log.d(TAG, e.getMessage());
                }
            }

            private void waitForPrinter() {
                synchronized (this) {
                    try {
                        Log.d(TAG, "Print: waitForPrinter");
                        wait(1000);
                    } catch (InterruptedException e) {
                        Log.d(TAG, "Print: Error waiting for initialization", e);
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    public void printBarCode(String texto) {

        final String[] textArray = new String[]{ texto };

        final Map<String, Integer> maptext1 = new HashMap<String, Integer>();
        maptext1.put(PrintAttributes.KEY_TEXTSIZE, 17);
        maptext1.put(PrintAttributes.KEY_ALIGN, 0);
        maptext1.put(PrintAttributes.KEY_TYPEFACE, 0);

        final List<Map<String, Integer>> attrCols1 = new ArrayList<>();
        attrCols1.add(maptext1);

        Executors.newSingleThreadExecutor().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    if (!mPrinter.isReady()) {
                        waitForPrinter();
                    }

                    mPrinter.printBarCode(textArray[0], 0, 300, 100, true, mCallback);
                } catch (Exception e) {
                    Log.d(TAG, e.getMessage());
                }
            }

            private void waitForPrinter() {
                synchronized (this) {
                    try {
                        Log.d(TAG, "Print: waitForPrinter");
                        wait(1000);
                    } catch (InterruptedException e) {
                        Log.d(TAG, "Print: Error waiting for initialization", e);
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    public void printQRCode(String texto) {

        final String[] textArray = new String[]{ texto };

        final Map<String, Integer> maptext1 = new HashMap<String, Integer>();
        maptext1.put(PrintAttributes.KEY_TEXTSIZE, 17);
        maptext1.put(PrintAttributes.KEY_ALIGN, 0);
        maptext1.put(PrintAttributes.KEY_TYPEFACE, 0);

        final List<Map<String, Integer>> attrCols1 = new ArrayList<>();
        attrCols1.add(maptext1);

        Executors.newSingleThreadExecutor().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    if (!mPrinter.isReady()) {
                        waitForPrinter();
                    }

                    mPrinter.printQRCode(textArray[0], 0, 400, mCallback);
                } catch (Exception e) {
                    Log.d(TAG, e.getMessage());
                }
            }

            private void waitForPrinter() {
                synchronized (this) {
                    try {
                        Log.d(TAG, "Print: waitForPrinter");
                        wait(1000);
                    } catch (InterruptedException e) {
                        Log.d(TAG, "Print: Error waiting for initialization", e);
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    public void avancaLinhaModule(int linha) {

			// final String[] textArray   = "";

			final Map<String,Integer> maptext1 = new HashMap<String,Integer>();
			maptext1.put(PrintAttributes.KEY_TEXTSIZE, 17);
			maptext1.put(PrintAttributes.KEY_ALIGN, 0);
			maptext1.put(PrintAttributes.KEY_TYPEFACE, 0);

			final List attrCols1 = new ArrayList();
			attrCols1.add(maptext1);

			Executors.newSingleThreadExecutor().execute(new Runnable() {
					@Override
					public void run() {
							// TODO Auto-generated method stub
							try {
									if (!mPrinter.isReady()) {
											waitForPrinter();
									}

									mPrinter.printStepWrapPaper(linha, mCallback);
							} catch (Exception e) {
									// TODO Auto-generated catch block
									Log.d(TAG, e.getMessage());
							}
					}

					private void waitForPrinter() {
							synchronized (this) {
									try {
											Log.d(TAG, "Print: waitForPrinter");
											wait(1000);
									} catch (InterruptedException e) {
											Log.d(TAG, "Print: Error waiting for initialization", e);
											e.printStackTrace();
									}
							}
					}
			});
    }

    private PrinterCallback mCallback = new PrinterCallback() {
        @Override
        public void onError(int i, String s) {
            // Adicione qualquer tratamento de erro que você desejar aqui.
        }

        @Override
        public void onRealLength(double v, double v1) {
            // Trate essa chamada conforme necessário.
        }

        @Override
        public void onComplete() {
            // Este é chamado quando a impressão está completa. Você pode enviar um callback ou emitir um evento para o React Native se desejar.
        }
    };

}
