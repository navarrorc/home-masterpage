
import * as React from 'react';
import { fileImages } from '../../../services/shared';
import { findDOMNode } from 'react-dom';

var Modal = require('react-modal');

declare var unescape: any;

const customStyles = {
    overlay : {
        // position          : 'absolute',
        border: 'solid 2px red',
        width:0,
        height:0,
        // top               : 0,
        // left              : 0,
        // right             : 0,
        // bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)',
        zIndex: 100,       
    },
    content : {    
            top                   : -500,
            left                  : -500,
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(25%, -90%)',
            backgroundColor: 'transparent',
            border: 0
        }
}

/***
 * Child Component
 */

interface StateValues{
  isModalOpen?: boolean,
  isImageReady?: boolean,
  isImageLoadingError?: boolean,
  document?: {name:string, url:string},
  mouseX?: number,
  mouseY?: number 
}
export class Results extends React.Component<any, StateValues> {
    constructor(props:any) {
        super(props);
        this.state = { isModalOpen: false, isImageReady: false, isImageLoadingError: false };
        
        /* Do the binding here to gain performance by Cory House (Pluralsight)*/
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.imageLoaded = this.imageLoaded.bind(this);
        this.imageLoadError = this.imageLoadError.bind(this);
    }

    /**
     * Events Handlers
     */
    handleItemClick(document) {      
        this.setState({
            isModalOpen: true,
            isImageReady: false,
            document
        })
    }
    handleMouseEnter(document, evt) {
        // console.log(evt);
        let mouseX = evt.clientX,
            mouseY = evt.clientY;
        
        console.log(mouseX, mouseY);
        
        this.setState( {
            isModalOpen: true,
            isImageReady: false,
            isImageLoadingError: false,
            document,
            mouseX,
            mouseY
        })
    }
    handleMouseLeave(){
        this.setState({ isModalOpen:false })
    }
    handleModalRequestClose(){
        this.setState({ isModalOpen:false })
    }
    handleCloseModalClick() {
        this.setState({ isModalOpen: false });
    }
    imageLoaded() {
        console.log('image loaded!');
        this.setState({ isImageReady: true })
    }
    imageLoadError() {
        console.log('image load error!');
        this.setState({ isImageReady:true, isImageLoadingError:true })
    }
    /**
     * Methods
     */
    renderSpinner() {
        if (this.state.isImageReady)
            return null
        
        let ready = this.state.isImageReady;
        return <div style={{ textAlign: 'center', position:'absolute', top:200,left:74 }}>
                    <i className="fa fa-spinner fa-pulse" style={{ display: ready? 'none': 'inline-block' , textAlign: 'center', width: '1.28571429em', fontSize: '3em' }}></i>
                    <span style={{ display: 'block' }}>{ready ? '' : 'Generating Preview...'}</span>
                </div>
    }
    renderNoPreviewAvailable(){
        if (!this.state.isImageLoadingError)
            return null
        
        let imageError = this.state.isImageLoadingError;
        return <div style={{ textAlign: 'center', position:'absolute', top:200,left:74}}>
                    <span style={{ display: 'block' }}>{imageError? 'No preview available.': ''}</span>
                </div>

    }
    renderModal() {
        if (!this.state.isModalOpen) {
            return null;
        }

        let absoluteUrl = _spPageContextInfo.webAbsoluteUrl;
        let name = this.state.document.name;
        let url = encodeURI(this.state.document.url);
        
        let pieces = name.split('.');
        //let fileExtension = pieces[pieces.length-1];

        let strDocUrl = `${absoluteUrl}/_layouts/15/getpreview.ashx?path=${url}`;

        // if (<fileExt></fileExt>ension=='doc' || fileExtension=='docx' || fileExtension=='xls' || fileExtension=='xlsx' ) {
        //     /**TODO: make this strDocUrl more dynamic, do not hardcode the /sites/documents/marketing/ */
        //     var strDocUrl = `${absoluteUrl}/_layouts/15/WopiFrame.aspx?sourcedoc=${url}&action=embedview`;
        // } 
        // else {
        //     var strDocUrl = `${url}`;
        // } 

        // console.log(strDocUrl);
        
        let mouseX = this.state.mouseX,
            mouseY = this.state.mouseY;

        let bodyOffsets = window.document.body.getBoundingClientRect();
        let tempX = mouseX - bodyOffsets.left;
        let tempY = mouseY - bodyOffsets.top;
        setTimeout( ()=>{
            console.log('inside setTimeout()');
            /**jQuery */
            // TODO: get rid of this and find a better Reactive way.
            $('.ReactModal__Content--after-open').css({'top':tempY,'left':tempX}).fadeIn('slow');
        },100);

        return <div>                
                <div style={
                    {
                        backgroundColor: '#000', 
                        color: '#fff', 
                        textAlign:'center',
                        borderTopLeftRadius: 3, 
                        borderTopRightRadius: 3
                    }
                }>
                    <strong>{name}</strong>
                </div>                
                <div>
                    {this.renderSpinner()}
                    {this.renderNoPreviewAvailable()}
                    <img onLoad={this.imageLoaded} onError={this.imageLoadError} 
                        style={
                            {
                                backgroundColor: '#000',
                                border: 'solid 2px #000', 
                                borderTop: 0,
                                minHeight:350, 
                                minWidth:250,
                                borderBottomLeftRadius: 3, 
                                borderBottomRightRadius: 3
                            }
                        }
                     src={strDocUrl} alt="Preview Image" />
                </div>   
                <div style={{height:36}}></div>           
            </div>
        // return <div>
        //         <h2 style={{textAlign:'center'}}>{name}</h2>
        //         <div id="OpenRelativeCard" style={{margintLeft: 10}}>
        //             <iframe src={strDocUrl} id="LSViewDocInTask" style={{width:700, height:800}}></iframe>
        //         </div>
        //         <button type="button" onClick={this.handleCloseModalClick.bind(this)}>
        //             Close
        //         </button>
        //     </div>
    }

    getItem = (item, index) => {
        let pieces = item.name.split('.');
        let fileExtension = pieces[pieces.length - 1];

        let imageUrl;
        _.each(fileImages, (i) => {
            if (i.key === fileExtension) {
                imageUrl = i.value;
            }
        })

        let fullName = unescape(item.name);
        let fileUrl = unescape(item.url);
        
        return <div className="document-accordion-group" key={index}>
                <div>
                    <PreviewButton 
                        fullName = {fullName}
                        fileUrl = {fileUrl}
                        imageUrl = {imageUrl}
                        onClick = {this.handleItemClick }  
                        onMouseEnter = {this.handleMouseEnter }                      
                        onMouseLeave = {this.handleMouseLeave }                      
                    />                    
                    <a href={fileUrl}  target="_blank">{fullName}</a>
                    
                </div>
            </div>
    }

    generateResult = (items, key) => {
        let sortedItems = _.orderBy(items, ['name'], ['asc']);
        return  <div className="col-xs-6" key={key}>
                    <div className="document-accordion">
                        <div className="document-accordion-link">
                            {`${key}(${sortedItems.length})`} <i className="icon icon-arrow-down"></i>
                        </div>
                        {_.map(sortedItems, this.getItem) }
                    </div>
                </div>
    }
    
    render () {
        let totalItems = this.props.totalItems;
        let ready = this.props.ready;
        let groupedItems = this.props.groupedItems;
        
        return <div>
                <h2 className="margin-bottom-30">Documents {(totalItems) ? `(${totalItems})` : ''}</h2>
                <h3>All Documents</h3>
                <div style={{ textAlign: 'center' }}>
                    <i className="fa fa-spinner fa-pulse" style={{ display: ready ? 'none' : 'inline-block', textAlign: 'center', width: '1.28571429em', fontSize: '3em' }}></i>
                    <span style={{ display: 'block' }}>{ready ? '' : 'Working on it...'}</span>
                </div>
                <div className="row margin-bottom-20">
                    {_.map(groupedItems, this.generateResult) }
                </div>
                <Modal isOpen={this.state.isModalOpen} onRequestClose={this.handleModalRequestClose.bind(this)}
                    style={customStyles} >                    
                    {this.renderModal()}
                    
                    <div className="hover-arrow"></div>
                    
                </Modal>
            </div>
    }
}

/***
 * Child Component (stateless)
 */
interface PropsValue {
    fullName:string, 
    fileUrl:string,
    imageUrl:string,
    onClick:any,
    onMouseEnter:any,
    onMouseLeave:any
}
const PreviewButton = (props: PropsValue) => {
    let handleClick = () => {
        if (props.onClick) {
            let document = {
                name: props.fullName,
                url: props.fileUrl
            }
            props.onClick(document);
        }
    }

    let handleMouseEnter = (evt) => {
        if (props.onMouseEnter) {
            let document = {
                name: props.fullName,
                url: props.fileUrl
            }
            props.onMouseEnter(document,evt);
        }
    }

    let handleMouseLeave = () => {
        if (props.onMouseLeave) {
            props.onMouseLeave();
        }
    }
    
    return	<div style={{ display:'inline-block', marginRight:10 }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
                <a title={props.fullName} style={{border:0, color:'#000'}} href="#">
                    <img style={{ position: 'relative', top: 5, marginRight: 2 }} src={props.imageUrl}></img>
                </a>
        </div>    

    // return	<div style={{ display:'inline-block', marginLeft:10 }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
    //             <a className="ms-lstItmLinkAnchor ms-ellipsis-a" title="Open Preview dialog for selected item"
    //             style={{border:0}} href="#">
    //             <img className="ms-ellipsis-icon" 
    //                 style={{maxWidth:'none'}} 
    //                 src="/_layouts/15/images/spcommon.png?rev=43" 
    //                 alt="Open Preview"/>
    //             </a>
    //     </div>

}