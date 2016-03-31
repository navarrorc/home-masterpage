var React = require('react/addons');
var expect:Chai.ExpectStatic = require('chai').expect;

var spotlightData = require('./data/spotlight-output');
import {Spotlight} from '../src/app/components/spotlight';

describe('Spotlight', function(){
  var server;
  
  beforeEach(function(){
    server = sinon.fakeServer.create();
    server.respondWith(
      [
        200, 
        {"Content-Type":"application/json"}, 
        JSON.stringify(spotlightData)
      ]);  
      
    let { TestUtils } = React.addons;
    
    this.TestUtils = TestUtils;
    this.component = TestUtils.renderIntoDocument(<Spotlight />);
    this.renderedDOM = (element) => React.findDOMNode(element);     
  });
    
  afterEach(function(){
    server.restore();
  });
  it('should render <p> with Message', function(done){
    let spotlight = this.component;
    let p = this.renderedDOM(spotlight).querySelectorAll('p');
    expect(p.length).to.equal(1);
    
    // let interval = setInterval( ()=>{
    //   if (p[0].textContent !== ''){
    //     console.log(p[0].textContent);  
    //     //expect(p[0].textContent).to.not.equal('');      
    //     clearInterval(interval);
    //   }       
    // }, 1)
    
    server.respond();
    done();    
  });
  
  it('should render <a> with Url', function(done){
    let spotlight = this.component;
    let a = this.renderedDOM(spotlight).querySelectorAll('a');
    expect(a.length).to.equal(1);
    
    // let interval = setInterval( ()=>{
    //   if (a[0].href !== ''){
    //     console.log(a[0].href);  
    //     //expect(a[0].href).to.not.equal('');      
    //     clearInterval(interval);
    //   }       
    // }, 1)
    
    server.respond();
    done(); 
  }); 
  
});