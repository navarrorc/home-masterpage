//import React = require('react');

interface bannerProps {
  // TODO: create properties for MainBanner Component to use
}

export class MainBanner extends React.Component<any, any> {
  private foo: number;
  constructor(props:any){
    super(props);
  }
  render() {
    return (
      <div>
        <h1 style={{position:'absolute', left: '40%'}}>Main Banner</h1>
      </div>
    )
  }
  showComponent() {
    React.render(
      <MainBanner />,
      document.querySelector('.mainBanner'));
  }
}
