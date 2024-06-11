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

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun openCSDocumentosCopy(sdkParams: ReadableMap, promise: Promise) {
    val clientId: String = if (sdkParams.hasKey("clientId") && sdkParams.getString("clientId") != null) sdkParams.getString("clientId")!! else throw Exception("clientId is required")
    val clientSecretId: String = if (sdkParams.hasKey("clientSecretId") && sdkParams.getString("clientSecretId") != null) sdkParams.getString("clientSecretId")!! else throw Exception("clientSecretId is required")
    val identifierId: String = if (sdkParams.hasKey("identifierId") && sdkParams.getString("identifierId") != null) sdkParams.getString("identifierId")!! else throw Exception("identifierId is required")
    val cpf: String = if (sdkParams.hasKey("cpf") && sdkParams.getString("cpf") != null) sdkParams.getString("cpf")!! else throw Exception("cpf is required")


    val primaryColor = sdkParams.getString("primaryColor")
    val secondaryColor = sdkParams.getString("secondaryColor")
    val tertiaryColor = sdkParams.getString("tertiaryColor")
    val titleColor = sdkParams.getString("titleColor")
    val paragraphColor = sdkParams.getString("paragraphColor")

    val sdkConfig = CSDocumentoscopySDKConfig(
      colors = CSDocumentoscopySDKColorsConfig(
        primaryColor = if (!primaryColor.isNullOrBlank()) Color.parseColor(primaryColor) else null,
        secondaryColor = if (!secondaryColor.isNullOrBlank()) Color.parseColor(secondaryColor) else null,
        tertiaryColor = if (!tertiaryColor.isNullOrBlank()) Color.parseColor(tertiaryColor) else null,
        titleColor = if (!titleColor.isNullOrBlank()) Color.parseColor(titleColor) else null,
        paragraphColor = if (!paragraphColor.isNullOrBlank()) Color.parseColor(paragraphColor) else null
      )
    )

    try {
      val csDocumentosCopyConfig = CSDocumentoscopy(clientId, clientSecretId, identifierId, cpf, sdkConfig)
      val listener = object: CSDocumentoscopySDKListener {
        override fun didFinishCapture(result: CSDocumentoscopySDKResult) {
          Log.d("[CSDocumentosCopy]", "Called didFinishCapture");

          val responseMap: WritableMap = WritableNativeMap()
          responseMap.putString("documentType", result.documentType?.toString())
          responseMap.putString("sessionId", result.sessionId)

          Log.d("[CSDocumentosCopy]", "Result is ${responseMap.toString()}")

          promise.resolve(responseMap)
        }

        override fun didOpen() {
          // Nothing to do here.
          Log.d("[CSDocumentosCopy]", "Called didOpen");
        }

        override fun didReceiveError(error: CSDocumentoscopySDKError) {
          Log.e("[CSDocumentosCopy]", "Called didReceiveError", null);

          promise.reject(error.errorCode.toString(), error.text, null)
        }

        override fun didTapClose() {
          Log.d("[CSDocumentosCopy]", "Called didTapClose");

          promise.reject("UserCancel", "UserCancel", null)
        }

      }

      if (reactApplicationContext.currentActivity?.application != null) {
        CSDocumentoscopySDK.initialize(reactApplicationContext.currentActivity!!.application, csDocumentosCopyConfig, listener)
      } else {
        throw Exception("Missing application from current activity")
      }
    } catch (t: Throwable) {
      Log.e("[CSDocumentosCopy]", "Error starting CSDocumentosCopySDK", t)
      promise.reject("SDKError", "Failed to start CSDocumentosCopySDK", t)
    }
  }

  companion object {
    const val NAME = "CsdocumentoscopyReactNative"
  }
}
