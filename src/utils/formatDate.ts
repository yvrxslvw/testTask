export const formatDate = (d: Date, log: boolean = false): string => {
	let date = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
	let month = d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
	let year = d.getFullYear();
	let hour = d.getHours() < 10 ? `0${d.getHours()}` : `${d.getHours()}`;
	let minute = d.getMinutes() < 10 ? `0${d.getMinutes()}` : `${d.getMinutes()}`;
	let second = d.getSeconds() < 10 ? `0${d.getSeconds()}` : `${d.getSeconds()}`;
	return log
		? `${date}.${month}.${year} ${hour}:${minute}:${second}`
		: `${date}-${month}-${year}_${hour}-${minute}-${second}`;
};
