
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

@CSSModules(styles, { errorWhenNotFound: true, allowMultiple: true })
export class Results extends React.Component<any, StateValues> {
    constructor(props: any) {
        super(props);
        /**
         * State Init
         */
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

        if (this.state.isModalOpen && _.isEqual(document, this.state.document)) {
            this.setState({
                // isImageReady: true,
                mouseX,
                mouseY
            })
            return;
        }

        this.setState({
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
    handleMouseEnter = (evt, document) => {
        if (isIE())
            return;

        let mouseX = evt.clientX,
            mouseY = evt.clientY;
        // console.log(mouseX, mouseY);

        this.setState({
            isModalOpen: true,
            isImageReady: false,
            isImageLoadingError: false,
            document,
            mouseX,
            mouseY
        })
    }
    handleMouseLeave = () => {
        this.setState({
            isModalOpen: false,
            isImageReady: false,
            isImageLoadingError: false,
        })
    }
    handleModalRequestClose = () => {
        this.setState({ isModalOpen: false })
    }
    handleCloseModalClick = (evt) => {
        this.setState({ isModalOpen: false });
        evt.preventDefault(); // necessary to preventing IE from scrolling to top of page
    }
    imageLoaded = () => {
        this.setState({ isImageReady: true })
    }
    imageLoadError = () => {
        this.setState({ isImageReady: true, isImageLoadingError: true })
    }
    /**
     * Methods
     */
    renderSpinner() {
        let ready = this.state.isImageReady;
        if (ready)
            return null

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
        let docLibraryUrl = url.replace(name, ''); // .../sites/Documents/Marketing/Rig Tough/

        // encodes the following characters: , / ? : @ & = + $ #
        // some file names can contain the: +
        let encodedUrl = docLibraryUrl + encodeURIComponent(name); // see: https://goo.gl/j90OLQ
        let strDocUrl = `${absoluteUrl}/_layouts/15/getpreview.ashx?path=${encodedUrl}`;

        setTimeout(() => {
            // making this async, we want it to run after the modal is rendered, see: http://goo.gl/JtORp2
            this.positionModal(this.state.mouseX, this.state.mouseY);
        }, 0)

        return <div>
            <div styleName="doc-title-div">
                <strong>{name}</strong>
            </div>
            <div>
                {this.renderSpinner() }
                {this.renderNoPreviewAvailable() }
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
        $('.ReactModal__Content--after-open').css({ 'top': tempY, 'left': tempX }).fadeIn('slow');
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

        let style = {
            width: '100%',
            margin: 'auto 0'            
        }

        return <div className="document-row" key={index}>
            <div className="doc-check"><i className="icon icon-check"></i></div>
            <PreviewButton
                fullName = {fullName}
                fileUrl = {fileUrl}
                imageUrl = {imageUrl}
                onClick = {this.handleItemClick }
                onMouseEnter = {this.handleMouseEnter }
                onMouseLeave = {this.handleMouseLeave }
                />
            <div className="doc-name" style={style}>
                <a href={fileUrl} styleName="document-name" target="_blank">{fullName}</a>
            </div>
        </div>

    }

    getClassification = (classification, key) => {
        let total_documents = classification.length;

        return <div className="document-accordion-group" key={key}>
            <div className="document-accordion-group-link">{`${key} (${total_documents})`}  <i className="icon icon-arrow-down" /></div>
            <div className="document-rows">
                {_.map(classification, this.getItem) }
            </div>
        </div>
    }

    generateResult = (group, key) => {
        let total_documents = 0;
        _.each(group, (classifications)=>{
            total_documents += classifications.length;
        });
        
        return <div className="col-xs-6" key={key}>
            <div className="document-accordion" key={key}>
                <div className="document-accordion-link">
                    {`${key} (${total_documents})`} <i className="icon icon-arrow-down"></i>
                </div>
                {_.map(group, this.getClassification) }
            </div>
        </div>
    }

    render() {
        let totalItems = this.props.totalItems;
        let ready = this.props.ready;
        let groupedItems = this.props.groupedItems;
        let mouseX = this.state.mouseX,
            mouseY = this.state.mouseY;

        // console.log(JSON.stringify(groupedItems,null,4));

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
                {this.renderModal() }
            </Modal>
        </div>
    }
} /* class Results */

/***
 * Preview Button Component (stateless)
 */
interface PropsValue {
    fullName: string
    fileUrl: string
    imageUrl: string
    onClick: any
    onMouseEnter: any
    onMouseLeave: any
}

let PreviewButton;  // CSSModules() used after this stateless component's declaration, see below!
PreviewButton = (props: PropsValue) => {
    let handleClick = (evt) => {
        if (props.onClick) {
            let document = {
                name: props.fullName,
                url: props.fileUrl
            }
            props.onClick(evt, document);
        }
    }

    let handleMouseEnter = (evt) => {
        if (props.onMouseEnter) {
            let document = {
                name: props.fullName,
                url: props.fileUrl
            }
            props.onMouseEnter(evt, document);
        }
    }

    let handleMouseLeave = () => {
        if (props.onMouseLeave) {
            props.onMouseLeave();
        }
    }
    let iconCssClasses = classNames('fa', 'fa-search');
    return <div styleName='preview-div' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
        onClick={handleClick}>
        <i className={iconCssClasses} styleName='preview-icon' aria-hidden="true" />
        <a title={props.fullName} styleName='preview-anchor' href='#'>
            <img styleName='preview-image' src={props.imageUrl} />
        </a>

    </div>

}
//see: https://github.com/gajus/react-css-modules#loops-and-child-components
PreviewButton = CSSModules(PreviewButton, styles);
