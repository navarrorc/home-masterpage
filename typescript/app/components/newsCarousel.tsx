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
          <h1 style={{position:'absolute', left: '34%'}}>News Carousel</h1>
          <img style={{width: '100%', height: '350px'}} src={this.props.imgUrl}></img>
        </div>
      )
    }
    showComponent() {
      React.render(
        <NewsCarousel imgUrl={this.props.imgUrl}>
        </NewsCarousel>
        ,document.querySelector('.newsCarousel'));
    }
  }
