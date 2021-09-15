let baseUrl = ''

if (process.env.NODE_ENV === 'development') {
	baseUrl = '/api/'
} else {
	baseUrl = '/'
	// baseUrl = '//office-car.io/'
}

export default {
    baseUrl
}
