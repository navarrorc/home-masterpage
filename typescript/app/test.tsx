// /// <reference path="../../typings/react/react-global.d.ts"/>
// module myReactModule {
//   class DemoProps {
//     public name:string;
//     public age:number;
//   }
//
//   class Demo extends React.Component<DemoProps, any> {
//     private foo: number;
//     constructor(props:DemoProps){
//       super(props);
//       this.foo = 42;
//       //props.age = 32;
//     //  props.name = 'Roberto';
//
//     }
//     render() {
//       return (
//         <h1>My Name is {this.props.name} and I am {this.props.age} years old. </h1>,
//         <p>foo: {this.foo} </p>
//       );
//     }
//   }
//
//   $(()=>{
//     React.render(
//       <div>
//         <h1>Hello World</h1>
//         <Demo name="Roberto C. Navarro" age={33} />
//       </div>
//       , document.getElementById('s4-titlerow'));
//   })
// }
