
import * as React from 'react';
import { fileImages } from '../../../services/shared';
import { findDOMNode } from 'react-dom';

var Modal = require('react-modal');

declare var unescape: any;

const customStyles = {
    overlay : {
        position          : 'absolute',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)',
        //backgroundColor: 'red',
        zIndex: 100
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
}

/***
 * Child Component
 */
// export const Results = (props)=> {
export class Results extends React.Component<any, any> {
    constructor(props:any) {
        super(props);
        //this.state = { modalIsOpen: false }
        this.state = {};
        
        /* Do the binding here to gain performance by Cory House (Pluralsight)*/
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    /**
     * Events Handlers
     */
    handleItemClick(document) {
        // console.log(evt);
        // let xPosition = evt.clientX,
        //     yPosition = evt.clientY;
        
        this.setState( {
            isModalOpen: true,
            document
        })
    }
    handleModalRequestClose(){
        this.setState({ isModalOpen:false })
    }
    handleCloseModalClick() {
        this.setState({ isModalOpen: false });
    }
    /**
     * Methods
     */
    renderModal() {
        if (!this.state.isModalOpen) {
            return null;
        }
        let name = this.state.document.name;
        let url = this.state.document.url;

        // let encodedUri = encodeURI(url);
        // console.log(encodedUri);
        
        let pieces = name.split('.');
        let fileExtension = pieces[pieces.length-1];
        //console.log(fileExtension);

        if (fileExtension=='doc' || fileExtension=='docx' || fileExtension=='xls' || fileExtension=='xlsx' ) {
            /**TODO: make this strDocUrl more dynamic, do not hardcode the /sites/documents/marketing/ */
            var strDocUrl = `/sites/documents/marketing/_layouts/15/WopiFrame.aspx?sourcedoc=${url}&action=embedview`;
        } 
        else {
            var strDocUrl = `${url}`;
        } 
        
        //console.log(strDocUrl);
        

        return <div>
                <h2 style={{textAlign:'center'}}>{name}</h2>
                <div id="OpenRelativeCard" style={{margintLeft: 10}}>
                    <iframe src={strDocUrl} id="LSViewDocInTask" style={{width:700, height:800}}></iframe>
                </div>
                <button type="button" onClick={this.handleCloseModalClick.bind(this)}>
                    Close
                </button>
            </div>
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
                    <img style={{ position: 'relative', top: 5, marginRight: 2 }} src={imageUrl}></img>
                    <a href={fileUrl}  target="_blank">{fullName}</a>
                    <PreviewButton 
                        fullName = {fullName}
                        fileUrl = {fileUrl}
                        onClick = {this.handleItemClick }
                    />
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
                </Modal>
            </div>
    }
}

/***
 * Child Component (stateless)
 */
const PreviewButton = (props) => {

    let handleClick = () => {
        if (props.onClick) {
            let document = {
                name: props.fullName,
                url: props.fileUrl
            }
            props.onClick(document);
        }
    }

    return	<div style={{ display:'inline-block', marginLeft:10 }} onClick={handleClick}>
                <a className="ms-lstItmLinkAnchor ms-ellipsis-a" title="Open Preview dialog for selected item"
                style={{border:0}} href="#">
                <img className="ms-ellipsis-icon" 
                    style={{maxWidth:'none'}} 
                    src="/_layouts/15/images/spcommon.png?rev=43" 
                    alt="Open Preview"/>
                </a>
        </div>

}