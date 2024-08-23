sap.ui.define([
    "./BaseController",
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,Device,Controller,JSONModel) {
        "use strict";

        return BaseController.extend("shoppingapp.controller.Category", {
            onInit: function () {

                var oViewModel = new JSONModel({
                    Suppliers: []
                });

                this.getView().setModel(oViewModel, "view");
                var oComponent = this.getOwnerComponent();
                this._oRouter = oComponent.getRouter();
                this._oRouter.getRoute("RouteCategory").attachMatched(this._loadCategories, this);




            },

            _loadCategories: function(oEvent) {
                var bSmallScreen = this.getModel("appView").getProperty("/smallScreenMode"),
                    sRouteName = oEvent.getParameter("name");
    
                // switch to first column in full screen mode for category route on small devices
                if (sRouteName === "category") {
                    this._setLayout(bSmallScreen ? "One" : "Two");
                }
    
                var oModel = this.getModel();
                //this._loadSuppliers();
                var oProductList = this.byId("productList");
                var oBinding = oProductList.getBinding("items");
                oBinding.attachDataReceived(this.fnDataReceived, this);
                var sId = oEvent.getParameter("arguments").id;
                this._sProductId = oEvent.getParameter("arguments").productId;
                // the binding should be done after insuring that the metadata is loaded successfully
                oModel.metadataLoaded().then(function () {
                    var oView = this.getView(),
                        sPath = "/" + this.getModel().createKey("ZA_EPM_ProductCategory02", {
                        Category: sId
                    });
                    oView.bindElement({
                        path : sPath,
                        parameters: {
                            expand: "to_Products"
                        },
                        events: {
                            dataRequested: function () {
                                oView.setBusy(true);
                            },
                            dataReceived: function () {
                                oView.setBusy(false);
                            }
                        }
                    });
                }.bind(this));
            },

            fnDataReceived: function() {
                var oList = this.byId("productList");
                var aListItems = oList.getItems();
                aListItems.some(function(oItem) {
                    if (oItem.getBindingContext().getPath() === "/to_Products('" + this._sProductId + "')") {
                        oList.setSelectedItem(oItem);
                        return true;
                    }
                }.bind(this));
            },

            onProductDetails: function (oEvent) {
                var oBindContext;
                if (Device.system.phone) {
                    oBindContext = oEvent.getSource().getBindingContext();
                } else {
                    oBindContext = oEvent.getSource().getSelectedItem().getBindingContext();
                }

               
                var oModel = oBindContext.getModel();
                var sCategoryId = oModel.getProperty(oBindContext.getPath()).Category;
                var sProductId = oModel.getProperty(oBindContext.getPath()).ProductId;
    
                // keep the cart context when showing a product
                var bCartVisible = this.getModel("appView").getProperty("/layout").startsWith("Three");
                this._setLayout("Two");
                this._oRouter.navTo(bCartVisible ? "productCart" : "RouteProduct", {
                    id: sCategoryId,
                    productId: sProductId
                }, !Device.system.phone);
            },
            onBack: function () {
                
                this.getRouter().navTo("RouteCategories");
            },

            compareProducts: function (oEvent) {
                var oProduct = oEvent.getSource().getBindingContext().getObject();
                var sItem1Id = this.getModel("comparison").getProperty("/item1");
                var sItem2Id = this.getModel("comparison").getProperty("/item2");
                this._oRouter.navTo("RouteComparison", {
                    id : oProduct.Category,
                    item1Id : (sItem1Id ? sItem1Id : oProduct.ProductId),
                    item2Id : (sItem1Id && sItem1Id != oProduct.ProductId ? oProduct.ProductId : sItem2Id)
                }, true);
            },



        });
    });
