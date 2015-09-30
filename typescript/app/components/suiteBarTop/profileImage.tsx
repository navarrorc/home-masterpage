module C {
  // Interfaces
  interface imageProps {
    // TODO: add properties if needed, see https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html
    imgUrl: string;
    visible: boolean;
  }

  // Component Class
  export class ProfileImage extends React.Component<imageProps, any> {
    private foo: number;
    //private isUnmounted: boolean;
    constructor(props: imageProps){
      super(props);
    }

    render() {
      console.info("inside render() imgUrl:", this.props.imgUrl);
      //"https://pbs.twimg.com/profile_images/378800000247666963/9b177e5de625a8420dd839bb1561280d.jpeg";
      return (
        <img src={this.props.imgUrl}
          style={this.props.visible? {visibility: 'visible'} : {visibility: 'hidden'}}
          className="profileImage" alt="">
        </img>
      );
    }
  }
}
