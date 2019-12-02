const setari = require.main.require("./setari");
const moment = require('moment');

async function get(){
	return {
		bobina_CSV_local:setari.bobina_CSV.localSave+moment().format('YYYY')+"/"+moment().format('MM'),
		bobina_CSV_WMS:setari.bobina_CSV.path_WMS

	}
	
}
exports.get = get;
