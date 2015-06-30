// register the interceptor as a service
angular.module('sislegisapp').factory('HttpInterceptor', function($q, $rootScope) {
	
	var showSpinner = function(config){
		return !$rootScope.inactivateSpinner &&
			config && config.url && config.url.search('rest') >= 0 && 
			config.url.search('/tags') < 0 && config.url.search('/find') < 0;
	}
	
	return {
		'request' : function(config) {
			if (showSpinner(config))
		        $('#spinner').show();
			return config;
		},

		'requestError' : function(rejection) {
			if (showSpinner(config))
		        $('#spinner').show();
			if (canRecover(rejection)) {
				return responseOrNewPromise
			}
			return $q.reject(rejection);
		},

		'response' : function(response) {
	        $('#spinner').hide();
			return response;
		},

		'responseError' : function(rejection) {
	        $('#spinner').hide();
			if (canRecover(rejection)) {
				return responseOrNewPromise
			}
			return $q.reject(rejection);
		}
	};
});
