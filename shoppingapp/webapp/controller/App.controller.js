sap.ui.define(
    [
        "./BaseController",
        
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController,JSONModel) {
      "use strict";
  
      return BaseController.extend("shoppingapp.controller.App", {
        onInit: function() {

          var oViewModel,
				  fnSetAppNotBusy,
				  iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

          oViewModel = new JSONModel({
            busy : true,
            delay : 0,
            layout : "TwoColumnsMidExpanded",
            smallScreenMode : true
          });

          this.setModel(oViewModel, "appView");

          fnSetAppNotBusy = function() {
            oViewModel.setProperty("/busy", false);
            oViewModel.setProperty("/delay", iOriginalBusyDelay);
          };

          this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
			    this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);

         

        }
      });
    }
  );
  