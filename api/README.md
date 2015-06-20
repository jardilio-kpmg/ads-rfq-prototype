# RAML API Specification for ACA Overview

This document covers the basics for defining the API specification for ACA, generating API documentation
and generating API implementation code. 

If you haven't already, be sure to see the [project documentation](../README.md) for details on getting your
local environment setup to build.

For more information about the RAML syntax and specification, please see [here](http://raml.org/docs.html).

# Definition Guidelines

## Traits

Traits decorate service definitions with common attributes. For instance, we use traits to say that
a service requires prior authorization using the `secured` trait which requires specific headers
to be included in the request and defines standard response codes to be considered on authenticated 
services response.

For more examples on traits, see [here](http://raml.org/docs-200.html#traits).

## Types

Types are ways for a service to extend a types definition. For instance, we define a type called `collection-readonly`
that uses the trait `paged` and expresses the default definition for any service endpoint that defines a collection
that would return a list of objects that may be retrieved, but not written to. A type is like an abstract class of sorts
that your service definition extends and fills in the missing pieces. We have types defined for collections and members
and those types define all the boilerplate code you need to define a collection or member consistency across all
services and you only heed to define your own: uri, displayName, example and schema. All the other parts will have the
appropriate defaults placed for request body, response body, response codes, headers...even a default description. Any
of these defaults can be overwritten in your service definition.

For more examples on traits, see [here](http://raml.org/docs-200.html#resource-types).

## Standards, Conventions and Assumptions

This is a list of common standards and conventions mixed in with some assumptions that were made to ease in the 
code generation by enforcing consistency in implementation. 

* Service URI's should be defined using the plural name of the entity to represent the collection and the singular
name of entity followed by the suffix "Id" to represent the member in the URI parameter (ie /users/{userId}). 
* The displayName of both the collection and the member should be the same and be the singular form of the entity it
represents (ie user). 
* The schema for every entity should have an identifier field where the name of that field is the displayName (singular
name of the entity) followed by the suffix "Id" (ie userId). The name of this identifier should then match the name of
the member's URI parameter. This allows for easily mapping between entities and URI parameters (ie /users/{userId}/cars/{carId}).
* All service definitions should extend one of the common types (ie collection, collection-writeonly, collection-readonly,
member, member-readonly, member-writeonly). 
* Any service definition which has not yet been implemented should use the trait `mock`. This is used during code generation
to generate mocks based on the definitions example reference.

# API Tasks

## Editing the definitions

RAML is just an extension of the [YAML](http://www.yaml.org/) sytnax. You can associate the .raml extension with the YAML editor of your 
IDE to edit the files if you so choose. There is also a RAML editor included in this project which offers some
code assistance and preview mode.

    grunt
    [?] What task would you like to run? 
      Run the Scaffolding Tools to Build Out Project 
      Run the Web Application 
      Run the Cordova Application 
    ❯ Run the API Designer 
      Run the Test Suite 
      Run the Documentation Generator 
      Publish the Application for Deployment 


Or simply run `gulp server:apidesigner` to launch the editor.

## Generating documentation

API documentation is bundled with the applications documentation as part of the documentation task. You can run
this task to preview the documentation while you make changes to the definitions.

    grunt
    [?] What task would you like to run? 
      Run the Scaffolding Tools to Build Out Project 
      Run the Web Application 
      Run the Cordova Application 
      Run the API Designer 
      Run the Test Suite 
    ❯ Run the Documentation Generator 
      Publish the Application for Deployment 


Or simply run `gulp docs` or `gulp server:docs` to launch the documentation and rebuild on changes.

## Generating code

The RAML definitions are also used to generate client side code representing the implementation of the interface. This
could also be used to potentially generate server side code as well. This task uses the same scaffolding engine used
in the other scaffolding tasks with lodash templates found in the directory `build/scaffolds/.api`.

This task is typically run as part of a standard build, but you can run it independently using `grunt apicodegen`.

