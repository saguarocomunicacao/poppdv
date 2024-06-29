package br.com.popingressospdv;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import br.com.uol.pagseguro.plugpagservice.wrapper.exception.PlugPagException;
import br.com.uol.pagseguro.plugpagservice.wrapper.*;

import android.util.Log;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import io.reactivex.ObservableEmitter;
import io.reactivex.Observable;

public class PaymentModules extends ReactContextBaseJavaModule {
	private final ReactApplicationContext reactContext;
	private final PlugPag plugPag;

	private int countPassword = 0;
	private Disposable subscribe;
	private DeviceEventManagerModule.RCTDeviceEventEmitter emitter = null;

	public PaymentModules(PlugPag _plugPag, ReactApplicationContext _reactContext) {
		super(_reactContext);
		this.reactContext = _reactContext;

		plugPag = _plugPag;
	}

	@Override
	public String getName() { return "PaymentModules"; }

	/*
	 *
	 * 	GETTERS E SETTERS DAS PROPRIEDADES DAS TRANSAÇÕES
	 *
	 */

	private class ActionResult {
		String transactionCode;
		String transactionId;
		String userReference;
		String holderName;
		String errorCode;
		String cardBrand;
		String message;
		String cardBin;
		String hostNsu;
		String amount;
		String holder;
		String bin;
		int eventCode;
		int result;

		public String getTransactionCode() { return transactionCode; }
		public void setTransactionCode(String transactionCode) { this.transactionCode = transactionCode; }

		public String getTransactionId() { return transactionId; }
		public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

		public String getUserReference() { return userReference; }
		public void setUserReference(String userReference) { this.userReference = userReference; }

		public String getHolderName() { return holderName; }
		public void setHolderName(String holderName) { this.holderName = holderName; }

		public String getErrorCode() { return errorCode; }
		public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

		public String getCardBrand() { return cardBrand; }
		public void setCardBrand(String cardBrand) { this.cardBrand = cardBrand; }

		public String getMessage() { return message; }
		public void setMessage(String message) { this.message = message; }

		public String getCardBin() { return cardBin; }
		public void setCardBin(String cardBin) { this.cardBin = cardBin; }

		public String getHostNsu() { return hostNsu; }
		public void setHostNsu(String hostNsu) { this.hostNsu = hostNsu; }

		public String getAmount() { return amount; }
		public void setAmount(String amount) { this.amount = amount; }

		public String getHolder() { return holder; }
		public void setHolder(String holder) { this.holder = holder; }

		public String getBin() { return bin; }
		public void setBin(String bin) { this.bin = bin; }

		public int getEventCode() { return eventCode; }
		public void setEventCode(int eventCode) { this.eventCode = eventCode; }

		public int getResult() { return result; }
		public void setResult(int result) { this.result = result; }
	}

	/*
	 *
	 * 	FUNÇÃO PARA INICIAR O PAGAMENTO
	 *
	 */

	protected void startPayment(ReadableMap data) {
		Log.d("DEBUG", "O pagamento PAGSEGURO começou 2.");
		PlugPagPaymentData paymentData = new PlugPagPaymentData(
		  data.getInt("tipo"),
		  data.getInt("valor"),
			data.getInt("pagamento"),
			data.getInt("parcelas"),
			data.getString("codvenda"),
			data.getBoolean("via_estabelecimento")
		);
		doAction(doPayment(paymentData));
	}

	/*
	 *
	 * 	FUNÇÃO PARA INICIAR O ESTORNO
	 *
	 */

	protected void startRefound(ReadableMap data) {
    PlugPagVoidData voidData = new PlugPagVoidData(
      data.getString("codigo"),
      data.getString("id"),
      true
    );
		doAction(doRefound(voidData));
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
	 * 	FUNÇÃO PARA CRIAR JSON DE RETORNO DO PAGAMENTO
	 *
	 */

	private String generateJSON(ActionResult result) {
		String json =
			"[{\"resultado\":\"" + result.getResult() + "\"," +
			"\"codigo\":\"" + result.getErrorCode() + "\"," +
			"\"mensagem\":\"" + result.getMessage() + "\"," +
			"\"id_transacao\":\"" + result.getTransactionId() + "\"," +
			"\"code_transacao\":\"" + result.getTransactionCode() + "\"," +
			"\"bandeira\":\"" + result.getCardBrand() + "\"," +
			"\"bin\":\"" + result.getBin() + "\"," +
			"\"user\":\"" + result.getUserReference() + "\"," +
			"\"holderName\":\"" + result.getHolderName() + "\"," +
			"\"holder\":\"" + result.getHolder() + "\"," +
			"\"hostNsu\":\"" + result.getHostNsu() + "\"," +
			"\"amount\":\"" + result.getAmount() + "\"}]";
		return json;
	}

	/*
	 *
	 * 	FUNÇÃO PARA RETORNAR O NÚMERO DE DÍGITOS INSERIDOS PELO USUÁRIO
	 *
	 */

	private String countPassword(int eventCode) {
		if (eventCode == PlugPagEventData.EVENT_CODE_DIGIT_PASSWORD) {
			countPassword++;
		} else {
			countPassword = 0;
		}
		return String.valueOf(countPassword);
	}

	/*
	 *
	 * 	LISTENER DOS EVENTOS DO PAGAMENTO
	 *
	 */

	private void setPaymentListener(ObservableEmitter<ActionResult> _emitter, ActionResult result) {
		plugPag.setEventListener(plugPagEventData -> {
			result.setEventCode(plugPagEventData.getEventCode());
			result.setMessage(plugPagEventData.getCustomMessage());
			_emitter.onNext(result);
		});
	}

	/*
	 *
	 * 	LISTENER DA IMPRESSORA DE COMPROVANTES
	 *
	 */

	private void setPrinterListener(ObservableEmitter<ActionResult> _emitter, ActionResult result) {
		plugPag.setPrinterListener(new PlugPagPrinterListener() {
			@Override
			public void onError(PlugPagPrintResult printResult) {
				result.setResult(printResult.getResult());
				result.setMessage(String.format("Error %s %s", printResult.getErrorCode(), printResult.getMessage()));
				result.setErrorCode(printResult.getErrorCode());
				_emitter.onNext(result);
			}
			@Override
			public void onSuccess(PlugPagPrintResult printResult) {
				result.setResult(printResult.getResult());
				result.setMessage("Impressão Concluída");
				result.setErrorCode(printResult.getErrorCode());
				_emitter.onNext(result);
			}
		});
	}

	/*
	 *
	 * 	FUNÇÃO DE RETORNO DO RESULTADO DO PAGAMENTO
	 *
	 */

	private void sendResponse(ObservableEmitter<ActionResult> _emitter, PlugPagTransactionResult plugPagTransactionResult, ActionResult result) {
		if (plugPagTransactionResult.getResult() == 0) {
			result.setTransactionCode(plugPagTransactionResult.getTransactionCode());
			result.setTransactionId(plugPagTransactionResult.getTransactionId());
			result.setUserReference(plugPagTransactionResult.getUserReference());
			result.setHolderName(plugPagTransactionResult.getHolderName());
			result.setErrorCode(plugPagTransactionResult.getErrorCode());
			result.setCardBrand(plugPagTransactionResult.getCardBrand());
			result.setHostNsu(plugPagTransactionResult.getHostNsu());
			result.setMessage(plugPagTransactionResult.getMessage());
			result.setHolder(plugPagTransactionResult.getHolder());
			result.setAmount(plugPagTransactionResult.getAmount());
			result.setBin(plugPagTransactionResult.getBin());
			_emitter.onNext(result);
		} else {
			_emitter.onError(new PlugPagException(plugPagTransactionResult.getMessage(), plugPagTransactionResult.getErrorCode()));
		}
		_emitter.onComplete();
	}

	/*
	 *
	 * 	FUNÇÃO OBSERVER DO PAGAMENTO
	 *
	 */

	private void doAction(Observable<ActionResult> action) {
		subscribe = action.subscribeOn(Schedulers.io())
			.observeOn(AndroidSchedulers.mainThread())
			.doOnNext(result -> {
				if (result.getTransactionId() != null) {
					String json = generateJSON(result);
					sendStatus("paymentEvents", json);
				}
			})
			.doOnComplete(() -> sendStatus("paymentEvents", "success"))
			.subscribe((ActionResult result) -> {
				if (result.getEventCode() == PlugPagEventData.EVENT_CODE_DIGIT_PASSWORD || result.getEventCode() == PlugPagEventData.EVENT_CODE_NO_PASSWORD) {
					sendStatus("paymentEvents", "senha: " + countPassword(result.getEventCode()));
				} else if (result.getErrorCode() != null) {
					sendStatus("paymentErrors", result.getMessage());
				} else {
					sendStatus("paymentEvents", result.getMessage());
				}
			}, throwable -> {
				sendStatus("paymentErrors", String.valueOf(throwable.getMessage()));
			});
	}

	/*
	 *
	 * 	FUNÇÃO PARA REALIZAR PAGAMENTOS
	 *
	 */

	private Observable<ActionResult> doPayment(final PlugPagPaymentData paymentData) {
		return Observable.create(_emitter -> {
			ActionResult result = new ActionResult();
			setPaymentListener(_emitter, result);
			setPrinterListener(_emitter, result);
			PlugPagTransactionResult plugPagTransactionResult = plugPag.doPayment(paymentData);
			sendResponse(_emitter, plugPagTransactionResult, result);
		});
	}

	/*
	 *
	 * 	FUNÇÃO PARA ESTORNAR PAGAMENTOS
	 *
	 */

	private Observable<ActionResult> doRefound(final PlugPagVoidData voidData) {
		return Observable.create(_emitter -> {
			ActionResult result = new ActionResult();
			setPaymentListener(_emitter, result);
			setPrinterListener(_emitter, result);
			PlugPagTransactionResult plugPagTransactionResult = plugPag.voidPayment(voidData);
			sendResponse(_emitter, plugPagTransactionResult, result);
		});
	}
}
