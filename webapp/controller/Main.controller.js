sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var dummyDataCheck;
	return Controller.extend("PoCreateV1.PoCreateV1.controller.Main", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf PoCreateV1.PoCreateV1.view.Main
		 */
		onInit: function () {

		},
		onSend: function () {
			
			dummyDataCheck = "";
			debugger;
			var oTable = this.getView().byId("idPoItemsTable");
			// Get the table Model
			var oModel2 = oTable.getModel();
			// Get Items of the Table
			var aItems = oTable.getItems();
			// Define an empty Array
			var itemData = [];

			for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {
				var PoItem   = oModel2.getProperty("PoItem", aItems[iRowIndex].getBindingContext());
				var Material = oModel2.getProperty("Material", aItems[iRowIndex].getBindingContext());
				var Quantity = oModel2.getProperty("Quantity", aItems[iRowIndex].getBindingContext());
				var Unit	 = oModel2.getProperty("Unit",     aItems[iRowIndex].getBindingContext());
				var NetPrice = oModel2.getProperty("NetPrice", aItems[iRowIndex].getBindingContext());
				var Plant    = oModel2.getProperty("Plant",    aItems[iRowIndex].getBindingContext());
				var StgeLoc  = oModel2.getProperty("StgeLoc",  aItems[iRowIndex].getBindingContext());

				itemData.push({
					PoNumber : "1",
					PoItem   : PoItem,
					Material : Material,
					Quantity : Quantity,
					Unit     : Unit,
					NetPrice : NetPrice,
					Plant	 : Plant,
					StgeLoc  : StgeLoc
				});
			}
			// Get the values of the header input fields
			var SasTur     = this.getView().byId("SasTur").getValue();
			var Satici	   = this.getView().byId("Satici").getValue();
			var SAORG      = this.getView().byId("SAORG").getValue();
			var SAGrup     = this.getView().byId("SAGrup").getValue();
			var SirketKodu = this.getView().byId("SirketKodu").getValue();
			var OdeKosul   = this.getView().byId("OdeKosul").getValue();
			var PB		   = this.getView().byId("PB").getValue();
			var DovizKur   = this.getView().byId("DovizKur").getValue();

			// Create one emtpy Object
			var oEntry1 = {};

			oEntry1.PoNumber     = "1";
			oEntry1.DocType      = SasTur;
			oEntry1.Vendor       = Satici;
			oEntry1.PurchOrg     = SAORG;
			oEntry1.PurGroup     = SAGrup;
			oEntry1.CompCode     = SirketKodu;
			oEntry1.PaymentTerm  = OdeKosul;
			oEntry1.Currency     = PB;
			oEntry1.ExchangeRate = DovizKur;

			// Link Pack items to the Pack header
			// Very very Important. Here the name should be exactly like the Entity Set at Backend OData
			// Stack_HU_Pack_MatSet is the same name at back end
			oEntry1.ItemsSet = itemData;
			var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPO_CREATEV1_SRV/");
			this.getView().setModel(oModel1);
			oModel1.setHeaders({
				"X-Requested-With": "X"
			});
			oModel1.create("/HeaderSet", oEntry1, {

				success: function (oData, oResponse) {
					alert("The backend SAP System is Connected Successfully");

					//	var successObj = oResponse.data.HandlingUnit;
					//	var message = "Batch : " + successObj + "  " + "updated successfully";
					var successObj = oResponse.data.PoNumber;
					var message;
					//success
					if (successObj === "S") {
						message = "Database Tables Updated Successfully";
					}
					//failure
					if (successObj === "F") {
						message = "Database Tables were not Updated";
					}
					//blank
					if (successObj === "B") {
						message = "Database Table were sent nothing uptated";
					}

					jQuery.sap.require("sap.m.MessageBox");

					sap.m.MessageBox.show(message, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Backend Table(s) Update Status",
						actions: [sap.m.MessageBox.Action.OK]
					});
				},
				error: function (oError) {
					alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
				}
			});
		},
		enableControl: function (value) {
			return !!value;
		},

		disableControl: function (value) {
			return !value;
		},

		addEntry: function () {
			debugger;
			if (dummyDataCheck === "X") {

			} else {
				var dummyData;
				var oModel = new sap.ui.model.json.JSONModel({
					data: dummyData
				});

				this.getView().setModel(oModel);
			}

			var itemRow = {
				PoItem: null,
				Material: null,
				Quantity: null,
				Unit: "ADT",
				NetPrice: null,
				Plant: "DM01",
				StgeLoc: null,
				createNew: false,
				removeNew: false,
				editNew: false,
				saveNew: true
			};

			var oModel = this.getView().byId("idPoItemsTable").getModel();
			var itemData = oModel.getProperty("/data");
			if (typeof itemData !== "undefined" && itemData !== null && itemData.length > 0) {
				itemData.push(itemRow);
				dummyDataCheck = "X";
			} else {
				itemData = [];
				itemData.push(itemRow);
				dummyDataCheck = "X";
			}
			oModel.setData({
				data: itemData
			});
		},

		onEdit: function (oEvent) {
			debugger;
			var path = oEvent.getSource().getBindingContext().getPath();
			var obj = oEvent.getSource().getBindingContext().getObject();

			obj.saveNew = true;
			obj.removeNew = false;

			var oModel = this.getView().getModel();

			oModel.setProperty(path, obj);
		},

		saveEntry: function (oEvent) {
			debugger;
			var path = oEvent.getSource().getBindingContext().getPath();
			var obj = oEvent.getSource().getBindingContext().getObject();

			obj.saveNew = false;
			obj.removeNew = true;
			obj.editNew = true;

			var oModel = this.getView().getModel();

			oModel.setProperty(path, obj);

			// this.addEmptyObject();

		},
		removeEntry: function (oEvent) {
				debugger;
				var path = oEvent.getSource().getBindingContext().getPath();
				var oThisObj = oEvent.getSource().getBindingContext().getObject();

				var oTable = this.getView().byId("idPoItemsTable");
				var oModel2 = oTable.getModel();
				var aRows = oModel2.getData().data;
				var index = $.map(aRows, function (obj, index) {

					if (obj === oThisObj) {
						return index;
					}
				});
				aRows.splice(index, 1);
				oModel2.setData({
					data: aRows
				});
				//	oTable.removeSelections(true);
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf PoCreateV1.PoCreateV1.view.Main
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf PoCreateV1.PoCreateV1.view.Main
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf PoCreateV1.PoCreateV1.view.Main
		 */
		//	onExit: function() {
		//
		//	}

	});

});