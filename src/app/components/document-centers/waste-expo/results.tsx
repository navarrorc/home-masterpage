
import * as React from 'react';
import { fileImages } from '../../../services/shared';
import { findDOMNode } from 'react-dom';

var Modal = require('react-modal');

declare var unescape: any;

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

    generateResult = (item, key) => {
        // let sortedItems = _.orderBy(items, ['name'], ['asc']);
        // console.log(JSON.stringify(item,null,4));
        return  <a key={key} href={item.imageName}
                    data-ngthumb={item.imageName}
                    data-ngdesc={key+1}
                >
            </a>
    }
    
    render () {
        let totalItems = this.props.totalItems;
        let ready = this.props.ready;
        let items = this.props.items;
        // console.log('rendering all results...');        
        return <div id="nanoGallery">
                {_.map(items, this.generateResult)}
            </div>
    }
}