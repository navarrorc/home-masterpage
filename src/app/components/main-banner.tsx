import * as React from 'react';
import { render } from 'react-dom';

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
    render(
      <MainBanner />,
      document.querySelector('.mainBanner'));
  }
}
