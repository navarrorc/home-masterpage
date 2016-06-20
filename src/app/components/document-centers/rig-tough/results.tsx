
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
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
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
            backgroundColor: 'rgba(220, 220, 220, 0.74902)',
            // padding: 0,
            overflowY:'hidden',
            overflowX:'hidden',
            border: 0,
            borderRadius:16
            //border:  '1px solid #ccc',
        }
}

/**
 * detect IE
 * This returns true for any version of Internet Explorer
 */
function isIE(userAgent=navigator.userAgent) {
  return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;
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
    }

    /**
     * Events Handlers
     * Using Arrow functions to avoid having to bind 'this'
     */
    handleItemClick = (evt, document) => {      
        let mouseX = evt.clientX,
            mouseY = evt.clientY;
        // console.log(mouseX, mouseY);
        
        if (this.state.isModalOpen && _.isEqual(document, this.state.document)){
            this.setState( {
                // isImageReady: true,
                mouseX,
                mouseY
            })
            return;
        }

        this.setState( {
            isModalOpen: true,
            isImageReady: false, // TODO: fix!
            isImageLoadingError: false,
            document,
            mouseX,
            mouseY
        })
        // console.log(evt);
        evt.preventDefault(); // necessary to preventing IE from scrolling to top of page
    }
    handleMouseEnter = (evt, document)=> {
        if (isIE())
            return;
        
        let mouseX = evt.clientX,
            mouseY = evt.clientY;
        // console.log(mouseX, mouseY);
 
        this.setState( {
            isModalOpen: true,
            isImageReady: false,
            isImageLoadingError: false,
            document,
            mouseX,
            mouseY
        })
    }
    handleMouseLeave = () => {
        this.setState( {
            isModalOpen: false,
            isImageReady: false, // TODO: fix!
            isImageLoadingError: false,
        })
    }
    handleModalRequestClose = () => {
        this.setState({ isModalOpen:false })
    }
    handleCloseModalClick = (evt) => {
        this.setState({ isModalOpen: false });
        evt.preventDefault(); // necessary to preventing IE from scrolling to top of page
    }
    imageLoaded = () => {
        // console.log('image loaded!');
        this.setState({ isImageReady: true })
    }
    imageLoadError = () => {
        // console.log('image load error!');
        this.setState({ isImageReady:true, isImageLoadingError:true })
    }
    /**
     * Methods
     */
    renderSpinner() {
        if (this.state.isImageReady)
            return null
        
        let ready = this.state.isImageReady;
        return <div style={{ 
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems: 'center',
                        position:'absolute', 
                        top:67,
                        left:23,
                        width:'84%',
                        height:'78%',
                        borderBottomLeftRadius:3,
                        borderBottomRightRadius:3,
                        backgroundColor:'rgba(255, 255, 255, 1)' 
                    }}>
                    <i className="fa fa-spinner fa-pulse" style={{ 
                        textAlign: 'center',
                        display: 'inline-block' , 
                        width: '1.28571429em', 
                        fontSize: '2em' 
                    }}></i>
                </div>
    }
    renderNoPreviewAvailable(){
        if (!this.state.isImageLoadingError)
            return null
        
        let imageError = this.state.isImageLoadingError;
        return <div style={{ 
            	            display:'flex',
                            flexDirection:'column',
                            justifyContent:'center',
                            alignItems: 'center',
                            position:'absolute', 
                            top:67,
                            left:23,
                            width:'84%',
                            height:'78%',
                            backgroundColor:'rgba(255, 255, 255, 1)',
                            //height:348,
                            //width:248,
                            borderBottomLeftRadius:3,
                            borderBottomRightRadius:3
                    }}>
                    <span style={{ 
                        display: 'block' 
                    }}>No preview available.</span>
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
            /**jQuery */
            // TODO: get rid of this and find a better Reactive way.
            $('.ReactModal__Content--after-open').css({'top':tempY,'left':tempX}).fadeIn('slow');
        },100);

        return <div>                
                <div style={{
                        backgroundColor: '#ccc', 
                        color: '#000', 
                        textAlign:'center',
                        border: '1px solid #ccc',
                        borderTopLeftRadius: 3, 
                        borderTopRightRadius: 3,
                    }}>
                    <strong>{name}</strong>
                </div>                
                <div>
                    {this.renderSpinner()}
                    {this.renderNoPreviewAvailable()}
                    <img onLoad={this.imageLoaded} onError={this.imageLoadError} 
                        style={{
                                backgroundColor: '#fff',
                                border: '1px solid #ccc', 
                                // borderTop: 0,
                                minHeight:350, 
                                minWidth:250,
                                maxWidth:270,
                                borderBottomLeftRadius: 3, 
                                borderBottomRightRadius: 3
                        }}
                     src={strDocUrl} alt="Preview Image" />                     
                </div>   
            </div>

            // <div style={{height:36}}></div> 
        // return <div>
        //         <h2 style={{textAlign:'center'}}>{name}</h2>
        //         <div id="OpenRelativeCard" style={{margintLeft: 10}}>
        //             <iframe src={strDocUrl} id="LSViewDocInTask" style={{width:700, height:800}}></iframe>
        //         </div>
                    // <button type="button" onClick={this.handleCloseModalClick}>
                    //     Close
                    // </button>
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
                <Modal ref="modal" isOpen={this.state.isModalOpen} onRequestClose={this.handleModalRequestClose}
                    style={customStyles} >                    
                    {this.renderModal()}
                </Modal>
            </div>
            //<div className="hover-arrow"></div>
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
    let handleClick = (evt) => {
        if (props.onClick) {
            let document = {
                name: props.fullName,
                url: props.fileUrl
            }
            props.onClick(evt,document);
        }
    }

    let handleMouseEnter = (evt) => {
        if (props.onMouseEnter) {
            let document = {
                name: props.fullName,
                url: props.fileUrl
            }
            props.onMouseEnter(evt,document);
        }
    }

    let handleMouseLeave = () => {
        if (props.onMouseLeave) {
            props.onMouseLeave();
        }
    }
    
    return	<div style={{ display:'inline-block', marginRight:10 }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
                <a title={props.fullName} style={{border:0, color:'#000'}} href="#">
                    <img style={{ 
                            position: 'relative', 
                            top: 5, 
                            marginRight: 2 
                        }} 
                        src={props.imageUrl}>
                    </img>
                </a>
                <i className="fa fa-search doc-preview-icon" aria-hidden="true"></i>
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