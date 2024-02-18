const isUserCode = (code: string|undefined): boolean => Boolean(String(code).match(/^[A-Za-z0-9]{6}$/))
export default isUserCode
