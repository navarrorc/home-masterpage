var expect:Chai.ExpectStatic = require('chai').expect;
import {NewsFeed} from '../src/app/services/news-feed';
var newsData = require('./data/news-articles.json'); 

describe('News Carousel', function(){
  var server;
  
  beforeEach(function(){
    server = sinon.fakeServer.create();
    server.respondWith(
      [
        200, 
        {"Content-Type":"application/json"}, 
        JSON.stringify(newsData)
      ]);  
  });
    
  afterEach(function(){
    server.restore();
  });
  
  it('should return ONLY 5 news stories',function(done){ 
    let feed = new NewsFeed();
    var async = feed.getSearchResults('Rush News');
    
    async.done(function(data:any){
      //console.log(JSON.stringify(data,null,4));
      expect(data.length).to.be.equal(5);
      done();
    })    
    server.respond(); // !important, have the fakeServer respond    
  });
  
  it('should return news stories in descending order',function(done){
    let feed = new NewsFeed();
    var async = feed.getSearchResults('Rush News');
    
    async.done(function(data:any){
      let valid = false;
             
      for (let i = 0; i < data.length; i++){
        if( i != data.length-1){ // to make sure we are not at the last element
          if( new Date(data[i].pubStartDate).getTime() >= 
              new Date(data[i+1].pubStartDate).getTime() ) {
            valid = true;
          } else {
            valid = false; 
            break; // breaks the loop and continues executing the code after the loop
          }
        }        
      }
      expect(valid).to.be.equal(true);
      done();
    })    
    server.respond(); // !important, have the fakeServer respond 
  });
})