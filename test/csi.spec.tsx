var React = require('react/addons');
var expect:Chai.ExpectStatic = require('chai').expect;
//var TestUtils = require('react/lib/ReactTestUtils');

var csiData = require('./data/csi-output');
import {CSI} from '../src/app/components/csi';


describe('Customer Satisfaction Index', function(){
  var server;
  
  beforeEach(function(){
    server = sinon.fakeServer.create();
    server.respondWith(
      [
        200, 
        {"Content-Type":"application/json"}, 
        JSON.stringify(csiData)
      ]);  
      
    let { TestUtils } = React.addons;
    
    this.TestUtils = TestUtils;
    this.component = TestUtils.renderIntoDocument(<CSI />);
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
    //     expect(image[0].src).to.equal('https://rushnetrcn.sharepoint.com/sites/rushnet/CSI/8057-1215%20RushNet%20grapics_Customer%20Satisfaction%20Index%202-1-164.png');      
    //     clearInterval(interval);
    //   }       
    // }, 1)
    
    server.respond();    
    done();
  });
  
  it('should render <h1> with text', function(){
    let csi = this.component; 
    let h1 = this.renderedDOM(csi).querySelectorAll('h1');
    expect(h1[0].textContent).to.equal('Customer Satisfaction Index');

    //server.respond(); 
    //done();
  });  
  
  // it('should show the image Url', function(done){
  //   let renderer = this.TestUtils.createRenderer();
  //   renderer.render(<CSI />);
  //   let result = renderer.getRenderOutput();
  //   expect(result.type).to.equal('div');
  //   console.log(JSON.stringify(result.props,null,4));
    
    
  //   // expect(result.props.className).to.equal('hello');
  //   // console.log(result.props.children.props.item);
  //   // console.log(JSON.stringify(result.props.children,null,4));
  //   // result.props.children.forEach( (image, index)=>{
      
  //   // })
    
  //   // let component = this.TestUtils.findRenderedDOMComponentWithTag(this.compoment, 'img');
  //   // let component = this.TestUtils.scryRenderedDOMComponentsWithTag(this.compoment, 'img');
    
    
  //   //console.log(component[0]);
  //   // component.props.children.forEach( ( img, index )=> {
  //   //   console.log(img.props.item);      
  //   // })
  //   // expect(image.props.item).to.equal()
  //   // expect(h1[0].textContent).to.equal('Customer Satisfaction Index');
  //   server.respond(); 
  //   done();
  // });
})