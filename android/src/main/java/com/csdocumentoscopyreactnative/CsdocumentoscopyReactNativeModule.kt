package com.csdocumentoscopyreactnative

import android.graphics.Color
import android.util.Log
import com.clear.studio.csdocs.entries.CSDocumentoscopy
import com.clear.studio.csdocs.entries.CSDocumentoscopySDK
import com.clear.studio.csdocs.entries.CSDocumentoscopySDKColorsConfig
import com.clear.studio.csdocs.entries.CSDocumentoscopySDKConfig
import com.clear.studio.csdocs.entries.CSDocumentoscopySDKError
import com.clear.studio.csdocs.entries.CSDocumentoscopySDKListener
import com.clear.studio.csdocs.entries.CSDocumentoscopySDKResult
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap

class CsdocumentoscopyReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val logTag = "[CSDocumentosCopy]"
  private var promise: Promise? = null

  override fun getName(): String {
    return NAME
  }

  private fun reset() {
    this.promise = null;
  }

  @ReactMethod
  fun openCSDocumentosCopy(sdkParams: ReadableMap, promise: Promise) {
    if (this.promise !== null) {
      // Means that we have a SDK call pending, so nothing to do yet.

      return;
    }

    try {
      this.promise = promise;

      val clientId: String? = if (sdkParams.hasKey("clientId")) sdkParams.getString("clientId") else null
      val clientSecretId: String? = if (sdkParams.hasKey("clientSecretId")) sdkParams.getString("clientSecretId") else null
      val identifierId: String? = if (sdkParams.hasKey("identifierId")) sdkParams.getString("identifierId") else null
      val cpf: String? = if (sdkParams.hasKey("cpf")) sdkParams.getString("cpf") else null

      // Now validate
      if (clientId.isNullOrBlank()) throw Exception("clientId is required")
      if (clientSecretId.isNullOrBlank()) throw Exception("clientSecretId is required")
      if (identifierId.isNullOrBlank()) throw Exception("identifierId is required")
      if (cpf.isNullOrBlank()) throw Exception("cpf is required")


      val primaryColor: String? = if (sdkParams.hasKey("primaryColor")) sdkParams.getString("primaryColor") else null
      val secondaryColor: String? = if (sdkParams.hasKey("secondaryColor")) sdkParams.getString("secondaryColor") else null
      val tertiaryColor: String? = if (sdkParams.hasKey("tertiaryColor")) sdkParams.getString("tertiaryColor") else null
      val titleColor: String? = if (sdkParams.hasKey("titleColor")) sdkParams.getString("titleColor") else null
      val paragraphColor: String? = if (sdkParams.hasKey("paragraphColor")) sdkParams.getString("paragraphColor") else null

      val sdkConfig = CSDocumentoscopySDKConfig(
        colors = CSDocumentoscopySDKColorsConfig(
          primaryColor = if (!primaryColor.isNullOrBlank()) Color.parseColor(primaryColor) else null,
          secondaryColor = if (!secondaryColor.isNullOrBlank()) Color.parseColor(secondaryColor) else null,
          tertiaryColor = if (!tertiaryColor.isNullOrBlank()) Color.parseColor(tertiaryColor) else null,
          titleColor = if (!titleColor.isNullOrBlank()) Color.parseColor(titleColor) else null,
          paragraphColor = if (!paragraphColor.isNullOrBlank()) Color.parseColor(paragraphColor) else null
        )
      )

      val csDocumentosCopyConfig = CSDocumentoscopy(clientId, clientSecretId, identifierId, cpf, sdkConfig)
      val listener = object: CSDocumentoscopySDKListener {
        override fun didFinishCapture(result: CSDocumentoscopySDKResult) {
          Log.d(logTag, "Called didFinishCapture");

          val responseMap: WritableMap = WritableNativeMap()
          responseMap.putString("documentType", result.documentType?.toString())
          responseMap.putString("sessionId", result.sessionId)

          Log.d(logTag, "Result is $responseMap")

          this@CsdocumentoscopyReactNativeModule.promise!!.resolve(responseMap)
          this@CsdocumentoscopyReactNativeModule.reset()
        }

        override fun didOpen() {
          // Nothing to do here.
          Log.d(logTag, "Called didOpen");
        }

        override fun didReceiveError(error: CSDocumentoscopySDKError) {
          Log.e(logTag, "Called didReceiveError", null);

          this@CsdocumentoscopyReactNativeModule.promise!!.reject(error.errorCode.toString(), error.text, null)
          this@CsdocumentoscopyReactNativeModule.reset()
        }

        override fun didTapClose() {
          Log.d(logTag, "Called didTapClose");

          this@CsdocumentoscopyReactNativeModule.promise!!.reject("UserCancel", "UserCancel", null)
          this@CsdocumentoscopyReactNativeModule.reset()
        }

      }

      if (reactApplicationContext.currentActivity?.application != null) {
        CSDocumentoscopySDK.initialize(reactApplicationContext.currentActivity!!.application, csDocumentosCopyConfig, listener)
      } else {
        throw Exception("Missing application from current activity")
      }
    } catch (t: Throwable) {
      Log.e(logTag, "Error starting CSDocumentosCopySDK", t)

      promise.reject("InternalError", t.message ?: "InternalError", null)
      this.reset()
    }
  }

  companion object {
    const val NAME = "CsdocumentoscopyReactNative"
  }
}
