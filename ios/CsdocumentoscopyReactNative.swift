import CSDocumentoscopySDK

extension UIColor {
    convenience init(_ hex: String, alpha: CGFloat = 1.0) {
        var cString = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        
        if cString.hasPrefix("#") { cString.removeFirst() }
        
        if cString.count != 6 {
            self.init("ff0000") // return red color for wrong hex input
            return
        }
        
        var rgbValue: UInt64 = 0
        Scanner(string: cString).scanHexInt64(&rgbValue)
        
        self.init(red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
                  green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
                  blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
                  alpha: alpha)
    }
}

@objc(CsdocumentoscopyReactNative)
class CsdocumentoscopyReactNative: NSObject {
    
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?
    private let LOG_TAG: String = "[CSDocumentosCopyRN]"
    
    private func resetPromise() -> Void {
        self.resolve = nil
        self.reject = nil
    }
    
    @objc(openCSDocumentosCopy:withResolver:withRejecter:)
    func openCSDocumentosCopy(sdkParams: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let resolver = self.resolve, let reject = self.reject {
            // Means that we are already running and somehow the button got triggered again.
            // In this case just return.
            
            return
        }
        
        if let clientId = sdkParams["clientId"] as? String, let clientSecretId = sdkParams["clientSecretId"] as? String, let identifierId = sdkParams["identifierId"] as? String, let cpf = sdkParams["cpf"] as? String {
            
            self.resolve = resolve
            self.reject = reject
            
            let primaryColor = sdkParams["primaryColor"] != nil ? UIColor(sdkParams["primaryColor"] as! String) : nil;
            let secondaryColor = sdkParams["secondaryColor"] != nil ? UIColor(sdkParams["secondaryColor"] as! String) : nil;
            let tertiaryColor = sdkParams["tertiaryColor"] != nil ? UIColor(sdkParams["tertiaryColor"] as! String) : nil;
            let titleColor = sdkParams["titleColor"] != nil ? UIColor(sdkParams["titleColor"] as! String) : nil;
            let paragraphColor = sdkParams["paragraphColor"] != nil ? UIColor(sdkParams["paragraphColor"] as! String) : nil;
            
            DispatchQueue.main.async {
                let sdk = CSDocumentoscopy(configuration: CSDocumentoscopyConfig(colors: CSDocumentoscopyColorsConfig(
                    primaryColor: primaryColor, secondaryColor: secondaryColor, tertiaryColor: tertiaryColor, titleColor: titleColor, paragraphColor: paragraphColor)));
                
                if let viewController = UIApplication.shared.keyWindow?.rootViewController {
                    sdk.delegate = self
                    sdk.initialize(clientId: clientId, clientSecret: clientSecretId, identifierId: identifierId, cpf: cpf, viewController: viewController)
                } else {
                    reject("ViewControllerMissing", "Unable to find view controller", nil)
                    self.resetPromise()
                }
            }
        } else {
            reject("MissingParameters", "Missing clientId, clientSecretId, identifierId or CPF or all of them", nil)
        }
    }
}

extension CsdocumentoscopyReactNative: CSDocumentoscopyDelegate {
    func didOpen() {
        NSLog("\(LOG_TAG) - called didOpen")
    }
    
    func didTapClose() {
        NSLog("\(LOG_TAG) - called didTapClose")
        
        if let promiseReject = self.reject {
            promiseReject("UserCancel", "UserCancel", nil)
        }
        
        self.resetPromise()
    }
    
    func didFinishCapture(result: CSDocumentoscopyResult) {
        NSLog("\(LOG_TAG) - called didFinishCapture")
        
        let responseMap = NSMutableDictionary();
        responseMap.setValue(result.documentType.rawValue, forKey: "documentType")
        responseMap.setValue(result.sessionId, forKey: "sessionId")
        
        if let promiseResolve = self.resolve {
            promiseResolve(responseMap)
        } else if let promiseReject = self.reject {
            promiseReject("InternalError", "Missing promise rejector", nil)
        }
        
        self.resetPromise()
    }
    
    func didReceiveError(error: CSDocumentoscopyError) {
        NSLog("\(LOG_TAG) - called didReceiveError")
        
        if let promiseReject = self.reject {
            promiseReject(String(error.errorCode), String(error.text), error)
        }
        
        self.resetPromise()
    }
}
