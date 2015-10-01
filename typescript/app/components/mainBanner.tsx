  interface bannerProps {
    //name:string;
    //age:number;
    //imgUrl: string;
  }

  export class MainBanner extends React.Component<bannerProps, any> {
    private foo: number;
    constructor(props:bannerProps){
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
        <MainBanner />
        ,document.querySelector('.mainBanner'));
    }
  }
