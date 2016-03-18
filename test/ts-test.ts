var expect:Chai.ExpectStatic = require('chai').expect;
import {DataService} from '../src/app/services/data-service';

//import {mySUT,realCallback, myDep} from './sut/mySUT';


// FakeXMLHttpRequestAPI
// request.url
// request.method
// request.requestHeaders
// request.requestBody
// request.status
// request.statusText
// request.username
// request.password
// request.responseXml
// request.responseText
// request.getResponseHeader(header)
// request.getAllReponseHeaders()

// request.respond(status, headers, body)
// request.setResponseHeaders(object)
// request.setResponseBody(body)


// describe('useFakeXMLHttpRequest', function(){
//   var xhr, requests;
//   beforeEach(function(){
//     xhr = sinon.useFakeXMLHttpRequest();
//     requests = [];
    
//     xhr.onCreate = function(request) {
//       requests.push(request);
//     };
//   });
  
//   afterEach(function(){
//     xhr.restore();
//   });
  
//   it('should be able to handle responses', function(){
//     var responseData = JSON.stringify(
//       {
//         myData:3,
//         message: 'hello there'
//       }
//     );
//     $.getJSON('some/url', function(data) {
//       console.log(data);      
//     });
//     requests[0].respond[200, {"Content-Type":"application/json"}, responseData];
//     expect(requests[0].url).to.equal('some/url');  
    
//   });
  
// })

// describe('fakeServer', function(){
//   var server;
//   beforeEach(function(){
//     server = sinon.fakeServer.create();
//     server.respondWith([200, {"Content-Type":"application/json"}, '{"myProp":35}']);
//   });
  
//   afterEach(function(){
//     server.restore();
//   })
  
//   it('should respond with data', function(){
//     var spy = sinon.spy();
//     $.getJSON('some/url', spy);
//     server.respond();
//     sinon.assert.calledWith(spy, {myProp:35});
//   })
// });

describe('data-service', function(){
   var server;
  beforeEach(function(){
    server = sinon.fakeServer.create();
    server.respondWith([
      200, 
      {"Content-Type":"application/json"}, 
      '{"email":"navarroaburr@rushenterprises.com"}'
    ]);
  });
  
  afterEach(function(){
    server.restore();
  })
  
  it('should return email address', function(done){
    var service = new DataService('sharepoint');    
    var async = service.getSPUser();
    
    async.done(function(data:any) {
      console.log('data', data);
      expect(data.email).to.equal('navarroaburr@rushenterprises.com');
      done();
    });    
    expect(async.isRejected()).to.equal(false);
    
    server.respond(); // !important, run the fakeServer so it can respond        
  })
})





// describe('Spies', function(){
//   it('should spy on a callback', function (){
//     var spy = sinon.spy();
//     mySUT.callCallback(spy);
//     expect(spy.called).to.equal(true);
//   })
  
//   it('should call a real implementation if given a real function to spy on', function(){
//     var spy = sinon.spy(realCallback);
//     var returnValue = mySUT.callBackWithReturnValue(spy);
//     expect(spy.called).to.equal(true);
//     expect(returnValue).to.equal(4);
//   })
  
//   // it('should spy on a method of an object', function(){
//   //   var spy = sinon.spy(myDep, 'someMethod');
//   //   var returnValue = mySUT.callDependency();
//   //   expect(spy.called).to.equal(true);
//   //   expect(returnValue).to.equal(10);
//   // })
  
//   it('should spy on method of object, BETTER version', function(){
//     var spy = sinon.spy(myDep, 'someMethod');
//     var returnValue = mySUT.callDependencyBetter(myDep);
//     expect(spy.called).to.equal(true);
//     expect(returnValue).to.equal(10);
//   })
  
// })




// describe("My first wallaby test", function () {  
//   beforeEach(function(){
//     //console.log('setup');    
//   })
  
//   afterEach(function(){
//     //console.log('teardown');
//   })
  
//   it("should work", function() {
//     expect(1).to.equal(1);    
//   })
// })

// describe('My second wallaby test', function(){
//   it('should work', function(){
//     expect(true).to.equal(true);
//   })
// })

// describe("Ajax", function () {   
//   it("should reject", function() {    
//     //true.should.equal(true);    
//     var absUrl = 'http://www.google.com',
//         service = new DataService(absUrl),  
//         result = service.getSPUser();       
//     return expect(result).to.be.rejected;
  
//   })
// })