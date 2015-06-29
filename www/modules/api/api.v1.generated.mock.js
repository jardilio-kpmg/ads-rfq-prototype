 // THIS FILE IS AUTO-GENERATED. DO NOT MODIFY.  RUN 'grunt server:apidesigner' TO EDIT THE SPECIFICATION
//this is not included if the --nomocks flag is set during build
angular.module('api.v1').requires.push('ngMockE2E');
angular.module('api.v1').run(function ($httpBackend) {
  // login:post
  $httpBackend.when('POST', /\/api\/1\/login/).respond({
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJc3N1ZXIiOiJodHRwOi8vd3d3Lnd5bnlhcmRncm91cC5jb20iLCJBdWRpZW5jZSI6IkFDQSIsIlByaW5jaXBhbCI6eyJTZXNzaW9uSWQiOiI3ZDZjN2ZjMC1lNzkzLTQyNjMtOTQ3OC01MmQzMmQyYzYzNjEiLCJVc2VyS2V5IjoiNCIsIlVzZXJOYW1lIjoia2NsaWZmZSIsIkNsYWltcyI6WyJBZG1pbiJdLCJMb2NhbGUiOiJlbi1OWiIsIlNlc3Npb25UaW1lT3V0IjoiXC9EYXRlKDE0NTA3OTQ1OTczNjIpXC8iLCJJc3N1ZWRUbyI6bnVsbCwiSWRlbnRpdHkiOnsiTmFtZSI6ImtjbGlmZmUiLCJBdXRoZW50aWNhdGlvblR5cGUiOiJXeW55YXJkIiwiSXNBdXRoZW50aWNhdGVkIjp0cnVlfX0sIkV4cGlyeSI6IlwvRGF0ZSgxKVwvIn0.0GZlnA-mdDQqSfSKvBlWsUehtVCRkNK8DA9siyeVLQ0"
});
  // login:delete
  $httpBackend.when('DELETE', /\/api\/1\/login/).respond("");
  // login:put
  $httpBackend.when('PUT', /\/api\/1\/login/).respond({
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJc3N1ZXIiOiJodHRwOi8vd3d3Lnd5bnlhcmRncm91cC5jb20iLCJBdWRpZW5jZSI6IkFDQSIsIlByaW5jaXBhbCI6eyJTZXNzaW9uSWQiOiI3ZDZjN2ZjMC1lNzkzLTQyNjMtOTQ3OC01MmQzMmQyYzYzNjEiLCJVc2VyS2V5IjoiNCIsIlVzZXJOYW1lIjoia2NsaWZmZSIsIkNsYWltcyI6WyJBZG1pbiJdLCJMb2NhbGUiOiJlbi1OWiIsIlNlc3Npb25UaW1lT3V0IjoiXC9EYXRlKDE0NTA3OTQ1OTczNjIpXC8iLCJJc3N1ZWRUbyI6bnVsbCwiSWRlbnRpdHkiOnsiTmFtZSI6ImtjbGlmZmUiLCJBdXRoZW50aWNhdGlvblR5cGUiOiJXeW55YXJkIiwiSXNBdXRoZW50aWNhdGVkIjp0cnVlfX0sIkV4cGlyeSI6IlwvRGF0ZSgxKVwvIn0.0GZlnA-mdDQqSfSKvBlWsUehtVCRkNK8DA9siyeVLQ0"
});
  // error:post
  $httpBackend.when('POST', /\/api\/1\/errors/).respond("");
  // user:put
  $httpBackend.when('PUT', /\/api\/1\/users\/.*/).respond({
  "userId": "1",
  "firstName": "John",
  "lastName": "Doe",
  "userName": "jdoe"
});
  // user:delete
  $httpBackend.when('DELETE', /\/api\/1\/users\/.*/).respond("");
  // user:get
  $httpBackend.when('GET', /\/api\/1\/users\/.*/).respond({
  "userId": "1",
  "firstName": "John",
  "lastName": "Doe",
  "userName": "jdoe"
});

  // user:post
  $httpBackend.when('POST', /\/api\/1\/users/).respond({
  "userId": "1",
  "firstName": "John",
  "lastName": "Doe",
  "userName": "jdoe"
});
  // user:get
  $httpBackend.when('GET', /\/api\/1\/users/).respond([
  {
    "userId": "1",
    "firstName": "John",
    "lastName": "Doe",
    "userName": "jdoe"
  },
  {
    "userId": "2",
    "firstName": "Jane",
    "lastName": "Doe",
    "userName": "jdoe2"
  }
]);
});//angular.module

