<!doctype html>
<%@ Page language="C#" %>
<%@ Register Tagprefix="SharePoint"
     Namespace="Microsoft.SharePoint.WebControls"
     Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<html lang="en">
<head>
<meta name="WebPartPageExpansion" content="full" />
<SharePoint:ScriptLink Name="MicrosoftAjax.js" runat="server" Defer="False" Localizable="false" __designer:Preview="&lt;script src=&quot;/_layouts/15/microsoftajax.js?rev=Civ3pT%2FplWDqWJ69HuRuNQ%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;/_layouts/15/init.js?rev=Xpo7ARBt8xBROO1h5n3s6g%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;/_layouts/15/1033/initstrings.js?rev=S11vfGURQYVuACMEY0tLTg%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;/_layouts/15/1033/strings.js?rev=xXYZY4hciX287lShPZuClw%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;/_layouts/15/sp.init.js?rev=jvJC3Kl5gbORaLtf7kxULQ%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;/_layouts/15/core.js?rev=Wo0FMr64dm7WzOZ6Cinm1Q%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;/_layouts/15/sp.core.js?rev=tZDGLPOvY1bRw%2BsgzXpxTg%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;/_layouts/15/ScriptResx.ashx?culture=en%2Dus&amp;amp;name=SP%2ERes&amp;amp;rev=yNk%2FhRzgBn40LJVP%2BqfgdQ%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;/_layouts/15/sp.ui.dialog.js?rev=3Oh2QbaaiXSb7ldu2zd6QQ%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;/_layouts/15/sp.runtime.js?rev=5f2WkYJoaxlIRdwUeg4WEg%3D%3D&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;/_layouts/15/sp.js?rev=lrxLgKOmx0nl2elVy0T07w%3D%3D&quot;&gt;&lt;/script&gt;
" __designer:Values="&lt;P N=&#39;Name&#39; T=&#39;MicrosoftAjax.js&#39; /&gt;&lt;P N=&#39;Localizable&#39; T=&#39;False&#39; /&gt;&lt;P N=&#39;InDesign&#39; T=&#39;False&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl00&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
<SharePoint:ScriptLink Name="SP.core.js" runat="server" Defer="False" Localizable="false" __designer:Preview="" __designer:Values="&lt;P N=&#39;Name&#39; T=&#39;SP.core.js&#39; /&gt;&lt;P N=&#39;Localizable&#39; T=&#39;False&#39; /&gt;&lt;P N=&#39;InDesign&#39; T=&#39;False&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl01&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
<SharePoint:ScriptLink Name="SP.js" runat="server" Defer="True" Localizable="false" __designer:Preview="" __designer:Values="&lt;P N=&#39;Name&#39; T=&#39;SP.js&#39; /&gt;&lt;P N=&#39;Localizable&#39; T=&#39;False&#39; /&gt;&lt;P N=&#39;Defer&#39; T=&#39;True&#39; /&gt;&lt;P N=&#39;InDesign&#39; T=&#39;False&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl02&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
        <meta charset="utf-8">
        <title>App Launcher</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          .ms-core-pageTitle,
.ms-core-pageTitle a
{
/* [ReplaceFont(themeFont:"title")] */ font-family:"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif;
/* [ReplaceColor(themeColor:"SiteTitle")] */ color:#262626;
}
.ms-core-pageTitle
{
font-size:2.77em;
white-space:nowrap;
}
.ms-core-pageTitle a:hover,
.ms-core-pageTitle a:active
{
text-decoration:none;
}
          .ms-dlgOverlay {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            opacity: 0.4;
            background-color: #999;
            display: none;
          }

          .ms-core-needIEFilter .ms-dlgOverlay {
            filter: alpha(opacity=50);
            -ms-filter: "alpha(opacity=50)";
          }

          .ms-dlgFrameContainer {
            padding: 0px 19px 10px;
            overflow: auto;
          }

          .ms-dlgTitle {
            padding: 13px 19px 15px;
            white-space: nowrap;
            cursor: move;
            overflow: hidden;
          }

          .ms-dlgFrameContainerNoPadding {
            padding: 0px;
            overflow: auto;
          }

          .ms-dlgTitleNoPadding {
            padding: 0px;
            white-space: nowrap;
            cursor: move;
            overflow: hidden;
          }

          .ms-dlgFrame {
            width: 100%;
            height: 100%;
            border: none;
          }

          .ms-dlgContent {
            /* [ReplaceColor(themeColor:"SubtleLines")] */
            border: 1px solid #c6c6c6;
            position: absolute;
            /* [ReplaceColor(themeColor:"BackgroundOverlay",opacity:"1.0")] */
            background-color: #fff;
            box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.47);
          }

          .ms-dlgContentNoBorder {
            border: 0px;
            position: absolute;
            /* [ReplaceColor(themeColor:"BackgroundOverlay",opacity:"1.0")] */
            background-color: #fff;
            box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.47);
          }

          .ms-dlg-heading,
          h2.ms-dlg-heading {
            /* [ReplaceFont(themeFont:"heading")] */
            font-family: "Segoe UI Semilight", "Segoe UI", "Segoe", Tahoma, Helvetica, Arial, sans-serif;
            font-size: 1.46em;
            /* [ReplaceColor(themeColor:"WebPartHeading")] */
            color: #444;
          }

          .ms-dlgTitleText {
            float: left;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .ms-dlgContent>.ms-dlgBorder>.ms-dlgTitle>.ms-dlgCloseBtn>.s4-clust {
            height: 16px !important;
            width: 16px !important;
          }

          .ms-dlgTitleBtns {
            margin-top: -10px;
            margin-right: -18px;
            height: 30px;
            float: right;
          }

          .ms-dlgCloseBtn>span {
            cursor: pointer;
            border: 1px solid transparent;
          }

          .ms-dlgErrItem {
            display: inline;
            padding-right: 10px;
          }

          .ms-dlgLoadingTextDiv {
            padding: 0px 0px 16px;
            white-space: nowrap;
          }

          .ms-dlgLoadingText {
            text-align: left;
            padding-left: 3px;
            width: 100%;
          }

          .ms-dialog body {
            /* [ReplaceColor(themeColor:"BackgroundOverlay",opacity:"1.0")] */
            background-color: #fff;
          }

          .ms-dialog .ms-fullscreenmode #contentBox {
            margin-left: 0px;
          }

          .ms-dialog #ms-loading-body {
            padding-top: 0px;
          }

          .ms-dialog #ms-loading-box {
            border-width: 0px;
          }

          .ms-visibilityHidden {
            visibility: hidden;
          }

          .ms-accessible,
          .ms-hidden,
          a.ms-skip,
          a:hover.ms-skip,
          a:visited.ms-skip,
          a.ms-TurnOnAcc,
          a.ms-SkiptoMainContent,
          a.ms-SkiptoNavigation {
            position: absolute;
            top: -2000px;
            overflow: hidden;
            height: 1px;
            width: 1px;
            display: block;
          }

          .ms-accentText,
          .ms-accentText:visited {
            /* [ReplaceColor(themeColor:"AccentText")] */
            color: #0072c6;
          }

          .ms-alignCenter {
            text-align: center;
          }

          .ms-textXLarge {
            /* [ReplaceFont(themeFont:"large-body")] */
            font-family: "Segoe UI Semilight", "Segoe UI", "Segoe", Tahoma, Helvetica, Arial, sans-serif;
            font-size: 1.46em;
          }

          .ms-textLarge {
            /* [ReplaceFont(themeFont:"large-body")] */
            font-family: "Segoe UI Semilight", "Segoe UI", "Segoe", Tahoma, Helvetica, Arial, sans-serif;
            font-size: 1.15em;
          }
        </style>
      </head>

      <body>
        <form runat="server">
          <SharePoint:FormDigest ID="FormDigest1" runat="server" __designer:Preview="" __designer:Values="&lt;P N=&#39;InDesign&#39; T=&#39;False&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;FormDigest1&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"></SharePoint:FormDigest>
        </form>
        <script>
          (function () {
            SP.UI.ModalDialog.showWaitScreenWithNoClose("Starting...", "Getting user data and redirecting to the app!");
            var appConfig = {};
            appConfig.userAppWebDomain = _spPageContextInfo.webAbsoluteUrl;
            appConfig.appDomain = _spPageContextInfo.siteAbsoluteUrl;
            var rd = "";

            try {
              var raw = document.querySelector("#__REQUESTDIGEST").value.split(",")
              rd = raw[0];
            }
            catch (e) {
              SP.UI.ModalDialog.showWaitScreenWaithNoClose("Oh No", "So something went wrong...please contract the sofware manager!");
              console.log("Critical Error: unable to find the appropriate request digest--> " + e);
            };

            try {
              var appWebUrl = window.location.protocol + "//" + window.location.host
                + _spPageContextInfo.webServerRelativeUrl
              var clientCtx = new SP.ClientContext(appWebUrl);
              var oWeb = clientCtx.get_web();
              var oUser = oWeb.get_currentUser();
              appConfig.userRequestData = rd;
              oUser.retrieve();
              var groups = oUser.get_groups();
              clientCtx.load(oWeb);
              clientCtx.load(groups);
              clientCtx.executeQueryAsync(function () {
                var rUser = oWeb.get_currentUser();;
                var tempUser = {};
                tempUser.userId = rUser.get_id();
                tempUser.email = rUser.get_email();
                tempUser.loginName = rUser.get_loginName();
                tempUser.title = rUser.get_title();
                tempUser.groups = [];
                var grpEnum = groups.getEnumerator();
                var i = 0;
                while (grpEnum.moveNext()) {
                  var group = grpEnum.get_current();
                  tempUser.groups[i] = {
                    title: group.get_title(),
                    id: group.get_id()
                  }
                  i += 1;
                }
                appConfig.userInfo = tempUser;
                JSON.stringify(appConfig);
                localStorage.setItem('AppConfig', appConfig);
                // window.location = _spPageContextInfo.siteAbsolf uteUrl + '/sitepages/index.html';

              }, function (error) {
                console.log(error);
              })
            } catch (e) {
              console.log("Critical Error: failed to get data from the server--> " + e);
            }
          })();
        </script>
      </body>

      </html>
