/*
 * BrowserUtility JavaScript library v1.0.0
 * (c) Dabrowski-Software-Development (https://github.com/dabrowski-software-development/BrowserUtility)
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
(function (window) {
    'use strict';
    var _currentBrowser = navigator.userAgent;
	var _currentBrowserIsCompatible = true;
	
    var _mobileBrowserRegex = /mobile/i;

    var _chromeRegex = /chrome/i;
    var _firefoxRegex = /firefox/i;
    var _operaRegex = /opera|opr/i;
    var _safariRegex = /safari/i;
    var _ucRegex = /ucbrowser/i;
    var _edgeRegex = /edge/i;
	var _winPhoneRegex = /windows phone/i;
    var _msieEq11Regex = /rv:11\.0/i;
    var _msieLt11Regex = /msie\s\d+\.\d+/i;


    var _isMobile = _mobileBrowserRegex.test(_currentBrowser);

    var _isChrome = _chromeRegex.test(_currentBrowser);
    var _isFirefox = _firefoxRegex.test(_currentBrowser);
    var _isOpera = _operaRegex.test(_currentBrowser);
    var _isSafari = _safariRegex.test(_currentBrowser);
    var _isbrowsuc = _ucRegex.test(_currentBrowser);
    var _isMicrosoftEdge = _edgeRegex.test(_currentBrowser);
	var _isWinPhone = _winPhoneRegex.test(_currentBrowser);
    var _isIE11 = _msieEq11Regex.test(_currentBrowser);
    var _isIELowThen11 = _msieLt11Regex.test(_currentBrowser);

    var _isIE = _isIE11 || _isIELowThen11;

    var _versionOfIE = _isIE ? _isIE11 ? _currentBrowser.match(_msieEq11Regex)[0] : _isIELowThen11 ? _currentBrowser.match(_msieLt11Regex)[0] : -1 : -1;
    if (_isIE) {
		try {
			if (_isIE11) {
				_versionOfIE = parseInt(_versionOfIE.substr(3).trim()); //IE 11
			}
			else {
				_versionOfIE = parseInt(_versionOfIE.substr(4).trim()); // < IE 11
			}
		}
		catch(error) {
			_currentBrowserIsCompatible = false;
		}
    }
    // of all _implementationDetails props only one is set to true, plus 'isMobile' is set to true if run under mobile browser
    var _implementationDetails = {
        notSupportedBrowserMessage: 'This library version does not support current browser yet',
        isMobile: _isMobile,
        chrome: _isChrome && _isSafari && !_isFirefox && !_isOpera && !_isMicrosoftEdge,
        firefox: _isFirefox && !_isChrome,
        opera: _isOpera && (_isChrome || _isOpera),
        safari: _isSafari && !_isChrome,
        uc: _isMobile && _isbrowsuc,
        microsoftEdge: _isMicrosoftEdge && (_isChrome || _isMicrosoftEdge),
        ie: _isIE && !_isChrome,
		currentBrowserIsCompatible: _currentBrowserIsCompatible,
		isWindowsPhone: _isWinPhone,

        removeUrlFragment: function() {
            setTimeout(removeUrlFragmentInternal, 1);
        },
        redirectToMobileVersion: function (mLetterPlusHyphenOrDot) {
            redirectToMobileVersionInternal(mLetterPlusHyphenOrDot);
        },
        createRedirectionToDesktopVersion: function () {
           return createRedirectionToDesktopVersionInternal();
        },
		detectCompatibilityWithCurrentInternetExplorerVersion: function(currentInternetExplorerVersion) {
			return detectIfCurrentInternetExplorerVersionCanHandleThisPageInternal(currentInternetExplorerVersion);
		},
		checkMinAllowedResolution: function(width, height, minRatio, excludeSomeResolutions, resolutionsArray) {
			var calculatedRatio = width / height;
			var ratio = Math.round(calculatedRatio * 100) / 100;
			
			if(ratio >= minRatio) {
				if(excludeSomeResolutions) {
					for(var i = 0; i < resolutionsArray.length; i += 2) {
					  if(width == resolutionsArray[i] && height == resolutionsArray[i+1])
						  return false;
					}
				}
				return true;		
			}
			return false;
		}
    };
	
    if (_isIE) {
        _implementationDetails.ieVersion = _versionOfIE;
    }
	
    function removeUrlFragmentInternal() {
        window.history.pushState("#", "", window.location.href.substring(0, window.location.href.length - window.location.hash.length));
    }

    function redirectToMobileVersionInternal(mLetterPlusHyphenOrDot) {
        var mobileIndex = -1;

        mobileIndex = location.protocol.length;
        mobileIndex += 2;

        var mobileUrl = location.href.substring(0, mobileIndex) + mLetterPlusHyphenOrDot + location.href.substring(mobileIndex);
        location.href = mobileUrl;
    }

    function createRedirectionToDesktopVersionInternal() {
        var mobileIndex = -1;

        mobileIndex = location.protocol.length;
        mobileIndex += 2;

        var mobileUrl = location.href.substring(0, mobileIndex) + location.href.substring(mobileIndex + 2);
        return mobileUrl;
    }

	function detectIfCurrentInternetExplorerVersionCanHandleThisPageInternal(currentInternetExplorerVersion) {
		try {
			if (!_implementationDetails.currentBrowserIsCompatible || _implementationDetails.ie && _implementationDetails.ieVersion < currentInternetExplorerVersion)
				return false;
			return true;
		}
		catch(error) {
			return false;
		}
    }	
	
    //public api
    window.activeBrowser = window.activeBrowser || {};

    window.activeBrowser.browserUtility = window.activeBrowser.browserUtility || _implementationDetails;
})(window);
