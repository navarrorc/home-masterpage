var React = require('react/addons');
var expect:Chai.ExpectStatic = require('chai').expect;
//var TestUtils = require('react/lib/ReactTestUtils');

var bannerData = require('./data/home-banner-output');
import {HomeBanner} from '../src/app/components/home-banner';


describe('Home Banner', function(){
  var server;
  
  beforeEach(function(){
    server = sinon.fakeServer.create();
    server.respondWith(
      [
        200, 
        {"Content-Type":"application/json"}, 
        JSON.stringify(bannerData)
      ]);  
      
    let { TestUtils } = React.addons;
    
    this.TestUtils = TestUtils;
    this.component = TestUtils.renderIntoDocument(<HomeBanner />);
    this.renderedDOM = (element) => React.findDOMNode(element);     
  });
    
  afterEach(function(){
    server.restore();
  });
  
  it('should render one <img>', function(done){
    let csi = this.component; 
    let image = this.renderedDOM(csi).querySelectorAll('img');
    expect(image.length).to.equal(1);    
    
    // let interval = setInterval( ()=>{
    //   if (image[0].src !== ''){
    //     console.log(image[0].src);  
    //     // expect(image[0].src).to.equal('https://rushnetrcn.sharepoint.com/sites/rushnet/CSI/8057-1215%20RushNet%20grapics_Customer%20Satisfaction%20Index%202-1-164.png');      
    //     clearInterval(interval);
    //   }       
    // }, 1)
    
    server.respond();    
    done();
  }); 
  
})