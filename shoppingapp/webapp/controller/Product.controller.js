sap.ui.define([
    "./BaseController",
    "../model/formatter",
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,formatter,Controller) {
        "use strict";

        return BaseController.extend("shoppingapp.controller.Product", {
            onInit: function () {
                var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._router.getRoute("RouteProduct").attachPatternMatched(this._routePatternMatched, this);

            },

            _routePatternMatched: function(oEvent) {
                var sId = oEvent.getParameter("arguments").productId,
                    oView = this.getView(),
                    oModel = oView.getModel();
                // the binding should be done after insuring that the metadata is loaded successfully
                oModel.metadataLoaded().then(function () {
                    var sPath = "/" + this.getModel().createKey("ZA_EPM_Product02", {
                            ProductId: sId
                        });
                    oView.bindElement({
                        path : sPath,
                        events: {
                            dataRequested: function () {
                                oView.setBusy(true);
                            },
                            dataReceived: function () {
                                oView.setBusy(false);
                            }
                        }
                    });
                    var oData = oModel.getProperty(sPath);
                    //if there is no data the model has to request new data
                    if (!oData) {
                        oView.setBusyIndicatorDelay(0);
                        oView.getElementBinding().attachEventOnce("dataReceived", function() {
                            // reset to default
                            oView.setBusyIndicatorDelay(null);
                            this._checkIfProductAvailable(sPath);
                        }.bind(this));
                    }
                }.bind(this));
            },

            onToggleCart: function (oEvent) {
                var bPressed = oEvent.getParameter("pressed");
                var oEntry = this.getView().getBindingContext().getObject();
    
                this._setLayout(bPressed ? "Three" : "Two");
                this.getRouter().navTo(bPressed ? "RouteProductCart" : "product", {
                    id: oEntry.Category,
                    productId: oEntry.ProductId
                });
            },
            fnUpdateProduct: function(productId) {
                var sPath = "/Products('" + productId + "')",
                    fnCheck = function () {
                        this._checkIfProductAvailable(sPath);
                    };
    
                this.getView().bindElement({
                    path: sPath,
                    events: {
                        change: fnCheck.bind(this)
                    }
                });
            },

            _checkIfProductAvailable: function(sPath) {
                var oModel = this.getModel();
                var oData = oModel.getProperty(sPath);
    
                // show not found page
                if (!oData) {
                    this._router.getTargets().display("notFound");
                }
            },


        });
    });
