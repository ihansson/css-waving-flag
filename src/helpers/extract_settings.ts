import Settings from "Interfaces/settings";

export default function extract_settings(str: string): Settings {
	const settings: any = {};
	if(!str) return settings;
	str.split(';').forEach(function(setting: string){
		setting = <string>setting;
		const arr = setting.trim().split(/:(.+)/)
		if(!arr[0]) return;
		const key = arr[0].trim();
		let value: any = arr[1] ? arr[1].trim() : true;
		if(['segments'].indexOf(key) !== -1) value = parseInt(value)
		if(['proportions'].indexOf(key) !== -1) value = value.split(':').map((_value: string) => parseInt(_value))
		settings[key] = arr[1] ? value : true
	});
	return settings;
}