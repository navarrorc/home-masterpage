module C {
  interface carouselProps {
    //name:string;
    //age:number;
    imgUrl: string;
  }

  export class NewsCarousel extends React.Component<carouselProps, any> {
    private foo: number;
    constructor(props:carouselProps){
      super(props);
      this.foo = 42;
      //this.props.imgUrl = 'https://rushenterprises.sharepoint.com/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/Page-Layouts/images/newsCarousel.png';
      //props.age = 32;
     //props.name = 'Roberto';

    }
    render() {
      return (
        <div>
          <img style={{width: '100%'}} src={this.props.imgUrl}></img>
        </div>
      );
    }
    showComponent() {
      React.render(
        <NewsCarousel imgUrl={this.props.imgUrl}>
        </NewsCarousel>
        ,document.querySelector('.newsCarousel'));
    }
  }
}
