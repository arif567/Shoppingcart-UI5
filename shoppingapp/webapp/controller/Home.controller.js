sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,Controller) {
        "use strict";

        return BaseController.extend("shoppingapp.controller.Home", {
            onInit: function () {

                var oComponent = this.getOwnerComponent();
			    this._router = oComponent.getRouter();
			    this._router.getRoute("RouteCategory").attachMatched(this._onRouteMatched, this);


            },
            _onRouteMatched: function() {
                var bSmallScreen = this.getModel("appView").getProperty("/smallScreenMode");
                if (bSmallScreen) {
                    this._setLayout("One");
                }
            },
            onCategoryListItemPress: function (oEvent) {
                var oBindContext = oEvent.getSource().getBindingContext();
                var oModel = oBindContext.getModel();
                var sCategoryId = oModel.getProperty(oBindContext.getPath()).Category;
    
                this._router.navTo("RouteCategory", {id: sCategoryId});
            },
            
        });
    });
