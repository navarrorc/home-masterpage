
import * as React from 'react';
import { fileImages } from '../../../services/shared';
import { findDOMNode } from 'react-dom';
import { customStyles } from './modal-styles';

const Modal = require('react-modal');
const classNames = require('classnames');
const CSSModules = require('react-css-modules');
const styles = require('./rig-tough.scss');

declare var unescape: any;

/**
 * detect IE
 * This returns true for any version of Internet Explorer
 */
function isIE(userAgent=navigator.userAgent) {
  return userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1 || userAgent.indexOf('Edge/') > -1;
}


/***
 * Results Component
 */
interface StateValues{
  isModalOpen?: boolean,
  isImageReady?: boolean,
  isImageLoadingError?: boolean,
  document?: {name:string, url:string},
  mouseX?: number,
  mouseY?: number 
}

@CSSModules(styles, {errorWhenNotFound: true, allowMultiple: true})
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
        return <div styleName="results-spinner-div">
                    <i className="fa fa-spinner fa-pulse" style={{ fontSize: '2em' }} />
                </div>
    }
    renderNoPreviewAvailable() {
        if (!this.state.isImageLoadingError)
            return null
        
        let imageError = this.state.isImageLoadingError;
        return <div styleName="results-noPreview">
                    <span>No preview available.</span>
               </div>

    }
    renderModal() {
        if (!this.state.isModalOpen) {
            return null;
        }

        let absoluteUrl = _spPageContextInfo.webAbsoluteUrl;
        let name = this.state.document.name;
        let url = this.state.document.url;
        let docLibraryUrl = url.replace(name,''); // .../sites/Documents/Marketing/Rig Tough/
        
        // encodes the following characters: , / ? : @ & = + $ #
        // some file names can contain the: +
        let encodedUrl = docLibraryUrl + encodeURIComponent(name); // see: https://goo.gl/j90OLQ
        let strDocUrl = `${absoluteUrl}/_layouts/15/getpreview.ashx?path=${encodedUrl}`;

        return <div>                
                <div styleName="doc-title-div">
                    <strong>{name}</strong>
                </div>                
                <div>
                    {this.renderSpinner()}
                    {this.renderNoPreviewAvailable()}
                    <img onLoad={this.imageLoaded} onError={this.imageLoadError} 
                        styleName="doc-preview-image"
                         src={strDocUrl} alt="Preview Image" />                     
                </div>                   
            </div>    
    }
    positionModal(mouseX, mouseY) {       
        let bodyOffsets = window.document.body.getBoundingClientRect();
        let tempX = mouseX - bodyOffsets.left;
        let tempY = mouseY - bodyOffsets.top;
        /**jQuery */
        // TODO: get rid of this and find a better Reactive way.
        $('.ReactModal__Content--after-open').css({'top':tempY,'left':tempX}).fadeIn('slow');
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
        let mouseX = this.state.mouseX,
            mouseY = this.state.mouseY;
        
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
                    {this.positionModal(mouseX, mouseY)}
                </Modal>
            </div>
    }
}

/***
 * Preview Button Component (stateless)
 */
interface PropsValue {
    fullName:string, 
    fileUrl:string,
    imageUrl:string,
    onClick:any,
    onMouseEnter:any,
    onMouseLeave:any
}

let PreviewButton;  // CSSModules() used after this component declaration, see below!
PreviewButton = (props: PropsValue) => {
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
    let iconCssClasses = classNames('fa','fa-search');
    return	<div styleName='preview-div' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} 
                onClick={handleClick}>
                    <a title={props.fullName} styleName='preview-anchor' href='#'>
                        <img styleName='preview-image' src={props.imageUrl} />
                    </a>
                    <i className={iconCssClasses} styleName='preview-icon' aria-hidden="true" />
            </div>    

}
//see: https://github.com/gajus/react-css-modules#loops-and-child-components
PreviewButton = CSSModules(PreviewButton, styles);
