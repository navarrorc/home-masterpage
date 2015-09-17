/// <reference path="../../typings/tsd.d.ts"/>
chai.should();

describe("Lorem Ipsum", () => {
  beforeEach(()=>{
    $("body").append("<div id='O365_MainLink_Logo'/>");
    $("#O365_MainLink_Logo").html(myTemplate);
  });

  afterEach(()=>{
    $("#O365_MainLink_Logo").remove();
  });



  it("Dolor", () =>{
    var greeter = new myModule.Greeter("Roberto");
    //console.log(greeter.greet());
    greeter.greet().should.equal("Hello, Roberto!");
  });

  it("something", ()=>{
    // console.log($('#O365_MainLink_Logo').length);
    // console.log($('#O365_MainLink_Logo').html());
    // $('#O365_MainLink_Logo').html("<a href='/sites/rushnet'><img src='/sites/rushnet/SiteAssets/rushlogo.PNG' class='companyLogo'></a>");
  })
});
