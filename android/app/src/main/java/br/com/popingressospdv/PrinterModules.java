package br.com.popingressospdv;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import br.com.uol.pagseguro.plugpagservice.wrapper.exception.PlugPagException;
import br.com.uol.pagseguro.plugpagservice.wrapper.*;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import io.reactivex.ObservableEmitter;
import io.reactivex.Observable;

public class PrinterModules extends ReactContextBaseJavaModule {
	private final ReactApplicationContext reactContext;
	private final PlugPag plugPag;

	private Disposable subscribe;
	private DeviceEventManagerModule.RCTDeviceEventEmitter emitter = null;

	public PrinterModules(PlugPag _plugPag, ReactApplicationContext _reactContext) {
		super(_reactContext);
		this.reactContext = _reactContext;

		plugPag = _plugPag;
	}

	@Override
	public String getName() { return "PrinterModules"; }

	private class ActionResult {
		String errorCode;
		String message;
		int result;

		public String getErrorCode() { return errorCode; }
		public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

		public String getMessage() { return message; }
		public void setMessage(String message) { this.message = message; }

		public int getResult() { return result; }
		public void setResult(int result) { this.result = result; }
	}

	/*
	 *
	 * 	FUNÇÃO PARA INICIAR A IMPRESSÃO
	 *
	 */

	protected void startPrint(PlugPagPrinterData image) {
		doAction(doPrint(image));
	}

	/*
	 *
	 * 	LISTENER DA IMPRESSORA
	 *
	 */

	private void setPrinterListener(ObservableEmitter<ActionResult> _emitter, ActionResult result) {
		plugPag.setPrinterListener(new PlugPagPrinterListener() {
			@Override
			public void onError(PlugPagPrintResult printResult) {
				_emitter.onError(new PlugPagException(String.format("Error %s %s", printResult.getErrorCode(), printResult.getMessage())));
			}
			@Override
			public void onSuccess(PlugPagPrintResult printResult) {
				_emitter.onError(new PlugPagException("Impressão Concluída")); // pq 'onError' se deu sucesso? pergunte pra PagSeguro
			}
		});
	}

	/*
	 *
	 * 	FUNÇÃO PARA RETORNAR O STATUS PARA A APLICAÇÃO
	 *
	 */

	private void sendStatus(String event, String message) {
		WritableMap params = Arguments.createMap();
		params.putString("message", message);
		if (emitter == null) {
			emitter = getReactApplicationContext().getJSModule((DeviceEventManagerModule.RCTDeviceEventEmitter.class));
		}
		if (emitter != null) {
			emitter.emit(event, params);
		}
	}

	/*
	 *
	 * 	FUNÇÃO OBSERVER DA IMPRESSÃO
	 *
	 */

	private void doAction(Observable<ActionResult> action) {
		subscribe = action.subscribeOn(Schedulers.io())
			.observeOn(AndroidSchedulers.mainThread())
			.doOnSubscribe(disposable -> sendStatus("printerEvents", "1"))
			.doOnComplete(() -> sendStatus("printerEvents", "1"))
			.subscribe(result -> {
				sendStatus("printerEvents", "1");
			}, throwable -> {
				sendStatus("printerEvents", throwable.getMessage());
			});
	}

	/*
	 *
	 * 	FUNÇÃO PARA REALIZAR IMPRESSÃO
	 *
	 */

	private Observable<ActionResult> doPrint(PlugPagPrinterData data) {
		return Observable.create(_emitter -> {
			ActionResult result = new ActionResult();
			setPrinterListener(_emitter, result);
			PlugPagPrintResult printResult = plugPag.printFromFile(data);
			if (result.getResult() != 0) {
				result.setResult(printResult.getResult());
			}
			_emitter.onComplete();
		});
	}
}
