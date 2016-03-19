var expect:Chai.ExpectStatic = require('chai').expect;
import {DataService} from '../../src/app/services/data-service';

describe('data-service getSPUser()', function(){
  var server;
  beforeEach(function(){
    server = sinon.fakeServer.create();    
  });
  
  afterEach(function(){
    server.restore();
  })
  
  it('should return email address', function(done){
    server.respondWith('GET','some/url/_api/Web/CurrentUser?$select=Email',
    [
      200, 
      {"Content-Type":"application/json"}, 
      '{"email":"navarroaburr@rushenterprises.com"}'
    ]);
    var service = new DataService('some/url');    
    var async = service.getSPUser();
    
    async.done(function(data:any) {
      expect(data.email).to.equal('navarroaburr@rushenterprises.com');
      done();
    });    
    expect(async.isRejected()).to.equal(false);
    
    server.respond(); // !important, have the fakeServer respond        
  })
  
  it('should return 404', function(){
    // the default response is [404, {}, ''], per sinonjs documentation 
    var service = new DataService('bad_base_url');    
    var async = service.getSPUser();
    
    expect(async).to.rejected;
    
    server.respond(); // !important, have the fakeServer respond   
  })    
})

describe('data-service getListItems()', function(){
  var server;
  beforeEach(function(){
    server = sinon.fakeServer.create();    
  });
  
  afterEach(function(){
    server.restore();
  })
  
  it('should return list items', function(done){
    let d = {
      value: 'list items'
    }
    server.respondWith(
    [
      200, 
      {"Content-Type":"application/json"}, 
      JSON.stringify(d)
    ]);
    let service = new DataService('some/url');
    let async = service.getListItems('','',[]);
    
    async.done(function(data:any) {
      expect(data).to.equal('list items');
      done();
    });    
    expect(async.isRejected()).to.equal(false);
    
    server.respond(); // !important, have the fakeServer respond 
  });
  
  it('should return 404', function(){
    var service = new DataService('bad_base_url');
    var async = service.getListItems('','',[]);
    
    expect(async).to.rejected;
    server.respond();
  })
})

describe('data-service getItemsTop200',function(){
  var server;
  beforeEach(function(){
    server = sinon.fakeServer.create();    
  });
  
  afterEach(function(){
    server.restore();
  })
  
  it('it should return list items', function(done){
    this.timeout(5000);
    let arr = [];
    // create 200 objects and add them to the array
    for (let i = 0; i < 200; i++) {
      arr.push({
        title: `Title-${i+1}`
      })
    }
    let d = {
      value: arr
    }
    server.respondWith(
    [
      200, 
      {"Content-Type":"application/json"}, 
      JSON.stringify(d) // array of 200 objects
    ]);
    
    let service = new DataService('some/url');
    let async = service.getListItemsTop200('','',[]);
    
    async.done(function(data:any) {
      expect(data).to.length(200);
      done();
    });    
    expect(async.isRejected()).to.equal(false);
    
    server.respond(); // !important, have the fakeServer respond 
  });
  
  it('should return 404', function(){
    var service = new DataService('bad_base_url');
    var async = service.getListItemsTop200('','',[]);
    
    expect(async).to.rejected;
    server.respond();
  })
})

