export const throwError = (errorFactory: () => any) => {
	throw errorFactory();
};
