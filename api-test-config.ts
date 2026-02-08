const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: process.env.USER_EMAIL || throwError('USER_EMAIL required'),
    userPassword: process.env.USER_PASSWORD || throwError('USER_PASSWORD required')
}

function throwError(msg: string): never {
    throw new Error(msg);
}

export { config };