
import * as React from 'react';
import { fileImages, getQueryStringValue } from '../../../services/shared';
import { findDOMNode } from 'react-dom';


const classNames = require('classnames');
const CSSModules = require('react-css-modules');
const styles = require('./waste-expo.scss');

// declare var $:any;

/***
 * Child Component
 */
@CSSModules(styles, {errorWhenNotFound: true, allowMultiple: true})
export class Results extends React.Component<any, any> {
    constructor(props:any) {
        super(props);
    }
    /***
     * Methods
     */
    generateResult = (item, key) => {
        // let sortedItems = _.orderBy(items, ['name'], ['asc']);
        // console.log(JSON.stringify(item,null,4));
        return <a key={key} href={item.image}
                    data-ngthumb={item.image}
                    data-ngdesc={item.image}
                >
        </a>
    }

    render () {
        let totalItems = this.props.totalItems;
        let totalPages = this.props.totalPages;
        let page = this.props.page;
        let onClick = this.props.onClick;
        let onClickPrev = this.props.onClickPrev;
        let onClickNext = this.props.onClickNext;
        let ready = this.props.ready;
        let items = this.props.items;

        if (page) {
            return <div style={{minHeight: '100vh'}}>
                <Pagination onClick={onClick} onClickPrev={onClickPrev} onClickNext={onClickNext} page={page} totalPages={totalPages}/> 
                <div id="nanoGallery">
                    {_.map(items[page], this.generateResult)}
                </div>
            </div>
        }
        
        // no results to render
        return <div style={{minHeight: '100vh'}}>
        </div>
    }
}

interface PropsValue {
    totalPages:number
    page: number
    onClick:any
    onClickPrev:any
    onClickNext:any
}

let Pagination:React.StatelessComponent<PropsValue> = (props) => {
    /**
     * Event Handlers
     */
    let handleClick = (pageNumber) => {
        if (props.onClick) {
            props.onClick(pageNumber);
        }
    }

    let handlePrevClick = (currentPage) => {
        if (props.onClickPrev) {
            props.onClickPrev(currentPage);
        }
    }

    let handleNextClick = (currentPage) => {
        if (props.onClickNext) {
            props.onClickNext(currentPage);
        }
    }

    /**
     * Methods
     */
    function renderPageNavigation(pages, currentPage) {
        //console.log('pages:', pages);
        
        let pageLinks = [];
        if (currentPage > 1)
                pageLinks.push(<div key={`prev${currentPage}`} onClick={ ()=>{handlePrevClick(currentPage)} } styleName="paginationPrev">Previous</div>);
        
        for (var index = 0; index < pages; index++) {
            let pageNumber = index+1;
            let cssStyle = (pageNumber === currentPage)? 'paginationItem currentPage': 'paginationItem';
            // console.log('currentPage:', currentPage);

            pageLinks.push(
                <div key={index} styleName={cssStyle} onClick={ ()=>{handleClick(pageNumber)} }>{pageNumber}</div>
            );
        }

        if (currentPage !== pages && currentPage !== 0)
            pageLinks.push(<div key={`next${currentPage}`} onClick={ ()=>{handleNextClick(currentPage)} } styleName="paginationNext">Next</div>);           

		return <div>
            {pageLinks}			
		</div>
    }
    return <div className={styles.currentPage} styleName="nanoGalleryPagination" style={{display: 'block'}}>
        {renderPageNavigation(props.totalPages, props.page)}
    </div>
}
Pagination = CSSModules(Pagination, styles, {errorWhenNotFound: true, allowMultiple: true}); // use styles (waste-expo.scss) inside Pagination Component