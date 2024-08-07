export const randomString = (length: number) => {
	const charsPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-_=+\\|]}[{\'";:/?.>,<';
	let result = '';
	for (let i = 0; i < length; i++) result += charsPool.charAt(Math.floor(Math.random() * charsPool.length));
	return result;
};
