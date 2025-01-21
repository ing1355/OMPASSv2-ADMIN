
window.onload = async function () {
    var appStoreUrl = 'market\x3A\x2F\x2Fdetails\x3Fid\x3Dcom\x2Ecoupang\x2Emobile\x26url\x3Dcoupang\x3A\x2F\x2Fmlp\x3FflowId\x253D7\x2526enableFlowEngine\x253DY\x2526fallback\x253Dcoupang\x25253A\x25252F\x25252Fhome\x2526splitKey\x253DloginRedirection\x2526trafficType\x253Dmarketing\x2526rUrl\x253Dcoupang\x25253A\x25252F\x25252Fmlsdp\x25253FproductId\x25253D8244066846\x252526itemId\x25253D9897088145\x252526vendorItemId\x25253D5344581727\x252526enableFlowEngine\x25253DY\x252526flowId\x25253D2\x252526splitTrafficSource\x25253DNaverShopping\x252526trafficSplitKey\x25253Dmlsdp\x5Fmkt\x252526trafficType\x25253Dmarketing\x252526fallback\x25253Dcoupang\x2525253A\x2525252F\x2525252Fhome\x252526src\x25253D1043501\x252526spec\x25253D10304968\x252526addtag\x25253D460\x252526ctag\x25253D8244066846\x252526lptag\x25253DI9897088145\x252526itime\x25253D20241218084551\x252526pageType\x25253DMLSDP\x252526pageValue\x25253D8244066846\x252526wPcid\x25253D17182557422303541096489\x252526wRef\x25253Dm\x2Esearch\x2Enaver\x2Ecom\x252526wTime\x25253D20241218084551\x252526redirect\x25253Dlanding\x252526mcid\x25253D66788aacaa8d4619adf7a235aca064f3\x252526n\x5Fad\x5Fgroup\x25253Dgrp\x2Da001\x2D02\x2D000000039424883\x252526n\x5Fad\x25253Dnad\x2Da001\x2D02\x2D000000326613373\x252526n\x5Frank\x25253D1\x252526n\x5Fmedia\x25253D8753\x252526n\x5Fquery\x25253D\x252525EC\x252525BF\x252525A0\x252525ED\x2525258C\x252525A1\x252525ED\x25252596\x25252587\x252525EB\x252525B0\x25252598\x2526src\x253D1043501\x2526spec\x253D10304968\x2526addtag\x253D460\x2526ctag\x253D8244066846\x2526lptag\x253DI9897088145\x2526itime\x253D20241218084551\x2526pageType\x253DMLSDP\x2526pageValue\x253D8244066846\x2526wPcid\x253D17182557422303541096489\x2526wRef\x253Dm\x2Esearch\x2Enaver\x2Ecom\x2526wTime\x253D20241218084551\x2526redirect\x253Dlanding\x2526mcid\x253D66788aacaa8d4619adf7a235aca064f3\x2526n\x5Fad\x5Fgroup\x253Dgrp\x2Da001\x2D02\x2D000000039424883\x2526n\x5Fad\x253Dnad\x2Da001\x2D02\x2D000000326613373\x2526n\x5Frank\x253D1\x2526n\x5Fmedia\x253D8753\x2526n\x5Fquery\x253D\x2525EC\x2525BF\x2525A0\x2525ED\x25258C\x2525A1\x2525ED\x252596\x252587\x2525EB\x2525B0\x252598\x26referrer\x3Dcontent\x5Ftype\x253Dmlsdp\x2526content\x5Fid\x253D8244066846\x2526src\x253D1043501\x2526spec\x253D10304968\x2526addtag\x253D460\x2526ctag\x253D8244066846\x2526lptag\x253DI9897088145\x2526itime\x253D20241218084551\x2526pageType\x253DMLSDP\x2526pageValue\x253D8244066846\x2526wPcid\x253D17182557422303541096489\x2526wRef\x253Dm\x2Esearch\x2Enaver\x2Ecom\x2526wTime\x253D20241218084551\x2526redirect\x253Dlanding\x2526mcid\x253D66788aacaa8d4619adf7a235aca064f3\x2526n\x5Fad\x5Fgroup\x253Dgrp\x2Da001\x2D02\x2D000000039424883\x2526n\x5Fad\x253Dnad\x2Da001\x2D02\x2D000000326613373\x2526n\x5Frank\x253D1\x2526n\x5Fmedia\x253D8753\x2526n\x5Fquery\x253D\x2525EC\x2525BF\x2525A0\x2525ED\x25258C\x2525A1\x2525ED\x252596\x252587\x2525EB\x2525B0\x252598';
    var appScheme = 'coupang\x3A\x2F\x2Fmlp\x3FflowId\x3D7\x26enableFlowEngine\x3DY\x26fallback\x3Dcoupang\x253A\x252F\x252Fhome\x26splitKey\x3DloginRedirection\x26trafficType\x3Dmarketing\x26rUrl\x3Dcoupang\x253A\x252F\x252Fmlsdp\x253FproductId\x253D8244066846\x2526itemId\x253D9897088145\x2526vendorItemId\x253D5344581727\x2526enableFlowEngine\x253DY\x2526flowId\x253D2\x2526splitTrafficSource\x253DNaverShopping\x2526trafficSplitKey\x253Dmlsdp\x5Fmkt\x2526trafficType\x253Dmarketing\x2526fallback\x253Dcoupang\x25253A\x25252F\x25252Fhome\x2526src\x253D1043501\x2526spec\x253D10304968\x2526addtag\x253D460\x2526ctag\x253D8244066846\x2526lptag\x253DI9897088145\x2526itime\x253D20241218084551\x2526pageType\x253DMLSDP\x2526pageValue\x253D8244066846\x2526wPcid\x253D17182557422303541096489\x2526wRef\x253Dm\x2Esearch\x2Enaver\x2Ecom\x2526wTime\x253D20241218084551\x2526redirect\x253Dlanding\x2526mcid\x253D66788aacaa8d4619adf7a235aca064f3\x2526n\x5Fad\x5Fgroup\x253Dgrp\x2Da001\x2D02\x2D000000039424883\x2526n\x5Fad\x253Dnad\x2Da001\x2D02\x2D000000326613373\x2526n\x5Frank\x253D1\x2526n\x5Fmedia\x253D8753\x2526n\x5Fquery\x253D\x2525EC\x2525BF\x2525A0\x2525ED\x25258C\x2525A1\x2525ED\x252596\x252587\x2525EB\x2525B0\x252598\x26src\x3D1043501\x26spec\x3D10304968\x26addtag\x3D460\x26ctag\x3D8244066846\x26lptag\x3DI9897088145\x26itime\x3D20241218084551\x26pageType\x3DMLSDP\x26pageValue\x3D8244066846\x26wPcid\x3D17182557422303541096489\x26wRef\x3Dm\x2Esearch\x2Enaver\x2Ecom\x26wTime\x3D20241218084551\x26redirect\x3Dlanding\x26mcid\x3D66788aacaa8d4619adf7a235aca064f3\x26n\x5Fad\x5Fgroup\x3Dgrp\x2Da001\x2D02\x2D000000039424883\x26n\x5Fad\x3Dnad\x2Da001\x2D02\x2D000000326613373\x26n\x5Frank\x3D1\x26n\x5Fmedia\x3D8753\x26n\x5Fquery\x3D\x25EC\x25BF\x25A0\x25ED\x258C\x25A1\x25ED\x2596\x2587\x25EB\x25B0\x2598';
    var landingType = 'TRACKING_LANDING';
    var mcid = '66788aacaa8d4619adf7a235aca064f3';
    var isAppInstall = await installedCoupangApp();
    var redirectWebUrl = 'https\x3A\x2F\x2Fm\x2Ecoupang\x2Ecom\x2Fvm\x2Fmlp\x2Fmweb\x2Fmlp\x2Dlanding\x3FflowId\x3D2\x26productId\x3D8244066846\x26itemId\x3D9897088145\x26vendorItemId\x3D5344581727\x26src\x3D1043501\x26spec\x3D10304968\x26addtag\x3D460\x26ctag\x3D8244066846\x26lptag\x3DI9897088145\x26itime\x3D20241218084551\x26pageType\x3DMLSDP\x26pageValue\x3D8244066846\x26wPcid\x3D17182557422303541096489\x26wRef\x3Dm\x2Esearch\x2Enaver\x2Ecom\x26wTime\x3D20241218084551\x26redirect\x3Dlanding\x26mcid\x3D66788aacaa8d4619adf7a235aca064f3\x26n\x5Fad\x5Fgroup\x3Dgrp\x2Da001\x2D02\x2D000000039424883\x26n\x5Fad\x3Dnad\x2Da001\x2D02\x2D000000326613373\x26n\x5Frank\x3D1\x26n\x5Fmedia\x3D8753\x26n\x5Fquery\x3D\x25EC\x25BF\x25A0\x25ED\x258C\x25A1\x25ED\x2596\x2587\x25EB\x25B0\x2598';

    weblogPublish('landing_bridge_page_view', 'landing_bridge_page', 'android_app_or_web', landingType, mcid, isAppInstall);
    function goAppWithFailedCallback(isAuto, redirectFailedCallback) {
        if (typeof redirectFailedCallback !== 'function') {
            redirectFailedCallback = function () {};
        }
        var redirectType = isAuto ? 'auto' : 'manual';
        var startTime = new Date().getTime();
        let timeout = null;
        function cancelTimeoutForFailedWeblog() {
            if (timeout) clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(function () {
            window.removeEventListener('blur', cancelTimeoutForFailedWeblog);
            const currTime = new Date().getTime();
            if (currTime - startTime < 1000) {
                newLandingPageRedirectAppFailedWeblogPublish(redirectType);
                redirectFailedCallback();
            }
        }, 500);
        window.addEventListener('blur', cancelTimeoutForFailedWeblog, {once: true});
        setTimeout(function () {
            weblogPublish('target_page_launch', 'android_app', appScheme, landingType, mcid, isAppInstall);
            newLandingPageRedirectAppWeblogPublish(redirectType);
            location.href = appScheme;
        }, 32); 
    }
    function goAppStore(startTime) {
        weblogPublish('target_page_launch', 'android_appStore', appStoreUrl, landingType, mcid, isAppInstall);
        location.href = appStoreUrl;
    }
    // When landing, try to redirect to APP, if failed, then redirect to web
    goAppWithFailedCallback(true, function() {
        weblogPublish('target_page_launch', 'android_mweb', redirectWebUrl, landingType, mcid, isAppInstall);
        location.href = redirectWebUrl;
    });

    document.getElementById('goWeb').addEventListener('click', function handleGoWebClick() {
        newLandingPageClickWeblogPublish('view_on_mobile_web');
        location.href = redirectWebUrl;
    })
    document.getElementById('goApp').addEventListener('click', function handleGoAppClick() {
        newLandingPageClickWeblogPublish('continue_on_app');
        goAppWithFailedCallback(false, function(){
            goAppStore();
        });
    })
};

https://adcr.naver.com/adcr?x=8wK+PwJUXGBp583Gnr9Ca////w==kRQn6nCZcyqhnlowt46XCCdsPIDJLG3vlISuc6+Y5LkvAzE0mgE5MvFzI1beosj9Up9f1BEBSBDGwSRZOgVb3WY/UnIOmEeNR9bMCQANFhhkFAJw0yiBzZVRqPQ4N912enuMiad4blF8qI9zXHW9jZ5MpNOkU1ovu2FI3XGPTS3k2HdKtNOYejkqlNpvBzyAa3jLbtaie9I1bjV8i1wZ/wYGVUqgI62CwcXcELQ1wGim9bcTjUZX72nUrlQdjal7i0xXj0qc7qT6y0U/5n92W4ZmhOkteoEZeJEsd0E9FxdGYGrgHx4St7WocSPJ36MwEzHc5GAHD6Apm5k4lhspYt2JvccsS77jZznE7Lv0Or8WUgMoCc1QGfrG04UK+ghQ6PviFcdQfTd1aAwl9mb9dqvloo9QZMm7CjA9QU+cKA5pbpCFrWRVn4CFH78HTNbBVOXoN1DVB/vdY8ZCpqfFw3BQalmb2ME2+Xu1gUogdbUM9sMI/Fh14D9NekMSWMB0BbCZLKxDJ4koDl9v3ZF4jWRBvRoUaZBpTzJBW96BQLfct2I0/FnYmBwT2wbiJ+yngGrdgoAbWgtjDVnMes4LVJGN41BWcAoPtnahzM2DZbPTMK0XMiTxu5isVFLrvlKrEPPLucEpprcjntVRZBCF35/NrgiJi3rVdXexK7TWM54LUprKC8N66Jg8HNEeC3RvEA5W0Q4DRY97qBft0PwfkJEOoBzC1ayxyulNNlBN2VfzSHyBZv7moOcvOnzYU1FyhgSeLX07kEFB9qCC/uEe+Gr6zaD3sAYqi+IZYmsu5/xkbdjZ238QHopxAqFxmYZSKEHWP3I4OtAdy/58xA5/+Y5mSGgGLl6TpixBlFccoaTOGs0lyky41o27Xe5u5UViR1CJsLBBPhrbk/KIz+3sCiQSMQzRXaMNli/4SsVfNgklFvOS7JXF3Nf6JvKovUbmcXmMR/WwbJuAGP2+zjPT4SMBJAc6sv04cPj4mtK0yxx6V70/5tCj2RoZOrAQDZehh2MbtYZdyhnxnEjwYGRoTkndbNG2KdnBk93KODSBATA/6yucofnNH8xaBEd5N8l0REK8HNiiBMYfNKSAD/u0GogB6crjpHDI0togK0b2i686U9Te14LzXjb6wzbk20PUd