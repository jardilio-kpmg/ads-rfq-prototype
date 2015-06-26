/*jshint -W101 */
 // THIS FILE IS AUTO-GENERATED. DO NOT MODIFY.  RUN 'gulp api' TO EDIT THE SPECIFICATION
  /**
   * @namespace api.v1
   */

  /**
   * @callback api.v1.ISuccessCallback
   * @param {*} result - The result of executed operation
   * @param {string} [status] - The status code returned on the response
   * @param {object} [headers] - The headers returned on the response
   * @param {object} [config] - The config object used to create the request
   */

  /**
   * @callback api.v1.IErrorCallback
   * @param {*} error - The error of executed operation
   * @param {string} [status] - The status code returned on the response
   * @param {object} [headers] - The headers returned on the response
   * @param {object} [config] - The config object used to create the request
   */

  /**
   * @class api.v1.Promise
   * @function
   * @methodOf api.v1.Promise
   * @name api.v1.Promise#then
   * @param {api.v1.ISuccessCallback} [success] - Success callback function
   * @param {api.v1.IErrorCallback} [error] - Error callback function
   */

  var angular = require('angular'),
      module = angular.module('api.v1', ['ngResource']),
      config = require('config');
  /**
    * Management of user authorizations
   * @class api.v1.Login
   * @extends api.v1.ILogin
   * @property {api.v1.Promise} $promise - The promise associated with the async operation.
   */
   /* istanbul ignore next */
  module.factory('Login', function ($resource) {
      var servicesBaseUrl = config.server;
      return $resource(
        servicesBaseUrl + '/api/1/login',
        {},
        {
            /**
              * Authenticate the user via username & password
             * @function
             * @methodOf api.v1.Login
             * @name api.v1.Login#$create
             * @param {object} [params] - Input parameters
             * @param {api.v1.ISuccessCallback} [success] - Success callback function
             * @param {api.v1.IErrorCallback} [error] - Error callback function
             * @returns {api.v1.Login}
             * @example
             * function Controller(Login) {
         *  var result = new Login();
         *  result.$create(params);
         * }
             */
          
          'create': {
            method: 'POST',
              isArray: false,
              params: {
            }
          },
          
            /**
              * Clears current session and logs user out of the application.
             * @function
             * @methodOf api.v1.Login
             * @name api.v1.Login#$remove
             * @param {object} [params] - Input parameters
             * @param {api.v1.ISuccessCallback} [success] - Success callback function
             * @param {api.v1.IErrorCallback} [error] - Error callback function
             * @returns {api.v1.Login}
             * @example
             * function Controller(Login) {
         *  var result = new Login();
         *  result.$remove(params);
         * }
             */
          
          'remove': {
            method: 'DELETE',
              isArray: false,
              params: {
            }
          },
          
            /**
              * Returns an updated token with an extended expiration.
 * This will be invoked by the client when the user has been actively using the client but not in ways that have resulted in a other service calls.  It allows the client to prevent the user from being timed out unnecessarily.
             * @function
             * @methodOf api.v1.Login
             * @name api.v1.Login#$update
             * @param {object} [params] - Input parameters
             * @param {api.v1.ISuccessCallback} [success] - Success callback function
             * @param {api.v1.IErrorCallback} [error] - Error callback function
             * @returns {api.v1.Login}
             * @example
             * function Controller(Login) {
         *  var result = new Login();
         *  result.$update(params);
         * }
             */
          
          'update': {
            method: 'PUT',
              isArray: false,
              params: {
            }
          },
          
    },
    {
      stripTrailingSlashes: true
    }
  );
});

  /**
    * When an error is encountered by a client, it will send diagnositc information to this service which will log the information for later analysis.
   * @class api.v1.Error
   * @extends api.v1.IError
   * @property {api.v1.Promise} $promise - The promise associated with the async operation.
   */
   /* istanbul ignore next */
  module.factory('Error', function ($resource) {
      var servicesBaseUrl = config.server;
      return $resource(
        servicesBaseUrl + '/api/1/errors',
        {},
        {
            /**
              * Add a new error to the collection
             * @function
             * @methodOf api.v1.Error
             * @name api.v1.Error#$create
             * @param {object} [params] - Input parameters
             * @param {api.v1.ISuccessCallback} [success] - Success callback function
             * @param {api.v1.IErrorCallback} [error] - Error callback function
             * @returns {api.v1.Error}
             * @example
             * function Controller(Error) {
         *  var result = new Error();
         *  result.$create(params);
         * }
             */
          
          'create': {
            method: 'POST',
              isArray: false,
              params: {
            }
          },
          
    },
    {
      stripTrailingSlashes: true
    }
  );
});

  /**
    * Management of user resources
   * @class api.v1.User
   * @extends api.v1.IUser
   * @property {api.v1.Promise} $promise - The promise associated with the async operation.
   */
   /* istanbul ignore next */
  module.factory('User', function ($resource) {
      var servicesBaseUrl = config.server;
      return $resource(
        servicesBaseUrl + '/api/1/users',
        {},
        {
            /**
              * Add a new user to the collection
             * @function
             * @methodOf api.v1.User
             * @name api.v1.User#$create
             * @param {object} [params] - Input parameters
             * @param {api.v1.ISuccessCallback} [success] - Success callback function
             * @param {api.v1.IErrorCallback} [error] - Error callback function
             * @returns {api.v1.User}
             * @example
             * function Controller(User) {
         *  var result = new User();
         *  result.$create(params);
         * }
             */
          
          'create': {
            method: 'POST',
              isArray: false,
              params: {
            }
          },
          
            /**
              * Get a list of user
             * @function
             * @methodOf api.v1.User
             * @name api.v1.User.query
             * @param {object} [params] - Input parameters
         * @param {number} [params.page] - The page number of the collection to return
         * @param {number} [params.pageSize] - The number of items to display per page
         * @param {string} [params.sortBy] - A field to sort the paged collection by
         * @param {boolean} [params.sortDescending] - Sort results in descending order rather than ascending
         * @param {string} [params.terms] - A string of terms to query for users by
             * @param {api.v1.ISuccessCallback} [success] - Success callback function
             * @param {api.v1.IErrorCallback} [error] - Error callback function
             * @returns {api.v1.User[]}
             * @example
             * function Controller(User) {
         *  var result = User.query({
         *    page: '',
         *    pageSize: '',
         *    sortBy: '',
         *    sortDescending: '',
         *    terms: '',
         *  });
         * }
             */
          
          'query': {
            method: 'GET',
              isArray: true,
              params: {
            }
          },
          
          /**
            * Update a specific user
           * @function
           * @methodOf api.v1.User
           * @name api.v1.User#$update
           * @param {object} params - Input parameters
         * @param {string} params.userId - undefined
           * @param {api.v1.ISuccessCallback} [success] - Success callback function
           * @param {api.v1.IErrorCallback} [error] - Error callback function
           * @returns {api.v1.User}
           * @example
           * function Controller(User) {
         *  var result = new User();
         *  result.userId = '';
         *  result.$update(params);
         * }
           */
        
        'update': {
          url: servicesBaseUrl + '/api/1/users/:userId',
            method: 'PUT',
            isArray: false,
            params: {
            userId: '@userId',
          }
        },
          /**
            * Deletes a specific user
           * @function
           * @methodOf api.v1.User
           * @name api.v1.User#$remove
           * @param {object} params - Input parameters
         * @param {string} params.userId - undefined
           * @param {api.v1.ISuccessCallback} [success] - Success callback function
           * @param {api.v1.IErrorCallback} [error] - Error callback function
           * @returns {api.v1.User}
           * @example
           * function Controller(User) {
         *  var result = new User();
         *  result.userId = '';
         *  result.$remove(params);
         * }
           */
        
        'remove': {
          url: servicesBaseUrl + '/api/1/users/:userId',
            method: 'DELETE',
            isArray: false,
            params: {
            userId: '@userId',
          }
        },
          /**
            * Get a specific user
           * @function
           * @methodOf api.v1.User
           * @name api.v1.User.get
           * @param {object} params - Input parameters
         * @param {string} params.userId - undefined
           * @param {api.v1.ISuccessCallback} [success] - Success callback function
           * @param {api.v1.IErrorCallback} [error] - Error callback function
           * @returns {api.v1.User}
           * @example
           * function Controller(User) {
         *  var result = User.get({
         *    userId: '',
         *  });
         * }
           */
        
        'get': {
          url: servicesBaseUrl + '/api/1/users/:userId',
            method: 'GET',
            isArray: false,
            params: {
            userId: '@userId',
          }
        },
    },
    {
      stripTrailingSlashes: true
    }
  );
});

