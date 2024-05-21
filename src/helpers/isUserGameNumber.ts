const isUserGameNumber = (code: string|undefined): boolean => Boolean(String(code).match(/^[1-9][0-9]{3}$/))
export default isUserGameNumber
