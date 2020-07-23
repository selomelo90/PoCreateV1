function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZPO_CREATEV1_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}